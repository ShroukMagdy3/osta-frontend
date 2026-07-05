import Footer from '@/components/layout/Footer';
import VerificationGate from '@/components/auth/VerificationGate';
import TechCompanionButton from '@/components/sections/technician/ai-chat/tech-companion-button';
import "@/styles/sectionsLayout.css"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <VerificationGate allowedRoles={["technician"]}>
      <>
        <main>
          {children}
        </main>
        <TechCompanionButton />
        <Footer />
      </>
    </VerificationGate>
  );
}
