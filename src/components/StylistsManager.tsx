"use client";

import { useEffect, useState } from "react";
import { DAY_NAMES } from "@/lib/booking";
import { ImageUpload } from "./ImageUpload";
import { StylistAvatar } from "./StylistAvatar";

type Service = { id: string; name: string };
type WorkingHour = { dayOfWeek: number; startTime: string; endTime: string };
type Stylist = {
  id: string;
  name: string;
  bio: string | null;
  imageUrl: string | null;
  active: boolean;
  services: Service[];
  workingHours: WorkingHour[];
  user: { id: string; email: string; name: string } | null;
};

const DEFAULT_HOURS: WorkingHour[] = [
  { dayOfWeek: 1, startTime: "08:00", endTime: "16:00" },
  { dayOfWeek: 2, startTime: "08:00", endTime: "16:00" },
  { dayOfWeek: 3, startTime: "08:00", endTime: "16:00" },
  { dayOfWeek: 4, startTime: "08:00", endTime: "16:00" },
  { dayOfWeek: 5, startTime: "08:00", endTime: "16:00" },
];

export function StylistsManager() {
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    bio: "",
    imageUrl: null as string | null,
    active: true,
    serviceIds: [] as string[],
    workingHours: DEFAULT_HOURS,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function loadData() {
    setLoading(true);
    Promise.all([
      fetch("/api/admin/stylists").then((r) => r.json()),
      fetch("/api/admin/services").then((r) => r.json()),
    ])
      .then(([stylistsData, servicesData]) => {
        setStylists(stylistsData.stylists ?? []);
        setAllServices(servicesData.services ?? []);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadData();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm({
      name: "",
      bio: "",
      imageUrl: null,
      active: true,
      serviceIds: allServices.filter((s) => s).map((s) => s.id),
      workingHours: DEFAULT_HOURS,
    });
    setError("");
    setShowForm(true);
  }

  function openEdit(stylist: Stylist) {
    setEditingId(stylist.id);
    setForm({
      name: stylist.name,
      bio: stylist.bio ?? "",
      imageUrl: stylist.imageUrl,
      active: stylist.active,
      serviceIds: stylist.services.map((s) => s.id),
      workingHours:
        stylist.workingHours.length > 0 ? stylist.workingHours : DEFAULT_HOURS,
    });
    setError("");
    setShowForm(true);
  }

  function toggleService(serviceId: string) {
    setForm((prev) => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(serviceId)
        ? prev.serviceIds.filter((id) => id !== serviceId)
        : [...prev.serviceIds, serviceId],
    }));
  }

  function updateHour(dayOfWeek: number, field: "startTime" | "endTime", value: string) {
    setForm((prev) => {
      const hours = [...prev.workingHours];
      const idx = hours.findIndex((h) => h.dayOfWeek === dayOfWeek);
      if (idx >= 0) {
        hours[idx] = { ...hours[idx], [field]: value };
      } else {
        hours.push({ dayOfWeek, startTime: "08:00", endTime: "16:00", [field]: value });
      }
      return { ...prev, workingHours: hours };
    });
  }

  function toggleDay(dayOfWeek: number) {
    setForm((prev) => {
      const exists = prev.workingHours.some((h) => h.dayOfWeek === dayOfWeek);
      return {
        ...prev,
        workingHours: exists
          ? prev.workingHours.filter((h) => h.dayOfWeek !== dayOfWeek)
          : [...prev.workingHours, { dayOfWeek, startTime: "08:00", endTime: "16:00" }],
      };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: form.name,
      bio: form.bio || null,
      imageUrl: form.imageUrl,
      active: form.active,
      serviceIds: form.serviceIds,
      workingHours: form.workingHours,
    };

    const res = await fetch(
      editingId ? `/api/admin/stylists/${editingId}` : "/api/admin/stylists",
      {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? "Napaka pri shranjevanju");
      return;
    }

    setShowForm(false);
    loadData();
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-medium">Frizerji</h2>
        <button
          onClick={openCreate}
          className="touch-target w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary-dark sm:w-auto sm:py-2"
        >
          + Dodaj frizerja
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-xl border border-border bg-card p-6 shadow-sm"
        >
          <h3 className="mb-4 font-medium">
            {editingId ? "Uredi frizerja" : "Nov frizer"}
          </h3>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <div className="space-y-4">
            <ImageUpload
              value={form.imageUrl}
              onChange={(url) => setForm({ ...form, imageUrl: url })}
              label="Fotografija frizerja"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Ime *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-border px-3 py-2"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">Kratek opis</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-border px-3 py-2"
                  placeholder="Specializacija, izkušnje..."
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Storitve</label>
              <div className="flex flex-wrap gap-2">
                {allServices.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => toggleService(service.id)}
                    className={`rounded-full px-3 py-1 text-sm transition ${
                      form.serviceIds.includes(service.id)
                        ? "bg-primary text-white"
                        : "border border-border hover:border-primary"
                    }`}
                  >
                    {service.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Delovni čas</label>
              <div className="space-y-2">
                {DAY_NAMES.map((dayName, dayOfWeek) => {
                  const hour = form.workingHours.find((h) => h.dayOfWeek === dayOfWeek);
                  const active = !!hour;
                  return (
                    <div key={dayOfWeek} className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:gap-3 sm:border-0 sm:p-0">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => toggleDay(dayOfWeek)}
                          className="h-5 w-5"
                        />
                        <span className="w-24 text-sm font-medium">{dayName}</span>
                      </div>
                      {active && hour && (
                        <div className="flex items-center gap-2 pl-8 sm:pl-0">
                          <input
                            type="time"
                            value={hour.startTime}
                            onChange={(e) => updateHour(dayOfWeek, "startTime", e.target.value)}
                            className="w-full rounded border border-border px-2 py-2 text-sm sm:w-auto"
                          />
                          <span className="text-muted">–</span>
                          <input
                            type="time"
                            value={hour.endTime}
                            onChange={(e) => updateHour(dayOfWeek, "endTime", e.target.value)}
                            className="w-full rounded border border-border px-2 py-2 text-sm sm:w-auto"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {editingId && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="stylist-active"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="h-4 w-4"
                />
                <label htmlFor="stylist-active" className="text-sm">
                  Frizer je aktiven (viden strankam)
                </label>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              type="submit"
              disabled={saving}
              className="touch-target rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50 sm:py-2"
            >
              {saving ? "Shranjevanje..." : "Shrani"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="touch-target rounded-lg border border-border px-6 py-3 text-sm hover:bg-background sm:py-2"
            >
              Prekliči
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {stylists.map((stylist) => (
          <div
            key={stylist.id}
            className={`rounded-xl border bg-card p-5 ${
              stylist.active ? "border-border" : "border-border/50 opacity-60"
            }`}
          >
            <div className="flex items-start gap-4">
              <StylistAvatar name={stylist.name} imageUrl={stylist.imageUrl} size="lg" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{stylist.name}</h3>
                  {!stylist.active && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">Neaktiven</span>
                  )}
                </div>
                {stylist.bio && <p className="mt-1 text-sm text-muted">{stylist.bio}</p>}
                <p className="mt-2 text-xs text-muted">
                  {stylist.services.length} storitev · {stylist.workingHours.length} delovnih dni
                  {stylist.user && ` · Povezan: ${stylist.user.email}`}
                </p>
              </div>
            </div>
            <button
              onClick={() => openEdit(stylist)}
              className="mt-4 w-full rounded-lg border border-border py-2 text-sm hover:bg-background"
            >
              Uredi
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
