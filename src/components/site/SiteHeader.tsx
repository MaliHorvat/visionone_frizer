"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { salonConfig } from "@/lib/salon-config";

const navLinks = [
  { href: "/#domov", label: "Domov" },
  { href: "/#storitve", label: "Storitve" },
  { href: "/#o-nas", label: "O nas" },
  { href: "/#galerija", label: "Galerija" },
  { href: "/#kontakt", label: "Kontakt" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-card/95 shadow-sm backdrop-blur-md" : "bg-card"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:py-4">
        <Link href="/" className="min-w-0 shrink-0">
          <span className="text-lg font-semibold text-primary sm:text-xl">{salonConfig.name}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm text-foreground/80 transition hover:bg-background hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/naroci-se"
            className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark sm:inline-block"
          >
            Naroči se
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="touch-target flex items-center justify-center rounded-lg border border-border p-2 lg:hidden"
            aria-label={menuOpen ? "Zapri meni" : "Odpri meni"}
          >
            {menuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <>
          <div className="fixed inset-0 top-[57px] z-40 bg-black/30 lg:hidden" onClick={() => setMenuOpen(false)} />
          <nav className="absolute left-0 right-0 top-full z-50 border-b border-border bg-card px-4 py-4 shadow-lg lg:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="touch-target rounded-lg px-4 py-3 text-sm hover:bg-background"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/naroci-se"
                onClick={() => setMenuOpen(false)}
                className="touch-target mt-2 rounded-full bg-primary px-4 py-3 text-center text-sm font-medium text-white"
              >
                Naroči se
              </Link>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
