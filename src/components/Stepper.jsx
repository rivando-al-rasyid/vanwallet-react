import { Fragment } from "react";

const STEPS = ["Find People", "Set Nominal", "Finish"];

export default function Stepper({ currentStep }) {
  return (
    <div className="flex w-full items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold sm:flex-wrap sm:gap-3 sm:overflow-visible sm:text-sm">
      {STEPS.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        const isHighlighted = isActive || isCompleted;

        return (
          <Fragment key={step}>
            <div
              className={`flex shrink-0 items-center gap-2 ${
                isHighlighted ? "text-primary" : "text-base-content/50"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black transition-colors ${
                  isHighlighted
                    ? "bg-primary text-primary-content shadow-sm"
                    : "bg-base-300 text-base-content/65"
                }`}
              >
                {isCompleted ? "✓" : stepNumber}
              </span>
              <span className={isActive ? "font-black" : ""}>{step}</span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`h-px w-7 shrink-0 border-t border-dashed transition-colors sm:w-10 ${
                  isCompleted ? "border-primary" : "border-base-300"
                }`}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
