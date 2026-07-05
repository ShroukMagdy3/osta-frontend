"use client";

import { useEffect, useState } from "react";
import { Briefcase, X, Plus, Loader2 } from "lucide-react";
import { api } from "@/api/axios";
import Button from "@/components/ui/Button";
import SaveSuccessModal from "./SaveSuccessModal";

interface ServiceOption {
  id: string;
  name: string;
}

interface WorkInfoSectionProps {
  jobTitle: string;
  category: string;
  categoryId: string;
  services: ServiceOption[];
  onSaved: (data: { jobTitle: string; services: ServiceOption[] }) => void;
}

export default function WorkInfoSection({
  jobTitle,
  category,
  categoryId,
  services,
  onSaved,
}: WorkInfoSectionProps) {
  const [jobTitleVal, setJobTitleVal] = useState(jobTitle);
  const [selectedServices, setSelectedServices] =
    useState<ServiceOption[]>(services);

  const [availableServices, setAvailableServices] = useState<ServiceOption[]>(
    [],
  );
  const [loadingServices, setLoadingServices] = useState(false);
  const [showAddDropdown, setShowAddDropdown] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Keep local state in sync if parent re-fetches
  useEffect(() => {
    setJobTitleVal(jobTitle);
    setSelectedServices(services);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobTitle, services]);

  // Fetch all services in the technician's category (to know what can be added)
  useEffect(() => {
    if (!categoryId) return;
    setLoadingServices(true);
    api
      .get(`/services?categoryId=${categoryId}`)
      .then((res) => {
        const list = (res.data?.data ?? []) as { _id: string; name: string }[];
        setAvailableServices(list.map((s) => ({ id: s._id, name: s.name })));
      })
      .catch(() => {
        // category may have no other services — not a fatal error
        setAvailableServices([]);
      })
      .finally(() => setLoadingServices(false));
  }, [categoryId]);

  const removeService = (id: string) => {
    setSelectedServices((prev) => prev.filter((s) => s.id !== id));
  };

  const addService = (service: ServiceOption) => {
    setSelectedServices((prev) =>
      prev.some((s) => s.id === service.id) ? prev : [...prev, service],
    );
    setShowAddDropdown(false);
  };

  const servicesToAdd = availableServices.filter(
    (s) => !selectedServices.some((sel) => sel.id === s.id),
  );

  const handleSave = async () => {
    setError("");
    setSaving(true);
    try {
      const { data } = await api.patch("/technician/work-info", {
        jobTitle: jobTitleVal.trim(),
        serviceIds: selectedServices.map((s) => s.id),
      });

      const updated = data?.data;
      const newJobTitle = updated?.jobTitle ?? jobTitleVal.trim();
      const newServices: ServiceOption[] =
        updated?.services ?? selectedServices;

      onSaved({ jobTitle: newJobTitle, services: newServices });
      setShowSuccess(true);
    } catch (err: any) {
      const message = err.response?.data?.message;
      setError(
        Array.isArray(message)
          ? message[0]
          : message || "حدث خطأ، حاول مرة أخرى",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div
        dir="rtl"
        className="rounded-[24px] border border-[#EAECE8] bg-white p-6 shadow-sm"
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-3" dir="ltr">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex-shrink-0 !px-6 !py-2.5 !text-sm"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" />
                جاري الحفظ...
              </span>
            ) : (
              "حفظ التغييرات"
            )}
          </Button>

          <div className="text-right">
            <h2 className="flex items-center justify-end gap-2 text-base font-bold text-[#112D27]">
              بيانات العمل
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--secondary-color)]">
                <Briefcase size={15} className="text-[var(--primary-color)]" />
              </span>
            </h2>
            <p className="mt-1 text-xs text-gray-400">
              تخصصك الرئيسي و الخدمات التي تقدمها لعملاء أسطى
            </p>
          </div>
        </div>

        {/* المسمى الوظيفي + التخصص الرئيسي */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-gray-400">
              المسمى الوظيفي
            </label>
            <input
              type="text"
              value={jobTitleVal}
              onChange={(e) => setJobTitleVal(e.target.value)}
              maxLength={100}
              placeholder="مثال: فني تكييف وتبريد أول"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-right text-sm font-medium text-[#112D27] outline-none transition-colors focus:border-[var(--primary-color)] placeholder:text-gray-300"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-400">
              التخصص الرئيسي
            </label>
            {/* Read-only — category cannot be changed from this screen */}
            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <span className="text-sm font-medium text-[#112D27]">
                {category || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* الخدمات المقدمة */}
        <div className="mt-5">
          <label className="mb-2 block text-sm text-gray-400">
            الخدمات المقدمة
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {selectedServices.map((service) => (
              <span
                key={service.id}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-[#112D27]"
              >
                <button
                  type="button"
                  onClick={() => removeService(service.id)}
                  className="text-gray-400 transition-colors hover:text-red-500"
                  title="إزالة الخدمة"
                >
                  <X size={14} />
                </button>
                {service.name}
              </span>
            ))}

            {/* Add service control */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAddDropdown((prev) => !prev)}
                disabled={loadingServices || servicesToAdd.length === 0}
                className="flex items-center gap-2 rounded-full border border-dashed border-[var(--primary-color)] px-4 py-2 text-sm font-medium text-[var(--primary-color)] transition-all hover:bg-[var(--secondary-color)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus size={14} />
                إضافة خدمة
              </button>

              {showAddDropdown && servicesToAdd.length > 0 && (
                <div className="absolute top-full z-10 mt-2 w-56 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
                  <div className="max-h-56 overflow-y-auto">
                    {servicesToAdd.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => addService(service)}
                        className="flex w-full items-center px-4 py-2.5 text-right text-sm text-[#112D27] transition-all hover:bg-gray-50"
                      >
                        {service.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <p className="mt-4 text-right text-xs text-red-500">{error}</p>
        )}
      </div>

      {showSuccess && (
        <SaveSuccessModal
          message="تم تحديث بيانات العمل بنجاح"
          onClose={() => setShowSuccess(false)}
        />
      )}
    </>
  );
}
