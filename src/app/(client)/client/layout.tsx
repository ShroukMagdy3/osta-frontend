import Footer from '@/components/layout/Footer';
import ChatFloatingButton from '@/components/sections/client/ai-chat/chat-floating-button';
import VerificationGate from '@/components/auth/VerificationGate';
import "@/styles/sectionsLayout.css";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <VerificationGate allowedRoles={["client"]}>
      <>
        <main>
          {children}
        </main>
        <ChatFloatingButton/>
        <Footer />
      </>
    </VerificationGate>
  );
}
