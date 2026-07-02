import { NextRequest, NextResponse } from "next/server";
import { addMinutes } from "date-fns";
import { prisma } from "@/lib/prisma";
import { getAvailableSlots, parseTimeOnDate } from "@/lib/booking";
import { jsonError } from "@/lib/api";

export async function GET(request: NextRequest) {
  const stylistId = request.nextUrl.searchParams.get("stylistId");
  const serviceId = request.nextUrl.searchParams.get("serviceId");
  const date = request.nextUrl.searchParams.get("date");

  if (!stylistId || !serviceId || !date) {
    return jsonError("Manjkajoči parametri");
  }

  const slots = await getAvailableSlots(stylistId, serviceId, date);
  return NextResponse.json({ slots });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { stylistId, serviceId, date, time, customerName, customerPhone, customerEmail, notes } =
      body;

    if (!stylistId || !serviceId || !date || !time || !customerName || !customerPhone) {
      return jsonError("Izpolnite vsa obvezna polja");
    }

    const service = await prisma.service.findFirst({
      where: { id: serviceId, active: true },
    });
    const stylist = await prisma.stylist.findFirst({
      where: { id: stylistId, active: true },
    });

    if (!service || !stylist) {
      return jsonError("Storitev ali frizer ni na voljo");
    }

    const slots = await getAvailableSlots(stylistId, serviceId, date);
    if (!slots.includes(time)) {
      return jsonError("Izbrani termin ni več na voljo");
    }

    const startTime = parseTimeOnDate(new Date(date), time);
    const endTime = addMinutes(startTime, service.durationMin);

    const appointment = await prisma.appointment.create({
      data: {
        stylistId,
        serviceId,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail?.trim() || null,
        startTime,
        endTime,
        notes: notes?.trim() || null,
        status: "PENDING",
      },
      include: {
        stylist: { select: { name: true } },
        service: { select: { name: true, durationMin: true, priceCents: true } },
      },
    });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch {
    return jsonError("Naročilo ni uspelo", 500);
  }
}
