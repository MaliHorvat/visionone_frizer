"use client";

import { useEffect, useState } from "react";
import {
  addMonths,
  format,
  getDay,
  getDaysInMonth,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfDay,
  startOfMonth,
  subMonths,
} from "date-fns";
import { sl } from "date-fns/locale";

type BookingCalendarProps = {
  selectedDate: string;
  onSelect: (date: string) => void;
  stylistId: string;
  serviceId: string;
};

const WEEKDAYS = ["Po", "To", "Sr", "Če", "Pe", "So", "Ne"];

export function BookingCalendar({
  selectedDate,
  onSelect,
  stylistId,
  serviceId,
}: BookingCalendarProps) {
  const [viewDate, setViewDate] = useState(() =>
    startOfMonth(parse(selectedDate, "yyyy-MM-dd", new Date()))
  );
  const [availability, setAvailability] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(
      `/api/bookings/availability?stylistId=${stylistId}&serviceId=${serviceId}&year=${viewDate.getFullYear()}&month=${viewDate.getMonth() + 1}`
    )
      .then((r) => r.json())
      .then((data) => setAvailability(data.availability ?? {}))
      .finally(() => setLoading(false));
  }, [stylistId, serviceId, viewDate]);

  const monthStart = startOfMonth(viewDate);
  const daysInMonth = getDaysInMonth(viewDate);
  const startWeekday = (getDay(monthStart) + 6) % 7;
  const today = startOfDay(new Date());
  const selected = parse(selectedDate, "yyyy-MM-dd", new Date());

  const cells: (Date | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), i + 1);
      return d;
    }),
  ];

  return (
    <div className="w-full rounded-xl border border-border bg-card p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-2 sm:mb-4">
        <button
          type="button"
          onClick={() => setViewDate(subMonths(viewDate, 1))}
          className="touch-target shrink-0 rounded-lg px-3 py-2 text-sm hover:bg-background"
          aria-label="Prejšnji mesec"
        >
          ←
        </button>
        <h4 className="min-w-0 truncate text-center text-sm font-medium capitalize sm:text-base">
          {format(viewDate, "LLLL yyyy", { locale: sl })}
        </h4>
        <button
          type="button"
          onClick={() => setViewDate(addMonths(viewDate, 1))}
          className="touch-target shrink-0 rounded-lg px-3 py-2 text-sm hover:bg-background"
          aria-label="Naslednji mesec"
        >
          →
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-0.5 sm:gap-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-1 text-center text-[10px] font-medium text-muted sm:text-xs">
            {d}
          </div>
        ))}
      </div>

      <div className={`grid grid-cols-7 gap-0.5 sm:gap-1 ${loading ? "opacity-50" : ""}`}>
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;

          const dateStr = format(day, "yyyy-MM-dd");
          const isPast = day < today;
          const hasSlots = availability[dateStr] > 0;
          const isSelected = isSameDay(day, selected);
          const isCurrentMonth = isSameMonth(day, viewDate);
          const disabled = isPast || !hasSlots;

          return (
            <button
              key={dateStr}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(dateStr)}
              className={`relative flex min-h-[40px] flex-col items-center justify-center rounded-lg text-xs transition sm:min-h-[44px] sm:text-sm ${
                isSelected
                  ? "bg-primary font-semibold text-white"
                  : disabled
                    ? "cursor-not-allowed text-muted/40"
                    : hasSlots
                      ? "hover:bg-primary/10 hover:text-primary"
                      : "text-muted/60"
              } ${!isCurrentMonth ? "opacity-40" : ""} ${isToday(day) && !isSelected ? "ring-1 ring-primary/40" : ""}`}
            >
              {day.getDate()}
              {hasSlots && !isSelected && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-green-500" />
              )}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 align-middle" /> Prosti
        termini
      </p>
    </div>
  );
}
