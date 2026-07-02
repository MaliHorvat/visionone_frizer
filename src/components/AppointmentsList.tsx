"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { sl } from "date-fns/locale";
import { formatPrice } from "@/lib/booking";

import { StylistAvatar } from "./StylistAvatar";

type Appointment = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  startTime: string;
  endTime: string;
  status: string;
  notes: string | null;
  stylist: { id: string; name: string; imageUrl?: string | null };
  service: { name: string; durationMin: number; priceCents: number };
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Čaka",
  CONFIRMED: "Potrjeno",
  CANCELLED: "Preklicano",
  COMPLETED: "Opravljeno",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  COMPLETED: "bg-blue-100 text-blue-800",
};

export function AppointmentsList({
  stylistId,
  isAdmin = false,
}: {
  stylistId?: string | null;
  isAdmin?: boolean;
}) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"upcoming" | "all">("upcoming");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (stylistId) params.set("stylistId", stylistId);
    if (filter === "upcoming") {
      params.set("from", new Date().toISOString());
    }

    fetch(`/api/admin/appointments?${params}`)
      .then((r) => r.json())
      .then((data) => setAppointments(data.appointments ?? []))
      .finally(() => setLoading(false));
  }, [stylistId, filter]);

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/admin/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      const data = await res.json();
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...data.appointment } : a))
      );
    }
  }

  const filtered = appointments.filter((apt) => {
    const matchesSearch =
      !search ||
      apt.customerName.toLowerCase().includes(search.toLowerCase()) ||
      apt.customerPhone.includes(search) ||
      apt.stylist.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = appointments.filter((a) => a.status === "PENDING").length;

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      {pendingCount > 0 && (
        <div className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {pendingCount} {pendingCount === 1 ? "termin čaka" : "terminov čaka"} na potrditev
        </div>
      )}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <input
          type="search"
          placeholder="Išči po imenu, telefonu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm sm:min-w-[200px] sm:flex-1"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full rounded-lg border border-border bg-card px-3 py-3 text-sm sm:w-auto"
        >
          <option value="all">Vsi statusi</option>
          <option value="PENDING">Čaka</option>
          <option value="CONFIRMED">Potrjeno</option>
          <option value="COMPLETED">Opravljeno</option>
          <option value="CANCELLED">Preklicano</option>
        </select>
      </div>

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilter("upcoming")}
          className={`touch-target flex-1 rounded-lg px-4 py-2.5 text-sm sm:flex-none ${
            filter === "upcoming" ? "bg-primary text-white" : "bg-card text-muted"
          }`}
        >
          Prihajajoči
        </button>
        <button
          onClick={() => setFilter("all")}
          className={`touch-target flex-1 rounded-lg px-4 py-2.5 text-sm sm:flex-none ${
            filter === "all" ? "bg-primary text-white" : "bg-card text-muted"
          }`}
        >
          Vsi
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-muted">
          {appointments.length === 0 ? "Ni naročenih terminov." : "Ni rezultatov za iskanje."}
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((apt) => (
            <div
              key={apt.id}
              className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5"
            >
              <div className="flex flex-col gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <StylistAvatar
                      name={apt.stylist.name}
                      imageUrl={apt.stylist.imageUrl}
                      size="sm"
                    />
                    <h3 className="font-semibold">{apt.customerName}</h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        STATUS_COLORS[apt.status] ?? "bg-gray-100"
                      }`}
                    >
                      {STATUS_LABELS[apt.status] ?? apt.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    {format(new Date(apt.startTime), "EEEE, d. MMMM yyyy · HH:mm", { locale: sl })} –{" "}
                    {format(new Date(apt.endTime), "HH:mm")}
                  </p>
                  <p className="mt-2 break-words text-sm">
                    <span className="text-muted">Frizer:</span> {apt.stylist.name}
                    <br className="sm:hidden" />
                    <span className="hidden sm:inline"> · </span>
                    <span className="text-muted">Storitev:</span> {apt.service.name} (
                    {formatPrice(apt.service.priceCents)})
                  </p>
                  <p className="mt-1 break-all text-sm text-muted">
                    📞 {apt.customerPhone}
                    {apt.customerEmail && (
                      <>
                        <br />
                        ✉ {apt.customerEmail}
                      </>
                    )}
                  </p>
                  {apt.notes && (
                    <p className="mt-2 text-sm italic text-muted">Opomba: {apt.notes}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 border-t border-border pt-3 sm:border-0 sm:pt-0">
                  {apt.status === "PENDING" && (
                    <button
                      onClick={() => updateStatus(apt.id, "CONFIRMED")}
                      className="touch-target flex-1 rounded-lg bg-green-600 px-3 py-2.5 text-xs font-medium text-white hover:bg-green-700 sm:flex-none sm:py-1.5"
                    >
                      Potrdi
                    </button>
                  )}
                  {(apt.status === "PENDING" || apt.status === "CONFIRMED") && (
                    <>
                      <button
                        onClick={() => updateStatus(apt.id, "COMPLETED")}
                        className="touch-target flex-1 rounded-lg bg-blue-600 px-3 py-2.5 text-xs font-medium text-white hover:bg-blue-700 sm:flex-none sm:py-1.5"
                      >
                        Opravljeno
                      </button>
                      <button
                        onClick={() => updateStatus(apt.id, "CANCELLED")}
                        className="touch-target flex-1 rounded-lg border border-red-300 px-3 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 sm:flex-none sm:py-1.5"
                      >
                        Prekliči
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
