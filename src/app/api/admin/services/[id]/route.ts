import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, jsonError } from "@/lib/api";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().nullable().optional(),
  durationMin: z.number().int().min(5).max(480).optional(),
  priceCents: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? "Neveljavni podatki");
  }

  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) return jsonError("Storitev ni najdena", 404);

  const service = await prisma.service.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json({ service });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const existing = await prisma.service.findUnique({
    where: { id },
    include: { _count: { select: { appointments: true } } },
  });

  if (!existing) return jsonError("Storitev ni najdena", 404);

  if (existing._count.appointments > 0) {
    await prisma.service.update({ where: { id }, data: { active: false } });
    return NextResponse.json({ deactivated: true });
  }

  await prisma.service.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}
