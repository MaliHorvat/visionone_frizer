import { redirect } from "next/navigation";
import { getSession, isAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/AdminNav";
import { StylistsManager } from "@/components/StylistsManager";

export default async function StylistsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/prijava");
  if (!isAdmin(session)) redirect("/admin");

  return (
    <div className="min-h-screen bg-background">
      <AdminNav user={session} />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <StylistsManager />
      </main>
    </div>
  );
}
