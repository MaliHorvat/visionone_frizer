import {
  addDays,
  addMinutes,
  endOfMonth,
  format,
  parse,
  setHours,
  setMinutes,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { prisma } from "./prisma";

export function formatPrice(cents: number) {
  return new Intl.NumberFormat("sl-SI", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function parseTimeOnDate(date: Date, time: string) {
  const parsed = parse(time, "HH:mm", date);
  return setMinutes(setHours(startOfDay(date), parsed.getHours()), parsed.getMinutes());
}

export async function getAvailableSlots(
  stylistId: string,
  serviceId: string,
  dateStr: string
): Promise<string[]> {
  const date = parse(dateStr, "yyyy-MM-dd", new Date());
  const dayOfWeek = date.getDay();

  const [service, workingHour, appointments] = await Promise.all([
    prisma.service.findUnique({ where: { id: serviceId } }),
    prisma.workingHour.findUnique({
      where: { stylistId_dayOfWeek: { stylistId, dayOfWeek } },
    }),
    prisma.appointment.findMany({
      where: {
        stylistId,
        startTime: {
          gte: startOfDay(date),
          lt: addMinutes(startOfDay(date), 24 * 60),
        },
        status: { not: "CANCELLED" },
      },
    }),
  ]);

  if (!service || !workingHour) return [];

  const workStart = parseTimeOnDate(date, workingHour.startTime);
  const workEnd = parseTimeOnDate(date, workingHour.endTime);
  const slotDuration = 15;
  const slots: string[] = [];
  let current = workStart;

  while (addMinutes(current, service.durationMin) <= workEnd) {
    const slotEnd = addMinutes(current, service.durationMin);
    const hasConflict = appointments.some(
      (apt) => current < apt.endTime && slotEnd > apt.startTime
    );

    if (!hasConflict && current > new Date()) {
      slots.push(format(current, "HH:mm"));
    }

    current = addMinutes(current, slotDuration);
  }

  return slots;
}

export async function getMonthAvailability(
  stylistId: string,
  serviceId: string,
  year: number,
  month: number
): Promise<Record<string, number>> {
  const monthStart = startOfMonth(new Date(year, month - 1));
  const monthEnd = endOfMonth(monthStart);
  const result: Record<string, number> = {};
  let current = monthStart;
  const today = startOfDay(new Date());

  while (current <= monthEnd) {
    const dateStr = format(current, "yyyy-MM-dd");
    if (current >= today) {
      const slots = await getAvailableSlots(stylistId, serviceId, dateStr);
      if (slots.length > 0) {
        result[dateStr] = slots.length;
      }
    }
    current = addDays(current, 1);
  }

  return result;
}

export const DAY_NAMES = [
  "Nedelja",
  "Ponedeljek",
  "Torek",
  "Sreda",
  "Četrtek",
  "Petek",
  "Sobota",
];
