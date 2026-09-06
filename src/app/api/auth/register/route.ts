import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, generateFarmerId } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { rateLimit } from "@/lib/rate-limit";
import {
  consumerRegisterSchema,
  farmerRegisterSchema,
  bulkBuyerRegisterSchema,
} from "@/lib/validations";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  if (!rateLimit(ip)) {
    return errorResponse("Too many requests. Please try again later.", 429);
  }

  try {
    const body = await request.json();
    const { role, name, email, mobile, password, ...rest } = body;

    if (!role || !name || !password) {
      return errorResponse("Missing required fields");
    }

    if (password.length < 6) {
      return errorResponse("Password must be at least 6 characters");
    }

    if (role === "CONSUMER") {
      const parsed = consumerRegisterSchema.safeParse({ ...body });
      if (!parsed.success) {
        return errorResponse(
          parsed.error.errors[0]?.message || "Invalid registration data"
        );
      }
    }
    if (role === "FARMER") {
      const parsed = farmerRegisterSchema.safeParse({ ...body, farmSize: Number(rest.farmSize) });
      if (!parsed.success) {
        return errorResponse(
          parsed.error.errors[0]?.message || "Invalid registration data"
        );
      }
    }
    if (role === "BULK_BUYER") {
      const parsed = bulkBuyerRegisterSchema.safeParse({ ...body });
      if (!parsed.success) {
        return errorResponse(
          parsed.error.errors[0]?.message || "Invalid registration data"
        );
      }
    }

    const hashedPassword = await hashPassword(password);

    if (role === "CONSUMER") {
      if (!email && !mobile) return errorResponse("Email or mobile required");
      const existingUser = email
        ? await prisma.user.findUnique({ where: { email } })
        : await prisma.user.findUnique({ where: { mobile } });
      if (existingUser) return errorResponse("User already exists");

      const user = await prisma.user.create({
        data: {
          name,
          email: email || null,
          mobile: mobile || null,
          password: hashedPassword,
          role: "CONSUMER",
          consumer: {
            create: { address: rest.address || null },
          },
        },
      });

      return successResponse({ id: user.id, name: user.name }, 201);
    }

    if (role === "FARMER") {
      if (!mobile) return errorResponse("Mobile number required");
      const existing = await prisma.user.findUnique({ where: { mobile } });
      if (existing) return errorResponse("Mobile number already registered");

      const farmerId = generateFarmerId();
      const user = await prisma.user.create({
        data: {
          name,
          mobile,
          password: hashedPassword,
          role: "FARMER",
          farmer: {
            create: {
              farmerId,
              state: rest.state || "Unknown",
              district: rest.district || "Unknown",
              village: rest.village || "Unknown",
              farmSize: parseFloat(rest.farmSize) || 1,
            },
          },
        },
        include: { farmer: true },
      });

      return successResponse(
        { id: user.id, farmerId: user.farmer?.farmerId },
        201
      );
    }

    if (role === "BULK_BUYER") {
      const { firmName, gstNumber, businessAddress } = rest;
      if (!firmName || !gstNumber) {
        return errorResponse("Firm name and GST number required");
      }
      if (email) {
        const existingEmail = await prisma.user.findUnique({ where: { email } });
        if (existingEmail) return errorResponse("Email already registered");
      }
      if (mobile) {
        const existingMobile = await prisma.user.findUnique({ where: { mobile } });
        if (existingMobile) return errorResponse("Mobile already registered");
      }
      const existingGst = await prisma.bulkBuyer.findUnique({
        where: { gstNumber },
      });
      if (existingGst) return errorResponse("GST number already registered");

      const user = await prisma.user.create({
        data: {
          name: firmName,
          email: email || null,
          mobile: mobile || null,
          password: hashedPassword,
          role: "BULK_BUYER",
          bulkBuyer: {
            create: {
              firmName,
              gstNumber,
              businessAddress: businessAddress || "",
            },
          },
        },
      });

      return successResponse({ id: user.id }, 201);
    }

    return errorResponse("Invalid role");
  } catch (error: any) {
    console.error("Registration error:", error);
    return errorResponse("Registration failed: " + error.message, 500);
  }
}
