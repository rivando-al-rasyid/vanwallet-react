import { Fragment } from "react";

const STEPS = ["Find People", "Set Nominal", "Finish"];

/**
 * A visual stepper component that tracks progress through a multi-step flow.
 * @param {Object} props
 * @param {number} props.currentStep - The active step index (starting from 1).
 */
export default function Stepper({ currentStep }) {
  return (
    <div className="flex items-center gap-4 text-sm font-medium">
      {STEPS.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        const isHighlighted = isActive || isCompleted;

        return (
          <Fragment key={step}>
            <div
              className={`flex items-center gap-2 ${
                isHighlighted ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${
                  isHighlighted ? "bg-blue-600 text-white" : "bg-gray-400 text-white"
                }`}
              >
                {isCompleted ? "✓" : stepNumber}
              </span>
              <span className={isActive ? "font-bold" : ""}>{step}</span>
            </div>

            {index < STEPS.length - 1 && (
              <div
                className={`h-px w-12 border-t border-dashed transition-colors ${
                  isCompleted ? "border-blue-600" : "border-gray-400"
                }`}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
