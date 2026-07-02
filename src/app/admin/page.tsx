import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminNav } from "@/components/AdminNav";
import { AppointmentsList } from "@/components/AppointmentsList";

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/admin/prijava");

  return (
    <div className="min-h-screen bg-background">
      <AdminNav user={session} />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-semibold">Naročeni termini</h1>
        <AppointmentsList stylistId={session.stylistId} isAdmin={session.role === "ADMIN"} />
      </main>
    </div>
  );
}
