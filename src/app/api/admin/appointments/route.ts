import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/api";

export async function GET(request: NextRequest) {
  const auth = await requireStaff();
  if ("error" in auth) return auth.error;

  const { session } = auth;
  const from = request.nextUrl.searchParams.get("from");
  const to = request.nextUrl.searchParams.get("to");
  const stylistId = request.nextUrl.searchParams.get("stylistId");

  const where: {
    stylistId?: string;
    startTime?: { gte?: Date; lte?: Date };
  } = {};

  if (session.stylistId) {
    where.stylistId = session.stylistId;
  } else if (stylistId) {
    where.stylistId = stylistId;
  }

  if (from || to) {
    where.startTime = {};
    if (from) where.startTime.gte = new Date(from);
    if (to) where.startTime.lte = new Date(to);
  }

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      stylist: { select: { id: true, name: true, imageUrl: true } },
      service: { select: { id: true, name: true, durationMin: true, priceCents: true } },
    },
    orderBy: { startTime: "asc" },
  });

  return NextResponse.json({ appointments });
}
