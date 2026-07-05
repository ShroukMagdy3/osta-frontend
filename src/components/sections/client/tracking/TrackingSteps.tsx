"use client";

import { Clock, CheckCircle2, MapPin, Star } from "lucide-react";
import { Check } from "lucide-react";

const COLORS = {
  primary: "#1C4B41",
  accent: "#B3E718",
  secondary: "#F1F7E7",
  gold: "#FBBF24",
};

const STEPS = [
  { key: "on_the_way", title: "في الطريق" },
  { key: "started", title: "العمل جار" },
  { key: "completed", title: "تم انجاز العمل" },
] as const;

interface AssignedTechnician {
  _id: string;
  fullName: string;
  averageRating?: number;
}

interface Props {
  progress: number;
  isFullyCompleted: boolean;
  address?: string;
  assignedTechnician?: AssignedTechnician | null;
}

export default function TrackingSteps({
  progress,
  isFullyCompleted,
  address,
  assignedTechnician,
}: Props) {
  return (
    <>
      {/* Progress bar */}
      <div className="relative mx-auto mb-8 max-w-[805px] pt-4">
        <div className="absolute left-[15%] right-[15%] top-[50px] h-1 rounded-full bg-[#DFDFDD]" />

        <div className="relative flex justify-between">
          {STEPS.map((step, index) => {
            const activeStatusIndex =
              progress > 0 && progress < STEPS.length ? progress - 1 : -1;

            const isDone = isFullyCompleted || index < activeStatusIndex;

            const isCurrent = !isFullyCompleted && index === activeStatusIndex;

            const isPassed = isDone || isCurrent;

            return (
              <div
                key={step.key}
                className="flex w-1/3 flex-col items-center gap-3"
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300 ${
                    isCurrent
                      ? "bg-[var(--primary-color)] text-white shadow-[0_0_0_4px_var(--accent-color),0_0_28px_rgba(179,231,24,0.45)]"
                      : isDone
                        ? "bg-[var(--accent-color)] text-[var(--primary-color)]"
                        : "bg-[#E3E1DE] text-[#9A9A9A]"
                  }`}
                >
                  {isDone ? (
                    <Check className="h-6 w-6 stroke-[3]" />
                  ) : step.key === "on_the_way" ? (
                    <Clock className="h-6 w-6" />
                  ) : (
                    <CheckCircle2 className="h-6 w-6" />
                  )}
                </div>

                <span
                  className={`text-center text-sm font-extrabold ${
                    isCurrent || isDone
                      ? "text-[var(--primary-color)]"
                      : "text-[#8D8D8D]"
                  }`}
                >
                  {step.title}
                </span>

                <div
                  className={`min-w-[86px] rounded-full px-6 py-2 text-sm font-extrabold ${
                    isCurrent
                      ? "bg-[var(--accent-color)] text-[var(--primary-color)] shadow-[0_10px_22px_rgba(179,231,24,0.34)]"
                      : isDone
                        ? "bg-[#DFF49B] text-[var(--primary-color)]"
                        : "bg-[#E3E1DE] text-[#7C7C7C]"
                  }`}
                >
                  {isDone ? "تم" : isCurrent ? "جاري الآن" : "قريبًا"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Steps list */}
      <div className="flex flex-col gap-3">
        {STEPS.map((step, i) => {
          const isLive = !isFullyCompleted && i === progress - 1;
          const isDoneStep = isFullyCompleted || i < progress - 1;
          const isFuture = !isDoneStep && !isLive;

          return (
            <div
              key={step.key}
              className="rounded-xl border overflow-hidden transition-all"
              style={{
                borderColor: isLive ? COLORS.accent : "#E5E7EB",
                backgroundColor: isLive ? "#fff" : "#FAFAFA",
              }}
            >
              <div className="flex items-center justify-between px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <span
                    className="text-sm font-bold"
                    style={{ color: isFuture ? "#9CA3AF" : COLORS.primary }}
                  >
                    {step.title}
                  </span>
                  <span
                    className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
                    style={{
                      backgroundColor: isFuture ? "#F3F4F6" : COLORS.primary,
                      color: isFuture ? "#9CA3AF" : "#fff",
                    }}
                  >
                    {i + 1}
                  </span>
                </div>
                {isLive ? (
                  <span
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: COLORS.secondary,
                      color: COLORS.primary,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: COLORS.accent }}
                    />
                    جاري الآن
                  </span>
                ) : (
                  <span />
                )}
              </div>

              {isLive && (
                <div className="px-4 pb-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          backgroundColor: COLORS.accent,
                          color: COLORS.primary,
                        }}
                      >
                        {assignedTechnician?.fullName?.charAt(0) ?? "؟"}
                      </span>
                      <div className="flex flex-col">
                        <span
                          className="text-sm font-semibold"
                          style={{ color: COLORS.primary }}
                        >
                          {assignedTechnician?.fullName ?? "لسه مفيش فني متعين"}
                        </span>
                        {typeof assignedTechnician?.averageRating ===
                          "number" &&
                          assignedTechnician.averageRating > 0 && (
                            <span
                              className="flex items-center gap-1 text-xs font-bold"
                              style={{ color: COLORS.primary }}
                            >
                              <Star
                                className="w-3.5 h-3.5"
                                style={{ color: COLORS.gold }}
                                fill={COLORS.gold}
                              />
                              {assignedTechnician.averageRating.toFixed(1)}
                            </span>
                          )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <span>{address}</span>
                      <MapPin
                        className="w-4 h-4"
                        style={{ color: COLORS.accent }}
                      />
                    </div>
                  </div>

                  <div
                    className="flex items-center justify-between rounded-lg px-3 py-2"
                    style={{ backgroundColor: "#F5F5F4" }}
                  >
                    <span
                      className="text-xs font-medium"
                      style={{ color: COLORS.primary }}
                    >
                      {step.title}
                    </span>
                    <span className="flex items-center gap-1">
                      <span
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ backgroundColor: COLORS.accent }}
                      />
                      <span
                        className="w-6 h-1.5 rounded-full"
                        style={{ backgroundColor: COLORS.primary }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: COLORS.accent }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: COLORS.accent }}
                      />
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
