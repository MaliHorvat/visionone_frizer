import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, jsonError } from "@/lib/api";

const workingHourSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
});

const createSchema = z.object({
  name: z.string().min(2),
  bio: z.string().optional(),
  imageUrl: z.string().optional().nullable(),
  serviceIds: z.array(z.string()).optional(),
  workingHours: z.array(workingHourSchema).optional(),
});

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const stylists = await prisma.stylist.findMany({
    include: {
      services: true,
      workingHours: { orderBy: { dayOfWeek: "asc" } },
      user: { select: { id: true, email: true, name: true } },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ stylists });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Neveljavni podatki");
  }

  const stylist = await prisma.$transaction(async (tx) => {
    const created = await tx.stylist.create({
      data: {
        name: parsed.data.name,
        bio: parsed.data.bio,
        imageUrl: parsed.data.imageUrl,
        services: parsed.data.serviceIds?.length
          ? { connect: parsed.data.serviceIds.map((id) => ({ id })) }
          : undefined,
      },
      include: { services: true },
    });

    if (parsed.data.workingHours?.length) {
      await tx.workingHour.createMany({
        data: parsed.data.workingHours.map((h) => ({ stylistId: created.id, ...h })),
      });
    }

    return created;
  });

  return NextResponse.json({ stylist }, { status: 201 });
}
