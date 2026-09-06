import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPassword, generateToken } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { cookies } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  if (!rateLimit(ip)) {
    return errorResponse("Too many requests. Please try again later.", 429);
  }

  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return errorResponse("Identifier and password are required");
    }

    const parsed = loginSchema.safeParse({ identifier, password });
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0]?.message || "Invalid login data");
    }

    let user = null;

    // Try email
    if (identifier.includes("@")) {
      user = await prisma.user.findUnique({
        where: { email: identifier },
        include: { consumer: true, farmer: true, bulkBuyer: true, admin: true },
      });
    }
    // Try farmer ID
    else if (identifier.startsWith("FMR-")) {
      const farmer = await prisma.farmer.findUnique({
        where: { farmerId: identifier },
        include: { user: { include: { consumer: true, farmer: true, bulkBuyer: true, admin: true } } },
      });
      user = farmer?.user || null;
    }
    // Try mobile
    else if (/^\d{10}$/.test(identifier)) {
      user = await prisma.user.findUnique({
        where: { mobile: identifier },
        include: { consumer: true, farmer: true, bulkBuyer: true, admin: true },
      });
    }
    // Try GST
    else {
      const bulkBuyer = await prisma.bulkBuyer.findUnique({
        where: { gstNumber: identifier },
        include: { user: { include: { consumer: true, farmer: true, bulkBuyer: true, admin: true } } },
      });
      user = bulkBuyer?.user || null;
    }

    if (!user) {
      return errorResponse("User not found");
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return errorResponse("Invalid password");
    }

    const token = generateToken({
      userId: user.id,
      email: user.email || undefined,
      mobile: user.mobile || undefined,
      role: user.role,
      name: user.name,
    });

    const cookieStore = await cookies();
    cookieStore.set("farmlink_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    const { password: _, ...userWithoutPassword } = user;

    return successResponse({ user: userWithoutPassword, token });
  } catch (error: any) {
    console.error("Login error:", error);
    return errorResponse("Login failed: " + error.message, 500);
  }
}
