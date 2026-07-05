import { Suspense } from "react";
import Navbar from "@/components/layout/client/Navbar"; // or technician's
import SupportPage from "@/components/sections/support/SupportPage";

export default function ClientSupportPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={null}>
        <SupportPage />
      </Suspense>
    </>
  );
}