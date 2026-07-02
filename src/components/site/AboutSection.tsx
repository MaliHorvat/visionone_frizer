import Image from "next/image";
import Link from "next/link";
import { aboutImage, salonConfig } from "@/lib/salon-config";

export function AboutSection() {
  return (
    <section id="o-nas" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
            <Image
              src={aboutImage}
              alt="Naša ekipa pri delu"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">O nas</p>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Več kot {salonConfig.yearsExperience} let izkušenj
            </h2>
            <p className="mt-6 leading-relaxed text-muted">{salonConfig.description}</p>
            <p className="mt-4 leading-relaxed text-muted">
              Naša ekipa {salonConfig.teamSize} izkušenih frizerjev se nenehno izobražuje in sledi
              najnovejšim trendom. Vsaki stranki posvetimo osebni pristop in poskrbimo, da boste
              odšli zadovoljni.
            </p>

            <ul className="mt-8 space-y-3">
              {[
                "Profesionalno striženje in oblikovanje",
                "Barvanje in nega las",
                "Prijazna in sproščena atmosfera",
                "Spletno naročanje brez čakanja",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href="/naroci-se"
              className="touch-target mt-8 inline-flex rounded-full bg-primary px-8 py-3.5 font-medium text-white transition hover:bg-primary-dark"
            >
              Rezerviraj termin
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
