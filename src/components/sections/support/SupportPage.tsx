"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import HelpCenterTab from "./HelpCenterTab";
import TicketsTab from "./TicketsTab";
import SubmitTicketModal from "./SubmitTicketModal";
import ShowTicketModal from "./ShowTicketModal";
import SuccessPopup from "./SuccessPopup";

type SupportSubTab = "help" | "tickets";

const HERO_COPY: Record<SupportSubTab, { title: string; subtitle: string }> = {
  help: {
    title: "مركز المساعدة",
    subtitle: "كل ما تحتاج معرفته عن منصة أسطى في مكان واحد",
  },
  tickets: {
    title: "التذاكر",
    subtitle: "كل ما تحتاج معرفته عن منصة أسطى في مكان واحد",
  },
};

export default function SupportPage() {
  const searchParams = useSearchParams();
  const activeTab: SupportSubTab =
    searchParams.get("tab") === "tickets" ? "tickets" : "help";

  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [showTicketId, setShowTicketId] = useState<string | null>(null);
  const [successTicketNumber, setSuccessTicketNumber] = useState<string | null>(
    null
  );
  const [refreshKey, setRefreshKey] = useState(0);

  const hero = HERO_COPY[activeTab];

  const handleTicketCreated = (ticketNumber: string) => {
    setSubmitModalOpen(false);
    setSuccessTicketNumber(ticketNumber);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div dir="rtl">
      {/* Hero */}
      <div className="primary-gradient">
        <div className="w-4/5 mx-auto pt-10 pb-16">
          <h1 className="text-3xl font-bold text-white mb-2">{hero.title}</h1>
          <p className="text-white/60 text-sm">{hero.subtitle}</p>
        </div>
      </div>

      {/* Body */}
      <div className="w-4/5 mx-auto -mt-8 pb-16">
        {activeTab === "help" ? (
          <HelpCenterTab />
        ) : (
          <TicketsTab
            refreshKey={refreshKey}
            onRaiseTicket={() => setSubmitModalOpen(true)}
            onShowTicket={(id) => setShowTicketId(id)}
          />
        )}
      </div>

      {/* Modals */}
      {submitModalOpen && (
        <SubmitTicketModal
          onClose={() => setSubmitModalOpen(false)}
          onSuccess={handleTicketCreated}
        />
      )}

      {showTicketId && (
        <ShowTicketModal
          ticketId={showTicketId}
          onClose={() => setShowTicketId(null)}
        />
      )}

      {successTicketNumber && (
        <SuccessPopup
          ticketNumber={successTicketNumber}
          onClose={() => setSuccessTicketNumber(null)}
        />
      )}
    </div>
  );
}
