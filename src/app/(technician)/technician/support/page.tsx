import Navbar from "@/components/layout/technician/Navbar";
import SupportPage from "@/components/sections/support/SupportPage";
import { Suspense } from "react";
export default function TechnicianSupportPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={null}>
        <SupportPage />
      </Suspense>
    </>
  );
}
