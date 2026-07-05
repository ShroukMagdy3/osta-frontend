"use client";

import { useEffect, useRef, useState } from "react";
import { X, FileText, Download, User, Wrench } from "lucide-react";
import type { Invoice } from "@/types/invoice.types";

const COLORS = {
  primary: "var(--primary-color)",
  accent: "var(--accent-color)",
};

interface Props {
  invoice: Invoice;
  onClose: () => void;
  autoDownload?: boolean;
}

export default function InvoiceModal2({
  invoice,
  onClose,
  autoDownload = false,
}: Props) {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const pdfWrapperRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const serviceName = invoice.requestId?.serviceId?.name ?? "—";
  const completionNote = invoice.requestId?.completionNote ?? "";

  const waitForNextPaint = () =>
    new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });

  const handleDownloadPdf = async () => {
    if (!pdfWrapperRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const { jsPDF } = await import("jspdf");

      if (typeof document !== "undefined") {
        const doc = document as unknown as { fonts?: { ready: Promise<void> } };
        if (doc.fonts?.ready) {
          await doc.fonts.ready;
        }
      }

      await waitForNextPaint();

      const element = pdfWrapperRef.current;
      const FIXED_WIDTH = 420;

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        width: FIXED_WIDTH,
        windowWidth: FIXED_WIDTH,
        onclone: (_doc, cloned) => {
          cloned.setAttribute("dir", "rtl");
          const clonedEl = cloned as HTMLElement;
          clonedEl.style.direction = "rtl";
          clonedEl.style.width = `${FIXED_WIDTH}px`;
          clonedEl.style.maxWidth = `${FIXED_WIDTH}px`;
          clonedEl.style.minWidth = `${FIXED_WIDTH}px`;
          clonedEl.style.boxSizing = "border-box";
          clonedEl.style.padding = "16px";
          clonedEl.style.margin = "0";
          clonedEl.style.position = "static";
          clonedEl.style.left = "0";
          clonedEl.style.top = "0";
          clonedEl.style.opacity = "1";

          cloned.querySelectorAll("*").forEach((el: any) => {
            el.style.direction = "rtl";
            el.style.wordBreak = "normal";
            el.style.whiteSpace = "normal";
            el.style.maxWidth = "100%";
            el.style.boxSizing = "border-box";
          });
        },
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 10;
      const usableWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * usableWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", margin, margin, usableWidth, imgHeight);
      pdf.save(`${invoice.invoiceNumber}.pdf`);
    } catch (err) {
      console.error("PDF generation failed", err);
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    if (!autoDownload) return;
    const run = async () => {
      await handleDownloadPdf();
      onClose();
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoDownload]);

  const InvoiceContent = () => (
    <div
      ref={invoiceRef}
      data-invoice-root="true"
      className=" px-3"
      style={{
        width: "520px",
        boxSizing: "border-box",
        direction: "rtl",
        textAlign: "right",
      }}
      dir="rtl"
    >
      <div className="pb-4" style={{ textAlign: "right" }}>
        <div
          className="flex items-center gap-2 mb-3"
          style={{ justifyContent: "flex-start" }}
        >
          <span
            className="hidden sm:flex items-center justify-center w-6 h-6 rounded-full"
            style={{ backgroundColor: "#F3F4F6" }}
          >
            <User className="w-3.5 h-3.5 text-gray-500" />
          </span>
          <h3
            className="text-sm font-bold"
            style={{ color: COLORS.primary, textAlign: "right" }}
          >
            بيانات العميل
          </h3>
        </div>

        <p
          className="text-sm text-gray-600 whitespace-nowrap"
          style={{ textAlign: "right" }}
        >
          <span className="font-bold" style={{ color: COLORS.primary }}>
            الاسم:
          </span>{" "}
          {invoice.clientId?.fullName}
        </p>
      </div>

      {/* تفاصيل الخدمة */}
      <div className="py-4">
        <div
          className="flex items-center gap-2 mb-3"
          style={{ justifyContent: "flex-start" }}
        >
          <span
            className="hidden sm:flex items-center justify-center w-6 h-6 rounded-full"
            style={{ backgroundColor: "#F3F4F6" }}
          >
            <Wrench className="w-3.5 h-3.5 text-gray-500" />
          </span>
          <h3 className="text-sm font-bold" style={{ color: COLORS.primary }}>
            تفاصيل الخدمة
          </h3>
        </div>

        <div className="flex flex-col gap-2.5 text-sm">
          <div
            className="flex items-center gap-1.5"
            style={{ justifyContent: "flex-start" }}
          >
            <span className="font-bold" style={{ color: COLORS.primary }}>
              الخدمه:
            </span>
            <span className="text-gray-600">{serviceName}</span>
          </div>

          <div
            className="flex items-center gap-1.5"
            style={{ justifyContent: "flex-start" }}
          >
            <span className="font-bold" style={{ color: COLORS.primary }}>
              الفني:
            </span>
            <span className="text-gray-600">
              {invoice.technicianId?.fullName}
            </span>
          </div>

          {completionNote && (
            <div
              className="flex items-start gap-1.5"
              style={{ justifyContent: "flex-start" }}
            >
              <span
                className="font-bold shrink-0"
                style={{ color: COLORS.primary }}
              >
                :ملاحظات
              </span>
              <span className="text-gray-600" style={{ textAlign: "right" }}>
                {completionNote}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* الجدول المالي */}
      <div
        className="mt-4 rounded-2xl border border-[#ECECEC]"
        style={{ backgroundColor: "#ffffff", overflow: "hidden" }}
      >
        <div
          className="flex items-center justify-between px-4 py-3 border-b border-[#ECECEC]"
          style={{ backgroundColor: "#ffffff" }}
        >
          <span className="text-sm text-gray-500">العربون المدفوع</span>
          <span className="font-semibold text-gray-600">
            {invoice.depositAmount} جنيه
          </span>
        </div>
        <div
          className="flex items-center justify-between px-4 py-3 border-b border-[#ECECEC]"
          style={{ backgroundColor: "#ffffff" }}
        >
          <span className="text-sm text-gray-500">المتبقي المدفوع</span>
          <span className="font-semibold text-gray-600">
            {invoice.remainingAmount} جنيه
          </span>
        </div>
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ backgroundColor: "#F8FAF8" }}
        >
          <span className="font-bold text-sm" style={{ color: COLORS.primary }}>
            الإجمالي
          </span>
          <span
            className="font-bold text-base"
            style={{ color: COLORS.primary }}
          >
            {invoice.totalPrice} جنيه
          </span>
        </div>
      </div>
    </div>
  );

  const PdfOnlyWrapper = () => (
    <div
      className="fixed pointer-events-none"
      style={{
        left: "-9999px",
        top: "-9999px",
        opacity: 0,
        width: "420px",
      }}
      aria-hidden="true"
    >
      <div
        ref={pdfWrapperRef}
        className="bg-white px-3"
        style={{
          width: "420px",
          boxSizing: "border-box",
          direction: "rtl",
          textAlign: "right",
        }}
        dir="rtl"
      >
        <div
          className="pb-4 mb-2 border-b border-[#ECECEC]"
          style={{ textAlign: "right" }}
        >
          <h2
            className="text-lg font-extrabold"
            style={{ color: COLORS.primary }}
          >
            منصة أسطي
          </h2>
          <div className="flex items-center justify-between mb-1">
            <span
              className="text-xs text-gray-500"
              style={{ direction: "rtl" }}
            >
              {invoice.invoiceNumber}#
            </span>
          </div>
          <p className="text-xs text-gray-500" style={{ textAlign: "right" }}>
            فاتورة خدمة: {serviceName}
          </p>
        </div>

        {/* بيانات العميل */}
        <div className="pb-4">
          <div
            className="flex items-start gap-2 mb-3"
            style={{ justifyContent: "flex-start" }}
          >
            <span
              className="hidden sm:flex items-start justify-center w-6 h-6 rounded-full"
              style={{ backgroundColor: "#F3F4F6" }}
            >
              <User className="w-3.5 h-3.5 text-gray-500" />
            </span>
            <h3 className="text-sm font-bold">بيانات العميل</h3>
          </div>

          <p
            className="text-sm text-gray-600 whitespace-nowrap"
            style={{ textAlign: "right" }}
          >
            <span className="font-bold" style={{ color: COLORS.primary }}>
              الاسم:
            </span>{" "}
            {invoice.clientId?.fullName}
          </p>
        </div>

        {/* تفاصيل الخدمة */}
        <div className="py-4">
          <div
            className="flex items-center gap-2 mb-3"
            style={{ justifyContent: "flex-start" }}
          >
            <span
              className="hidden sm:flex items-center justify-center w-6 h-6 rounded-full"
              style={{ backgroundColor: "#F3F4F6" }}
            >
              <Wrench className="w-3.5 h-3.5 text-gray-500" />
            </span>
            <h3 className="text-sm font-bold" style={{ color: COLORS.primary }}>
              تفاصيل الخدمة
            </h3>
          </div>

          <div className="flex flex-col gap-2.5 text-sm">
            <div
              className="flex items-center gap-1.5"
              style={{ justifyContent: "flex-start" }}
            >
              <span className="font-bold" style={{ color: COLORS.primary }}>
                الخدمه:
              </span>
              <span className="text-gray-600">{serviceName}</span>
            </div>

            <div
              className="flex items-center gap-1.5"
              style={{ justifyContent: "flex-start" }}
            >
              <span className="font-bold" style={{ color: COLORS.primary }}>
                الفني:
              </span>
              <span className="text-gray-600">
                {invoice.technicianId?.fullName}
              </span>
            </div>

            {completionNote && (
              <div
                className="flex items-start gap-1.5"
                style={{ justifyContent: "flex-start" }}
              >
                <span
                  className="font-bold shrink-0"
                  style={{ color: COLORS.primary }}
                >
                  ملاحظات:
                </span>
                <span className="text-gray-600" style={{ textAlign: "right" }}>
                  {completionNote}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* الجدول المالي */}
        <div
          className="mt-4 rounded-2xl border border-[#ECECEC]"
          style={{ backgroundColor: "#ffffff", overflow: "hidden" }}
        >
          <div
            className="flex items-center justify-between px-4 py-3 border-b border-[#ECECEC]"
            style={{ backgroundColor: "#ffffff" }}
          >
            <span className="text-sm text-gray-500">العربون المدفوع</span>
            <span className="font-semibold text-gray-600">
              {invoice.depositAmount} جنيه
            </span>
          </div>
          <div
            className="flex items-center justify-between px-4 py-3 border-b border-[#ECECEC]"
            style={{ backgroundColor: "#ffffff" }}
          >
            <span className="text-sm text-gray-500">المتبقي المدفوع</span>
            <span className="font-semibold text-gray-600">
              {invoice.remainingAmount} جنيه
            </span>
          </div>
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ backgroundColor: "#F8FAF8" }}
          >
            <span
              className="font-bold text-sm"
              style={{ color: COLORS.primary }}
            >
              الإجمالي
            </span>
            <span
              className="font-bold text-base"
              style={{ color: COLORS.primary }}
            >
              {invoice.totalPrice} جنيه
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  if (autoDownload) {
    return <PdfOnlyWrapper />;
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 sm:px-4">
        <div
          dir="rtl"
          className="flex w-full sm:max-w-xl flex-col overflow-hidden bg-white shadow-2xl h-full sm:h-[90vh] sm:rounded-[32px]"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 border-b border-gray-200  px-4 sm:px-8 py-5">
            <div>
              <h2
                className="flex items-center gap-2 text-xl font-extrabold"
                style={{ color: COLORS.primary }}
              >
                <FileText size={18} />
                فاتورة الخدمة
              </h2>
            </div>
            <button
              onClick={onClose}
              className="absolute left-4 sm:left-8 top-6 text-gray-400 transition hover:text-gray-600"
            >
              <X size={22} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto flex justify-center  px-5 py-6 sm:px-8 sm:py-5">
            <InvoiceContent />
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 border-t border-gray-200 bg-white p-4 sm:p-5">
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="w-full h-12 rounded-full font-bold text-sm flex items-center justify-center gap-2"
              style={{ backgroundColor: COLORS.accent, color: COLORS.primary }}
            >
              <Download size={16} />
              {downloading ? "جاري التحميل..." : "تحميل الفاتورة"}
            </button>
          </div>
        </div>
      </div>

      <PdfOnlyWrapper />
    </>
  );
}
