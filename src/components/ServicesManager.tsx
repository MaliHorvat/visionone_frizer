"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/booking";

type Service = {
  id: string;
  name: string;
  description: string | null;
  durationMin: number;
  priceCents: number;
  active: boolean;
  _count?: { appointments: number; stylists: number };
};

const emptyForm = {
  name: "",
  description: "",
  durationMin: 30,
  priceEuros: "15.00",
  active: true,
};

export function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function loadServices() {
    setLoading(true);
    fetch("/api/admin/services")
      .then((r) => r.json())
      .then((data) => setServices(data.services ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadServices();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  }

  function openEdit(service: Service) {
    setEditingId(service.id);
    setForm({
      name: service.name,
      description: service.description ?? "",
      durationMin: service.durationMin,
      priceEuros: (service.priceCents / 100).toFixed(2),
      active: service.active,
    });
    setError("");
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const priceCents = Math.round(parseFloat(form.priceEuros.replace(",", ".")) * 100);
    if (isNaN(priceCents) || priceCents < 0) {
      setError("Neveljavna cena");
      setSaving(false);
      return;
    }

    const payload = {
      name: form.name,
      description: form.description || undefined,
      durationMin: form.durationMin,
      priceCents,
      active: form.active,
    };

    const res = await fetch(
      editingId ? `/api/admin/services/${editingId}` : "/api/admin/services",
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
    loadServices();
  }

  async function toggleActive(service: Service) {
    await fetch(`/api/admin/services/${service.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !service.active }),
    });
    loadServices();
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
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-medium">Storitve</h2>
        <button
          onClick={openCreate}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          + Dodaj storitev
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-xl border border-border bg-card p-6 shadow-sm"
        >
          <h3 className="mb-4 font-medium">
            {editingId ? "Uredi storitev" : "Nova storitev"}
          </h3>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium">Ime storitve *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-border px-3 py-2"
                placeholder="npr. Striženje moški"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium">Opis</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full rounded-lg border border-border px-3 py-2"
                placeholder="Kratek opis storitve..."
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Trajanje (minute) *</label>
              <input
                required
                type="number"
                min={5}
                max={480}
                step={5}
                value={form.durationMin}
                onChange={(e) => setForm({ ...form, durationMin: parseInt(e.target.value, 10) })}
                className="w-full rounded-lg border border-border px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Cena (€) *</label>
              <input
                required
                value={form.priceEuros}
                onChange={(e) => setForm({ ...form, priceEuros: e.target.value })}
                className="w-full rounded-lg border border-border px-3 py-2"
                placeholder="15.00"
              />
            </div>
            {editingId && (
              <div className="flex items-center gap-2 sm:col-span-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="h-4 w-4 rounded"
                />
                <label htmlFor="active" className="text-sm">
                  Storitev je aktivna (vidna strankam)
                </label>
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
            >
              {saving ? "Shranjevanje..." : "Shrani"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-border px-6 py-2 text-sm hover:bg-background"
            >
              Prekliči
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {services.map((service) => (
          <div
            key={service.id}
            className={`flex items-center justify-between rounded-xl border bg-card p-4 ${
              service.active ? "border-border" : "border-border/50 opacity-60"
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{service.name}</h3>
                {!service.active && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    Neaktivna
                  </span>
                )}
              </div>
              {service.description && (
                <p className="mt-1 text-sm text-muted">{service.description}</p>
              )}
              <p className="mt-1 text-sm text-muted">
                {service.durationMin} min · {formatPrice(service.priceCents)}
                {service._count && (
                  <span>
                    {" "}
                    · {service._count.stylists} frizerjev · {service._count.appointments} terminov
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openEdit(service)}
                className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-background"
              >
                Uredi
              </button>
              <button
                onClick={() => toggleActive(service)}
                className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-background"
              >
                {service.active ? "Deaktiviraj" : "Aktiviraj"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
