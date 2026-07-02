import { redirect } from "next/navigation";
import { getSession, isAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/AdminNav";
import { ServicesManager } from "@/components/ServicesManager";

export default async function ServicesPage() {
  const session = await getSession();
  if (!session) redirect("/admin/prijava");
  if (!isAdmin(session)) redirect("/admin");

  return (
    <div className="min-h-screen bg-background">
      <AdminNav user={session} />
      <main className="mx-auto max-w-4xl px-4 py-5 sm:py-8">
        <ServicesManager />
      </main>
    </div>
  );
}
