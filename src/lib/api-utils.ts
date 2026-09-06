import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "./auth";

export interface AuthUser {
  id: string;
  name: string;
  email?: string | null;
  mobile?: string | null;
  role: string;
  consumer?: any;
  farmer?: any;
  bulkBuyer?: any;
  admin?: any;
}

export function successResponse(data: any, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function unauthorizedResponse(message = "Unauthorized") {
  return NextResponse.json({ success: false, error: message }, { status: 401 });
}

export function forbiddenResponse(message = "Forbidden") {
  return NextResponse.json({ success: false, error: message }, { status: 403 });
}

export async function authenticate(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return null;
  return user as AuthUser;
}

export async function requireAuth(request: NextRequest) {
  const user = await authenticate(request);
  if (!user) {
    return { user: null, error: unauthorizedResponse() };
  }
  return { user, error: null };
}

export async function requireRole(request: NextRequest, roles: string[]) {
  const { user, error } = await requireAuth(request);
  if (error) return { user: null, error };
  if (!roles.includes(user!.role)) {
    return { user: null, error: forbiddenResponse("Insufficient permissions") };
  }
  return { user, error: null };
}
