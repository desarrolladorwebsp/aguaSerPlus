import { AdminAuthGate } from "@/lib/admin/auth";
import { AdminStoreProvider } from "@/lib/admin/store";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGate>
      <AdminStoreProvider>
        <AdminShell>{children}</AdminShell>
      </AdminStoreProvider>
    </AdminAuthGate>
  );
}
