import VerificationGate from "@/components/auth/VerificationGate";
import AdminNavbar from "@/components/layout/admin/Navbar";
import Footer from '@/components/layout/Footer';
import "@/styles/sectionsLayout.css";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <VerificationGate allowedRoles={["admin"]}>
      <>
        <AdminNavbar />
        <main>{children}</main>
        <Footer />
      </>
    </VerificationGate>
  );
}
