"use client";

import { STEPS } from "@/constants/tracking";
import { TechnicianRequest } from "@/types/tracking.types";
import { Check, MapPin } from "lucide-react";

interface Props {
  progress: number;
  request: TechnicianRequest | null;
}

const doneLabels: Record<string, string> = {
  on_the_way: "وصلت وجهتك",
  started: "تم تنفيذ الخدمة",
  completed: "تم إنهاء العمل",
};

const activeHelp: Record<string, string> = {
  on_the_way: "في الطريق",
  started: "في انتظار انتهاء الخدمة...",
  completed: "بعد الانتهاء من تنفيذ الخدمة، اضغط على إنهاء العمل للانتقال إلى الخطوة التالية.",
};

function formatTime(time?: string) {
  if (!time) return "10:40 ص";

  const [rawHour, rawMinute = "00"] = time.split(":");
  const hour = Number(rawHour);

  if (Number.isNaN(hour)) return time;

  const displayHour = hour % 12 || 12;
  const period = hour >= 12 ? "م" : "ص";

  return `${displayHour}:${rawMinute.padStart(2, "0")} ${period}`;
}

export default function TrackingStepCards({ progress, request }: Props) {
  const address = request?.address?.fullAddress || request?.address?.district;
  const customerName = request?.userId?.fullName ?? " ";
  const serviceName = request?.serviceId?.name;
  const finalPrice =
    request?.totalPrice ??
    ((request?.servicePrice ?? 0) + (request?.extraMaterialsPrice ?? 0));
  const time = formatTime(request?.preferredTime);

  return (
    <section dir="rtl" className="-mx-4 mt-8 px-4 py-9 sm:-mx-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-[805px] flex-col gap-9">
        {STEPS.map((step, index) => {
          const isComplete = progress >= STEPS.length;
          const activeIndex = progress > 0 && !isComplete ? progress - 1 : -1;
          const isDone = isComplete || index < activeIndex;
          const isActive = index === activeIndex;

          if (isDone) {
            return (
              <article
                key={step.key}
                className="rounded-[18px] border border-[var(--accent-color)] bg-[var(--secondary-color)] px-5 py-4 shadow-[0_14px_30px_rgba(179,231,24,0.10)]"
              >
                <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                  <div className="flex items-center gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-color)] text-[var(--primary-color)]">
                      <Check className="h-5 w-5 stroke-[3]" />
                    </span>
                    <h3 className="text-xl font-extrabold text-[var(--primary-color)]">
                      {step.title}
                    </h3>
                  </div>

                  <div className="flex flex-col gap-3 text-sm text-[var(--gray-color)]">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-[var(--accent-color)] px-4 py-1.5 text-xs font-extrabold text-[var(--primary-color)]">
                        {doneLabels[step.key]}
                      </span>
                      <span>{time}</span>
                    </div>

                    <p className="flex items-center gap-2 leading-6">
                      <MapPin className="h-4 w-4 text-[var(--primary-color)]" />
                      {address}
                    </p>
                  </div>
                </div>
              </article>
            );
          }

          return (
            <article
              key={step.key}
              className={`overflow-hidden rounded-[18px] border transition-all duration-300 ${
                isActive
                  ? "border-[var(--accent-color)] bg-white shadow-[0_18px_34px_rgba(179,231,24,0.12)]"
                  : "border-[#E5E8E5] bg-white/45"
              }`}
            >
              <div className="flex min-h-[74px] items-center justify-between bg-[#F8FAFA] px-5 py-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      isActive
                        ? "bg-[var(--primary-color)] text-white"
                        : "bg-[#F0F0F0] text-[#D4D4D4]"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <h3
                    className={`text-xl font-extrabold ${
                      isActive
                        ? "text-[var(--primary-color)]"
                        : "text-[#D0D0D0]"
                    }`}
                  >
                    {step.title}
                  </h3>
                </div>

                {isActive ? (
                  <span className="rounded-full bg-[var(--primary-color)] px-4 py-1.5 text-xs font-bold text-white">
                    جاري الآن
                    <span className="ms-2 inline-block h-2 w-2 rounded-full bg-[var(--accent-color)] align-middle" />
                  </span>
                ) : (
                  <span />
                )}
              </div>

              {isActive && (
                <div className="px-5 pb-5 pt-7">
                  <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-color)] text-base font-extrabold text-[var(--primary-color)]">
                        {customerName.charAt(0)}
                      </div>
                      <p className="text-base font-extrabold text-[var(--primary-color)]">
                        {index === 0 ? customerName : serviceName}
                      </p>
                    </div>

                    <p className="flex items-center gap-2 text-sm leading-6 text-[var(--gray-color)]">
                      <MapPin className="h-4 w-4 text-[var(--accent-color)]" />
                      {address}
                    </p>
                  </div>

                  <div className="flex min-h-[54px] items-center justify-start rounded-xl bg-[#F8FAFA] px-4 py-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-[var(--accent-color)]" />
                      <span className="h-2 w-8 rounded-full bg-[#88A39B]" />
                      <span className="h-2 w-2 rounded-full bg-[var(--accent-color)]" />
                      <span className="h-2 w-2 rounded-full bg-[var(--accent-color)]" />
                      <span className="h-2 w-2 rounded-full bg-[var(--accent-color)]" />
                      <span className="text-sm font-bold text-[var(--primary-color)]">
                        {activeHelp[step.key]}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}

        {progress >= STEPS.length && (
          <article className="mt-10 rounded-[18px] border border-[var(--accent-color)] bg-[#E8F8BA] px-5 py-5 shadow-[0_18px_34px_rgba(179,231,24,0.12)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div className="flex items-baseline gap-1 rounded-full px-5 py-3">
                <span className="text-4xl font-extrabold text-[var(--primary-color)]">
                  {finalPrice}
                </span>
                <span className="text-sm font-bold text-[var(--gray-color)]">
                  جنيه
                </span>
              </div>

              <div>
                <p className="text-sm font-bold text-[var(--gray-color)]">
                  الاجمالي
                </p>
              </div>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
