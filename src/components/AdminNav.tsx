"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/prijava");
    router.refresh();
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="text-lg font-semibold text-primary">
            Salon Admin
          </Link>
          <nav className="flex gap-1">
            {navItems
              .filter((item) => !item.adminOnly || user.role === "ADMIN")
              .map((item) => (
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
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-muted transition hover:text-primary">
            Javna stran
          </Link>
          <span className="text-sm text-muted">{user.name}</span>
          <button
            onClick={logout}
            className="text-sm text-muted transition hover:text-primary"
          >
            Odjava
          </button>
        </div>
      </div>
    </header>
  );
}
