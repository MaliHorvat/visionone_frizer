import Link from "next/link";
import { salonConfig } from "@/lib/salon-config";

export function ContactSection() {
  const mapsQuery = encodeURIComponent(`${salonConfig.address}, ${salonConfig.city}`);

  return (
    <section id="kontakt" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">Kontakt</p>
          <h2 className="text-3xl font-bold sm:text-4xl">Kje nas najdete</h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-semibold">Naslov</h3>
              <p className="mt-2 text-sm text-muted">
                {salonConfig.address}
                <br />
                {salonConfig.city}
              </p>
              <a
                href={`https://maps.google.com/?q=${mapsQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm text-primary hover:underline"
              >
                Odpri v Google Maps →
              </a>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold">Delovni čas</h3>
              <ul className="mt-2 space-y-1 text-sm text-muted">
                <li>{salonConfig.hours.weekdays.label}: <strong className="text-foreground">{salonConfig.hours.weekdays.time}</strong></li>
                <li>{salonConfig.hours.saturday.label}: <strong className="text-foreground">{salonConfig.hours.saturday.time}</strong></li>
                <li>{salonConfig.hours.sunday.label}: <strong className="text-foreground">{salonConfig.hours.sunday.time}</strong></li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-semibold">Kontakt</h3>
              <ul className="mt-2 space-y-1 text-sm text-muted">
                <li>
                  <a href={`tel:${salonConfig.phone.replace(/\s/g, "")}`} className="hover:text-primary">
                    {salonConfig.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${salonConfig.email}`} className="hover:text-primary">
                    {salonConfig.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-2xl bg-primary p-8 text-white sm:p-10">
            <h3 className="text-2xl font-bold sm:text-3xl">Naročite se kar preko spleta!</h3>
            <p className="mt-4 text-white/85">
              Izberite frizerja, storitev in prost termin. Brez čakanja na telefonu – hitro in enostavno.
            </p>
            <Link
              href="/naroci-se"
              className="touch-target mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-4 font-medium text-primary transition hover:bg-white/90"
            >
              Naroči se
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
