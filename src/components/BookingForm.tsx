"use client";

import { useEffect, useState } from "react";
import { format, parse } from "date-fns";
import { sl } from "date-fns/locale";
import { formatPrice } from "@/lib/booking";
import { BookingCalendar } from "./BookingCalendar";
import { StylistAvatar } from "./StylistAvatar";

type Service = {
  id: string;
  name: string;
  description: string | null;
  durationMin: number;
  priceCents: number;
};

type Stylist = {
  id: string;
  name: string;
  bio: string | null;
  imageUrl: string | null;
  services: Service[];
};

type Step = "stylist" | "service" | "datetime" | "details" | "success";

const STEPS: { key: Step; label: string }[] = [
  { key: "stylist", label: "Frizer" },
  { key: "service", label: "Storitev" },
  { key: "datetime", label: "Termin" },
  { key: "details", label: "Podatki" },
];

export function BookingForm() {
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>("stylist");
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState<{
    stylist: string;
    service: string;
    date: string;
    time: string;
    price: number;
  } | null>(null);

  useEffect(() => {
    fetch("/api/stylists")
      .then((r) => r.json())
      .then((data) => setStylists(data.stylists ?? []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedStylist || !selectedService || !selectedDate) return;

    setSlotsLoading(true);
    setSelectedTime("");
    fetch(
      `/api/bookings?stylistId=${selectedStylist.id}&serviceId=${selectedService.id}&date=${selectedDate}`
    )
      .then((r) => r.json())
      .then((data) => setSlots(data.slots ?? []))
      .finally(() => setSlotsLoading(false));
  }, [selectedStylist, selectedService, selectedDate]);

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedStylist || !selectedService || !selectedTime) return;

    setSubmitting(true);
    setError("");

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stylistId: selectedStylist.id,
        serviceId: selectedService.id,
        date: selectedDate,
        time: selectedTime,
        customerName,
        customerPhone,
        customerEmail,
        notes,
      }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error ?? "Napaka pri naročanju");
      return;
    }

    setConfirmation({
      stylist: selectedStylist.name,
      service: selectedService.name,
      date: selectedDate,
      time: selectedTime,
      price: selectedService.priceCents,
    });
    setStep("success");
  }

  function BookingSummary() {
    if (!selectedStylist || !selectedService) return null;
    return (
      <div className="mb-6 rounded-xl border border-border bg-background p-4 text-sm">
        <div className="flex items-center gap-3">
          <StylistAvatar name={selectedStylist.name} imageUrl={selectedStylist.imageUrl} size="sm" />
          <div>
            <p className="font-medium">{selectedStylist.name}</p>
            <p className="text-muted">{selectedService.name}</p>
          </div>
        </div>
        {selectedDate && selectedTime && (
          <p className="mt-2 text-muted">
            {format(parse(selectedDate, "yyyy-MM-dd", new Date()), "EEEE, d. MMMM yyyy", {
              locale: sl,
            })}{" "}
            ob {selectedTime}
          </p>
        )}
        <p className="mt-1 font-medium text-primary">{formatPrice(selectedService.priceCents)}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (stylists.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-muted">
        Trenutno ni na voljo nobenega frizerja. Prosimo, poskusite kasneje.
      </div>
    );
  }

  if (step === "success" && confirmation) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">
          ✓
        </div>
        <h3 className="mb-2 text-xl font-semibold text-primary">Termin je rezerviran!</h3>
        <p className="mb-6 text-muted">
          Hvala, {customerName}. Vaš termin je bil uspešno naročen. Kmalu vas pričakujemo!
        </p>
        <dl className="space-y-3 rounded-xl bg-background p-4 text-left text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Frizer</dt>
            <dd className="font-medium">{confirmation.stylist}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Storitev</dt>
            <dd className="font-medium">{confirmation.service}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Datum</dt>
            <dd className="font-medium">
              {format(parse(confirmation.date, "yyyy-MM-dd", new Date()), "d. MMMM yyyy", {
                locale: sl,
              })}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Ura</dt>
            <dd className="font-medium">{confirmation.time}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-2">
            <dt className="text-muted">Cena</dt>
            <dd className="font-semibold text-primary">{formatPrice(confirmation.price)}</dd>
          </div>
        </dl>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 text-sm text-primary hover:underline"
        >
          Naroči nov termin
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <div className="mb-2 flex gap-2">
          {STEPS.map((s, i) => (
            <div
              key={s.key}
              className={`h-1 flex-1 rounded-full transition ${
                stepIndex >= i ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted">
          {STEPS.map((s) => (
            <span key={s.key}>{s.label}</span>
          ))}
        </div>
      </div>

      {step === "stylist" && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Izberite frizerja</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {stylists.map((stylist) => (
              <button
                key={stylist.id}
                type="button"
                onClick={() => {
                  setSelectedStylist(stylist);
                  setSelectedService(null);
                  setStep("service");
                }}
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 text-left transition hover:border-primary hover:shadow-md"
              >
                <StylistAvatar name={stylist.name} imageUrl={stylist.imageUrl} size="lg" />
                <div>
                  <p className="font-medium">{stylist.name}</p>
                  {stylist.bio && <p className="mt-1 text-sm text-muted">{stylist.bio}</p>}
                  <p className="mt-2 text-xs text-muted">
                    {stylist.services.length}{" "}
                    {stylist.services.length === 1 ? "storitev" : "storitev"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === "service" && selectedStylist && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setStep("stylist")}
            className="text-sm text-muted hover:text-primary"
          >
            ← Nazaj
          </button>
          <div className="flex items-center gap-3">
            <StylistAvatar
              name={selectedStylist.name}
              imageUrl={selectedStylist.imageUrl}
              size="sm"
            />
            <h3 className="text-lg font-medium">Izberite storitev</h3>
          </div>
          <div className="space-y-3">
            {selectedStylist.services.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => {
                  setSelectedService(service);
                  setStep("datetime");
                }}
                className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 text-left transition hover:border-primary hover:shadow-md"
              >
                <div>
                  <p className="font-medium">{service.name}</p>
                  {service.description && (
                    <p className="mt-0.5 text-sm text-muted">{service.description}</p>
                  )}
                  <p className="mt-1 text-sm text-muted">{service.durationMin} min</p>
                </div>
                <span className="font-semibold text-primary">
                  {formatPrice(service.priceCents)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === "datetime" && selectedService && selectedStylist && (
        <div className="space-y-6">
          <button
            type="button"
            onClick={() => setStep("service")}
            className="text-sm text-muted hover:text-primary"
          >
            ← Nazaj
          </button>
          <h3 className="text-lg font-medium">Izberite datum in uro</h3>

          <BookingCalendar
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
            stylistId={selectedStylist.id}
            serviceId={selectedService.id}
          />

          <div>
            <label className="mb-2 block text-sm font-medium">
              Prosti termini za{" "}
              {format(parse(selectedDate, "yyyy-MM-dd", new Date()), "d. MMMM", { locale: sl })}
            </label>
            {slotsLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Nalaganje terminov...
              </div>
            ) : slots.length === 0 ? (
              <p className="rounded-lg bg-background p-4 text-sm text-muted">
                Za izbrani dan ni prostih terminov. Izberite drug datum v koledarju.
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                      selectedTime === slot
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-card hover:border-primary"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedTime && (
            <button
              type="button"
              onClick={() => setStep("details")}
              className="w-full rounded-xl bg-primary py-3 font-medium text-white transition hover:bg-primary-dark"
            >
              Nadaljuj – {selectedTime}
            </button>
          )}
        </div>
      )}

      {step === "details" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <button
            type="button"
            onClick={() => setStep("datetime")}
            className="text-sm text-muted hover:text-primary"
          >
            ← Nazaj
          </button>
          <h3 className="text-lg font-medium">Vaši podatki</h3>

          <BookingSummary />

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium">Ime in priimek *</label>
            <input
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-4 py-3"
              placeholder="npr. Ana Novak"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Telefon *</label>
            <input
              required
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-4 py-3"
              placeholder="npr. 040 123 456"
              pattern="[0-9+\s\-]{6,}"
              title="Vnesite veljavno telefonsko številko"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">E-pošta (neobvezno)</label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-4 py-3"
              placeholder="ana@email.si"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Opombe (neobvezno)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-border bg-card px-4 py-3"
              placeholder="Posebne želje, alergije..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-primary py-3 font-medium text-white transition hover:bg-primary-dark disabled:opacity-50"
          >
            {submitting ? "Rezervacija..." : "Potrdi rezervacijo"}
          </button>
        </form>
      )}
    </div>
  );
}
