"use client";

import { Check, CheckCircle2, CircleDotDashed, Clock } from "lucide-react";
import { STEPS } from "@/constants/tracking";

interface Props {
  progress: number;
  loading: boolean;
  onStep: (index: number) => void;
}

export default function TrackingStepper({ progress, loading, onStep }: Props) {
  return (
    <div className="relative mx-auto mb-8 w-full max-w-[805px] px-2 pt-4 sm:px-4">
      <div className="absolute left-[10%] right-[10%] top-[52px] h-1 rounded-full bg-[#DFDFDD] sm:left-[15%] sm:right-[15%]" />

      <div className="relative flex justify-between gap-2 sm:gap-0">
        {STEPS.map((step, index) => {
          const activeStatusIndex =
            progress > 0 && progress < STEPS.length ? progress - 1 : -1;
          const isDone = progress >= STEPS.length || index < activeStatusIndex;
          const isActiveStatus = index === activeStatusIndex;
          const isActiveButton = index === progress && progress < STEPS.length;
          const isPassed = index < progress;

          return (
            <div
              key={step.key}
              className="flex w-1/3 min-w-0 flex-col items-center gap-3"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 sm:h-16 sm:w-16 ${
                  isActiveStatus
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
                ) : step.key === "started" ? (
                  <CircleDotDashed className="h-6 w-6" />
                ) : (
                  <CheckCircle2 className="h-6 w-6" />
                )}
              </div>

              <span
                className={`text-center text-[11px] font-extrabold leading-4 sm:text-sm ${
                  isActiveStatus || isDone
                    ? "text-[var(--primary-color)]"
                    : "text-[#8D8D8D]"
                }`}
              >
                {step.title}
              </span>

              <button
                onClick={() => isActiveButton && !loading && onStep(index)}
                disabled={!isActiveButton || loading}
                className={`w-full min-w-[0] rounded-full px-2 py-2 text-[11px] font-extrabold transition-all sm:min-w-[86px] sm:px-6 sm:text-sm ${
                  isActiveButton
                    ? "bg-[var(--accent-color)] text-[var(--primary-color)] shadow-[0_10px_22px_rgba(179,231,24,0.34)]"
                    : isPassed
                      ? "bg-[#DFF49B] text-[var(--primary-color)]"
                      : "bg-[#E3E1DE] text-[#7C7C7C]"
                }`}
              >
                {isActiveButton && loading ? "..." : isPassed ? "تم" : "ابدأ"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
