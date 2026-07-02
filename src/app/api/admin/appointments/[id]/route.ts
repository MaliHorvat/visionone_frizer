import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { AppointmentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireStaff, jsonError } from "@/lib/api";

const updateSchema = z.object({
  status: z.nativeEnum(AppointmentStatus),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireStaff();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Neveljavni podatki");
  }

  const existing = await prisma.appointment.findUnique({ where: { id } });
  if (!existing) return jsonError("Termin ni najden", 404);

  if (auth.session.stylistId && existing.stylistId !== auth.session.stylistId) {
    return jsonError("Dostop zavrnjen", 403);
  }

  const appointment = await prisma.appointment.update({
    where: { id },
    data: { status: parsed.data.status },
    include: {
      stylist: { select: { name: true } },
      service: { select: { name: true } },
    },
  });

  return NextResponse.json({ appointment });
}
