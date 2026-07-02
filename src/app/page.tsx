import Link from "next/link";
import { BookingForm } from "@/components/BookingForm";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-primary">Salon</h1>
            <p className="text-sm text-muted">Rezervacija termina</p>
          </div>
          <Link
            href="/admin/prijava"
            className="text-sm text-muted transition hover:text-primary"
          >
            Prijava za osebje
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <section className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-semibold">Naročite se na termin</h2>
          <p className="mx-auto max-w-xl text-muted">
            Izberite frizerja, storitev in prost termin. Prijava ni potrebna.
          </p>
        </section>

        <BookingForm />
      </main>

      <footer className="mt-16 border-t border-border py-6 text-center text-sm text-muted">
        © {new Date().getFullYear()} Salon – Vse pravice pridržane
      </footer>
    </div>
  );
}
