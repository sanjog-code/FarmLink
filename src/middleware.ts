import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "farmlink-secret";

interface JWTPayload {
  userId: string;
  role: string;
  name: string;
}

async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(JWT_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    );

    const signature = await crypto.subtle.sign(
      "HMAC",
      key,
      enc.encode(`${parts[0]}.${parts[1]}`)
    );

    const expected = btoa(String.fromCharCode(...new Uint8Array(signature)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    if (expected !== parts[2]) return null;

    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf-8")
    );
    if (!payload.userId || !payload.role) return null;
    return { userId: payload.userId, role: payload.role, name: payload.name };
  } catch {
    return null;
  }
}

const adminRoutes = ["/admin"];
const farmerRoutes = ["/farmer-dashboard"];
const bulkBuyerRoutes = ["/bulk-buyer"];

function isPublicRoute(pathname: string) {
  return (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/marketplace") ||
    pathname.startsWith("/bulk-marketplace")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip all API routes - each route handler enforces its own auth
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Public: homepage, auth pages, and marketplace browsing (guests allowed)
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("farmlink_token")?.value;
  const authHeader = request.headers.get("authorization");
  const authToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : token;

  if (!authToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const payload = await verifyToken(authToken);
  if (!payload) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("farmlink_token");
    return response;
  }

  const role = payload.role;

  if (adminRoutes.some((r) => pathname.startsWith(r)) && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (farmerRoutes.some((r) => pathname.startsWith(r)) && role !== "FARMER" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (bulkBuyerRoutes.some((r) => pathname.startsWith(r)) && role !== "BULK_BUYER" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
