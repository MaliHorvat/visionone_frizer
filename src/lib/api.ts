import { NextResponse } from "next/server";
import { getSession } from "./auth";
import { UserRole } from "@prisma/client";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    return { error: jsonError("Ni avtorizacije", 401) };
  }
  return { session };
}

export async function requireAdmin() {
  const result = await requireAuth();
  if ("error" in result) return result;
  if (result.session.role !== UserRole.ADMIN) {
    return { error: jsonError("Dostop zavrnjen", 403) };
  }
  return result;
}

export async function requireStaff() {
  const result = await requireAuth();
  if ("error" in result) return result;
  if (result.session.role !== UserRole.ADMIN && result.session.role !== UserRole.STAFF) {
    return { error: jsonError("Dostop zavrnjen", 403) };
  }
  return result;
}
