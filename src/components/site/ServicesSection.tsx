import Link from "next/link";
import { formatPrice } from "@/lib/booking";

type Service = {
  id: string;
  name: string;
  description: string | null;
  durationMin: number;
  priceCents: number;
};

export function ServicesSection({ services }: { services: Service[] }) {
  return (
    <section id="storitve" className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">Storitve</p>
          <h2 className="text-3xl font-bold sm:text-4xl">Kaj ponujamo</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Izberite storitev in rezervirajte termin pri vašem frizerju – hitro in brez prijave.
          </p>
        </div>

        {services.length === 0 ? (
          <p className="text-center text-muted">Storitve bodo kmalu na voljo.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="group rounded-2xl border border-border bg-card p-6 transition hover:border-primary/40 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4m9-1.5a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">{service.name}</h3>
                {service.description && (
                  <p className="mt-2 text-sm text-muted">{service.description}</p>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-muted">{service.durationMin} min</span>
                  <span className="font-semibold text-primary">{formatPrice(service.priceCents)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/naroci-se"
            className="touch-target inline-flex rounded-full bg-primary px-8 py-3.5 font-medium text-white transition hover:bg-primary-dark"
          >
            Naroči se
          </Link>
        </div>
      </div>
    </section>
  );
}
