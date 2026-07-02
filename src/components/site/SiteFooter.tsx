import Link from "next/link";
import { salonConfig } from "@/lib/salon-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-foreground text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-3 text-lg font-semibold">{salonConfig.name}</h3>
            <p className="text-sm text-white/70">
              {salonConfig.address}
              <br />
              {salonConfig.city}
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/90">
              Meni
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/#domov" className="hover:text-white">Domov</Link></li>
              <li><Link href="/#storitve" className="hover:text-white">Storitve</Link></li>
              <li><Link href="/#o-nas" className="hover:text-white">O nas</Link></li>
              <li><Link href="/#galerija" className="hover:text-white">Galerija</Link></li>
              <li><Link href="/naroci-se" className="hover:text-white">Naroči se</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/90">
              Delovni čas
            </h4>
            <ul className="space-y-1 text-sm text-white/70">
              <li>{salonConfig.hours.weekdays.label}: {salonConfig.hours.weekdays.time}</li>
              <li>{salonConfig.hours.saturday.label}: {salonConfig.hours.saturday.time}</li>
              <li>{salonConfig.hours.sunday.label}: {salonConfig.hours.sunday.time}</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/90">
              Kontakt
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <a href={`tel:${salonConfig.phone.replace(/\s/g, "")}`} className="hover:text-white">
                  {salonConfig.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${salonConfig.email}`} className="hover:text-white">
                  {salonConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} {salonConfig.name} – Vse pravice pridržane</p>
          <Link href="/admin/prijava" className="hover:text-white/80">
            Prijava za osebje
          </Link>
        </div>
      </div>
    </footer>
  );
}
