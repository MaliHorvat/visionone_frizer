import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { jsonError } from "@/lib/api";

const loginSchema = z.object({
  email: z.string().email("Neveljaven e-poštni naslov"),
  password: z.string().min(1, "Geslo je obvezno"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.errors[0]?.message ?? "Neveljavni podatki");
    }

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email.toLowerCase() },
    });

    if (!user || !user.active) {
      return jsonError("Napačen e-poštni naslov ali geslo", 401);
    }

    const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
    if (!valid) {
      return jsonError("Napačen e-poštni naslov ali geslo", 401);
    }

    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      stylistId: user.stylistId,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch {
    return jsonError("Prijava ni uspela", 500);
  }
}
