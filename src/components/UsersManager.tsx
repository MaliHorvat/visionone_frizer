"use client";

import { useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  active: boolean;
  stylistId: string | null;
  stylist: { name: string } | null;
};

type Stylist = {
  id: string;
  name: string;
  user: { id: string } | null;
};

export function UsersManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    role: "STAFF",
    stylistId: "",
  });

  function loadData() {
    Promise.all([
      fetch("/api/admin/users").then((r) => r.json()),
      fetch("/api/admin/stylists").then((r) => r.json()),
    ])
      .then(([usersData, stylistsData]) => {
        setUsers(usersData.users ?? []);
        setStylists(stylistsData.stylists ?? []);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        stylistId: form.stylistId || null,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Napaka");
      return;
    }

    setShowForm(false);
    setForm({ email: "", password: "", name: "", role: "STAFF", stylistId: "" });
    loadData();
  }

  const availableStylists = stylists.filter((s) => !s.user);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-medium">Uporabniki</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          {showForm ? "Prekliči" : "+ Dodaj uporabnika"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-xl border border-border bg-card p-6 shadow-sm"
        >
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Ime</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-border px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">E-pošta</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-border px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Geslo</label>
              <input
                required
                type="password"
                minLength={8}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-lg border border-border px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Vloga</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full rounded-lg border border-border px-3 py-2"
              >
                <option value="STAFF">Osebje</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium">
                Povezan frizer (neobvezno)
              </label>
              <select
                value={form.stylistId}
                onChange={(e) => setForm({ ...form, stylistId: e.target.value })}
                className="w-full rounded-lg border border-border px-3 py-2"
              >
                <option value="">— Brez povezave —</option>
                {availableStylists.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-dark"
          >
            Shrani uporabnika
          </button>
        </form>
      )}

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-background">
            <tr>
              <th className="px-4 py-3 font-medium">Ime</th>
              <th className="px-4 py-3 font-medium">E-pošta</th>
              <th className="px-4 py-3 font-medium">Vloga</th>
              <th className="px-4 py-3 font-medium">Frizer</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3 text-muted">{user.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      user.role === "ADMIN"
                        ? "bg-primary/10 text-primary"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {user.role === "ADMIN" ? "Administrator" : "Osebje"}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">{user.stylist?.name ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
