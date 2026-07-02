import Link from "next/link";
import { BookingForm } from "@/components/BookingForm";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { salonConfig } from "@/lib/salon-config";

export const metadata = {
  title: `Naroči se – ${salonConfig.name}`,
  description: "Rezervirajte termin pri vašem frizerju – hitro in brez prijave.",
};

export default function BookingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        <div className="mb-8 text-center sm:mb-10">
          <Link href="/" className="text-sm text-muted hover:text-primary">
            ← Nazaj na domačo stran
          </Link>
          <h1 className="mt-4 text-2xl font-bold sm:text-3xl">Naročite se na termin</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted sm:text-base">
            Izberite frizerja, storitev in prost termin. Prijava ni potrebna.
          </p>
        </div>

        <BookingForm />
      </main>

      <SiteFooter />
    </div>
  );
}
