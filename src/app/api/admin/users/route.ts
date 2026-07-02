import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin, jsonError } from "@/lib/api";

const createSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Geslo mora imeti vsaj 8 znakov"),
  name: z.string().min(2),
  role: z.enum([UserRole.ADMIN, UserRole.STAFF]),
  stylistId: z.string().optional().nullable(),
});

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      active: true,
      stylistId: true,
      stylist: { select: { name: true } },
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ users });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? "Neveljavni podatki");
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });
  if (existing) {
    return jsonError("Uporabnik s tem e-poštnim naslovom že obstaja");
  }

  if (parsed.data.stylistId) {
    const stylist = await prisma.stylist.findUnique({
      where: { id: parsed.data.stylistId },
      include: { user: true },
    });
    if (!stylist) return jsonError("Frizer ne obstaja");
    if (stylist.user) return jsonError("Frizer je že povezan z uporabnikom");
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  const user = await prisma.user.create({
    data: {
      email: parsed.data.email.toLowerCase(),
      passwordHash,
      name: parsed.data.name,
      role: parsed.data.role,
      stylistId: parsed.data.stylistId || null,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      active: true,
      stylistId: true,
    },
  });

  return NextResponse.json({ user }, { status: 201 });
}
