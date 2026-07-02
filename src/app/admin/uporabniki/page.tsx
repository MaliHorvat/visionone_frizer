import { redirect } from "next/navigation";
import { getSession, isAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/AdminNav";
import { UsersManager } from "@/components/UsersManager";

export default async function UsersPage() {
  const session = await getSession();
  if (!session) redirect("/admin/prijava");
  if (!isAdmin(session)) redirect("/admin");

  return (
    <div className="min-h-screen bg-background">
      <AdminNav user={session} />
      <main className="mx-auto max-w-6xl px-4 py-5 sm:py-8">
        <UsersManager />
      </main>
    </div>
  );
}
