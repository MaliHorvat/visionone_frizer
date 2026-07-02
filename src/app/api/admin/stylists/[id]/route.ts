import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, jsonError } from "@/lib/api";

const workingHourSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
});

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  active: z.boolean().optional(),
  serviceIds: z.array(z.string()).optional(),
  workingHours: z.array(workingHourSchema).optional(),
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

  const existing = await prisma.stylist.findUnique({ where: { id } });
  if (!existing) return jsonError("Frizer ni najden", 404);

  const { serviceIds, workingHours, ...data } = parsed.data;

  const stylist = await prisma.$transaction(async (tx) => {
    if (workingHours) {
      await tx.workingHour.deleteMany({ where: { stylistId: id } });
      if (workingHours.length > 0) {
        await tx.workingHour.createMany({
          data: workingHours.map((h) => ({ stylistId: id, ...h })),
        });
      }
    }

    return tx.stylist.update({
      where: { id },
      data: {
        ...data,
        services: serviceIds
          ? { set: serviceIds.map((sid) => ({ id: sid })) }
          : undefined,
      },
      include: {
        services: true,
        workingHours: { orderBy: { dayOfWeek: "asc" } },
        user: { select: { id: true, email: true, name: true } },
      },
    });
  });

  return NextResponse.json({ stylist });
}
