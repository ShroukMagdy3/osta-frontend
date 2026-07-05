"use client";

import { useEffect, useState } from "react";

import type { Invoice } from "@/types/invoice.types";
import Navbar from "@/components/layout/client/Navbar";
import InvoiceCard from "@/components/sections/client/invoices/invoiceCard";
import { invoiceApi } from "@/api/services/invoices.service";
import InvoiceModal2 from "@/components/sections/client/invoices/invoiceModal2";

export default function MyInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    invoiceApi
      .getMyInvoices()
      .then(setInvoices)
      .catch((e) => setError(e instanceof Error ? e.message : "حصل خطأ في تحميل الفواتير"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div dir="rtl" className="min-h-screen bg-[#F3F4F6]">
      <div className="relative primary-gradient" >
        <div className="relative lg:p-5 z-20">
          <Navbar />
        </div>

        <div className="px-6 pt-6 pb-20">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-2">الفواتير</h1>
            <p className="text-sm text-white/70">
              يمكنك استعراض جميع الفواتير التي لم سدادها وإحمالها في أي وقت.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-8 pb-16">
        <div className="px-2 py-2">
          <div className="flex items-center justify-start gap-2 mb-6">
            <span className="text-sm font-semibold text-black">
              سجل الفواتير
            </span>
            <span
              className="text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full"
              style={{ backgroundColor: "#E8F8BA" }}
            >
              {invoices.length}
            </span>
          </div>

          {loading && (
  <div className="flex justify-center py-10">
    <div className="w-8 h-8 border-3 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
  </div>
)}
          {error && (
            <p className="text-center text-red-500 text-sm py-10">{error}</p>
          )}

          {!loading && !error && invoices.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-10">لا توجد فواتير حتى الآن</p>
          )}

          {!loading && !error && invoices.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {invoices.map((invoice) => (
                <InvoiceCard
                  key={invoice._id}
                  invoice={invoice}
                  onOpen={setSelectedInvoice}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedInvoice && (
        <InvoiceModal2
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}