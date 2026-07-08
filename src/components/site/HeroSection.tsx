import Image from "next/image";
import Link from "next/link";
import { heroImage, salonConfig } from "@/lib/salon-config";

export function HeroSection() {
  return (
    <section id="domov" className="relative min-h-[85vh] overflow-hidden">
      <Image
        src={heroImage}
        alt={`${salonConfig.name} – frizerski salon`}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/30" />

      <div className="relative mx-auto flex min-h-[85vh] max-w-6xl flex-col justify-center px-4 py-20">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-accent sm:text-base">
          {salonConfig.tagline}
        </p>
        <h1 className="max-w-2xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
          {salonConfig.name}
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
          {salonConfig.description}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/naroci-se"
            className="touch-target inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-center font-medium text-white transition hover:bg-primary-dark"
          >
            Naroči se zdaj
          </Link>
          <Link
            href="/#storitve"
            className="touch-target inline-flex items-center justify-center rounded-full border border-white/40 px-8 py-4 text-center font-medium text-white transition hover:bg-white/10"
          >
            Naše storitve
          </Link>
          <Link
            href="/admin/prijava"
            className="touch-target inline-flex items-center justify-center rounded-full border border-accent/70 px-8 py-4 text-center font-medium text-accent transition hover:bg-accent hover:text-foreground"
          >
            Portal za frizerje
          </Link>
        </div>

        <div className="mt-12 grid max-w-lg grid-cols-2 gap-4 rounded-2xl bg-white/10 p-5 backdrop-blur-sm sm:grid-cols-3">
          <div>
            <p className="text-2xl font-bold text-white">{salonConfig.yearsExperience}</p>
            <p className="text-xs text-white/70">let tradicije</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{salonConfig.teamSize}</p>
            <p className="text-xs text-white/70">frizerjev</p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-sm font-medium text-white">{salonConfig.hours.weekdays.time}</p>
            <p className="text-xs text-white/70">{salonConfig.hours.weekdays.label}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
