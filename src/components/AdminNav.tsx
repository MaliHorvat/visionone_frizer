"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { SessionUser } from "@/lib/auth";

const navItems = [
  { href: "/admin", label: "Termini" },
  { href: "/admin/frizerji", label: "Frizerji", adminOnly: true },
  { href: "/admin/storitve", label: "Storitve", adminOnly: true },
  { href: "/admin/uporabniki", label: "Uporabniki", adminOnly: true },
];

export function AdminNav({ user }: { user: SessionUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const visibleItems = navItems.filter((item) => !item.adminOnly || user.role === "ADMIN");

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/prijava");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <Link href="/admin" className="shrink-0 text-base font-semibold text-primary sm:text-lg">
            Salon Admin
          </Link>

          {/* Desktop navigacija */}
          <nav className="hidden items-center gap-1 lg:flex">
            {visibleItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm transition ${
                  pathname === item.href
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/"
              className="hidden text-sm text-muted transition hover:text-primary sm:inline"
            >
              Javna stran
            </Link>
            <span className="hidden max-w-[120px] truncate text-sm text-muted md:inline">
              {user.name}
            </span>
            <button
              onClick={logout}
              className="hidden rounded-lg px-2 py-1.5 text-sm text-muted transition hover:text-primary sm:inline"
            >
              Odjava
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="touch-target flex items-center justify-center rounded-lg border border-border p-2 lg:hidden"
              aria-label={menuOpen ? "Zapri meni" : "Odpri meni"}
              aria-expanded={menuOpen}
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
      </div>

      {/* Mobilni meni */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 top-[57px] z-40 bg-black/30 lg:hidden"
            onClick={() => setMenuOpen(false)}
            aria-hidden
          />
          <nav className="absolute left-0 right-0 top-full z-50 border-b border-border bg-card px-4 py-3 shadow-lg lg:hidden">
            <div className="flex flex-col gap-1">
              {visibleItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`touch-target rounded-lg px-4 py-3 text-sm transition ${
                    pathname === item.href
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-foreground hover:bg-background"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <hr className="my-2 border-border" />
              <Link
                href="/"
                className="touch-target rounded-lg px-4 py-3 text-sm text-muted hover:bg-background"
              >
                Javna stran
              </Link>
              <button
                onClick={logout}
                className="touch-target rounded-lg px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
              >
                Odjava ({user.name})
              </button>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
