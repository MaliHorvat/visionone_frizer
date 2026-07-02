import { addDays, endOfDay, format, startOfDay } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { sl } from "date-fns/locale";
import { prisma } from "./prisma";
import { getSalonTimezone } from "./phone";
import { buildReminderMessage, sendSms } from "./sms";

export function getTomorrowRange() {
  const tz = getSalonTimezone();
  const nowInZone = toZonedTime(new Date(), tz);
  const tomorrowStart = startOfDay(addDays(nowInZone, 1));
  const tomorrowEnd = endOfDay(addDays(nowInZone, 1));

  return {
    gte: fromZonedTime(tomorrowStart, tz),
    lte: fromZonedTime(tomorrowEnd, tz),
  };
}

export async function sendAppointmentReminders() {
  const salonName = process.env.SALON_NAME ?? "Salon";
  const salonPhone = process.env.SALON_PHONE;
  const { gte, lte } = getTomorrowRange();

  const appointments = await prisma.appointment.findMany({
    where: {
      startTime: { gte, lte },
      status: { in: ["PENDING", "CONFIRMED"] },
      reminderSentAt: null,
    },
    include: {
      stylist: { select: { name: true } },
      service: { select: { name: true } },
    },
    orderBy: { startTime: "asc" },
  });

  const results: {
    appointmentId: string;
    customerName: string;
    phone: string;
    success: boolean;
    error?: string;
  }[] = [];

  for (const apt of appointments) {
    const dateStr = format(toZonedTime(apt.startTime, getSalonTimezone()), "d. MMMM", {
      locale: sl,
    });
    const timeStr = format(toZonedTime(apt.startTime, getSalonTimezone()), "HH:mm");

    const message = buildReminderMessage({
      customerName: apt.customerName,
      date: dateStr,
      time: timeStr,
      stylistName: apt.stylist.name,
      serviceName: apt.service.name,
      salonName,
      salonPhone,
    });

    const result = await sendSms(apt.customerPhone, message);

    if (result.ok) {
      await prisma.appointment.update({
        where: { id: apt.id },
        data: { reminderSentAt: new Date() },
      });
      results.push({
        appointmentId: apt.id,
        customerName: apt.customerName,
        phone: apt.customerPhone,
        success: true,
      });
    } else {
      results.push({
        appointmentId: apt.id,
        customerName: apt.customerName,
        phone: apt.customerPhone,
        success: false,
        error: result.error,
      });
    }
  }

  return {
    checked: appointments.length,
    sent: results.filter((r) => r.success).length,
    failed: results.filter((r) => !r.success).length,
    results,
    tomorrowRange: { from: gte.toISOString(), to: lte.toISOString() },
  };
}
