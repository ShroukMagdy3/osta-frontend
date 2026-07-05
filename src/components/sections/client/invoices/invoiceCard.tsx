"use client";

import { useState } from "react";
import { Eye, Download, Wrench, CheckCircle2, Clock3, Calendar } from "lucide-react";
import type { Invoice } from "@/types/invoice.types";
import InvoiceModal2 from "./invoiceModal2";

interface Props {
  invoice: Invoice;
  onOpen: (invoice: Invoice) => void;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function InvoiceCard({ invoice, onOpen }: Props) {
  const [autoDownloading, setAutoDownloading] = useState(false);
  const serviceName = invoice.requestId?.serviceId?.name ?? "—";

  return (
    <div
      className="rounded-2xl border p-5 flex flex-col gap-2 bg-white"
      style={{ borderColor: "#E5E7EB" }}
    >
      <div className="flex items-center justify-between">
        

        <div className="text-left">
          <p className="text-xs font-semibold pb-2 ">#  {invoice.invoiceNumber}  </p>
          <p className="flex items-center gap-1 text-xs text-gray-400  justify-start">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(invoice.createdAt)}
          </p>
        </div>

        <span
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
          style={{
            backgroundColor: invoice.isPaid ? "#E8F8BA" : "#FEF3C7",
            color: invoice.isPaid ? "text-black" : "#92400E",
          }}
        >
          {invoice.isPaid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock3 className="w-3.5 h-3.5" />}
          {invoice.isPaid ? "مدفوعة بالكامل" : "مدفوعة بالجزء"}
        </span>
      </div>

      <h3 className="text-base font-bold " style={{ color: "var(--primary-color)" }}>
        {serviceName}
      </h3>

       <div className="flex items-center gap-2 pb-3">
  <div
    className="flex items-center justify-center w-8 h-8 rounded-full"
    style={{ backgroundColor: "var(--secondary-color)" }}
  >
    <Wrench
      className="w-4 h-4"
      style={{ color: "var(--primary-color)" }}
    />
  </div>

  <span className="pb-1">{invoice.technicianId?.fullName}</span>
</div>

      <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "#F3F4F6" }}>
        <div className ="py-5">
          <p className="text-xs text-gray-400 mb-1">الإجمالي المدفوع</p>
          <p style={{ color: "var(--primary-color)" }}>
            <span className ="font-bold text-3xl">{invoice.totalPrice}</span> جنيه
          </p>
        </div>

        <div className="flex items-center gap-2 pt-10">

            <button
            onClick={() => onOpen(invoice)}
            className="flex items-center gap-1.5 text-xs font-semibold hover:cursor-pointer  px-4 py-2 rounded-full border border-gray-200 transition-all"
          >
            <Eye className="w-4 h-4" />
            عرض الفاتورة
          </button>
          <button
            onClick={() => setAutoDownloading(true)}
            title="تحميل PDF"
            className="flex items-center justify-center w-9 h-9 rounded-full hover:cursor-pointer  border border-gray-200 transition-all"
          >
            <Download className="w-4 h-4" />
          </button>

          
        </div>
      </div>

      {autoDownloading && (
        <InvoiceModal2
          invoice={invoice}
          autoDownload
          onClose={() => setAutoDownloading(false)}
        />
      )}
    </div>
  );
}