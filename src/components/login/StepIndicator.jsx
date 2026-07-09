import { memo } from "react";

/**
 * currentStep: 1-indexed step currently active (1, 2, or 3)
 * label: text shown after the dots for the active step
 */
const StepIndicator = memo(function StepIndicator({ currentStep, label }) {
  return (
    <div className="mb-4 flex max-w-full items-center gap-1.5 overflow-x-auto pb-1">
      {[1, 2, 3].map((n) => (
        <div key={n} className="flex shrink-0 items-center gap-1.5">
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black ${
              n <= currentStep
                ? "bg-primary text-primary-content"
                : "bg-base-200 text-base-content/50"
            }`}
          >
            {n < currentStep ? "✓" : n}
          </div>
          {n < 3 && <div className="bg-base-300 h-px w-4 sm:w-6" />}
        </div>
      ))}
      <span className="text-base-content/50 ml-1 shrink-0 text-xs font-bold">
        {label}
      </span>
    </div>
  );
});

export default StepIndicator;
