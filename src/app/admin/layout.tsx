import type { Metadata } from "next";
import { AdminAuthProvider } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: "Admin | Agua Ser Plus",
  description: "Panel administrativo Agua Ser Plus",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>;
}
