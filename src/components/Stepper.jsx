import React from "react";

const STEPS = ["Find People", "Set Nominal", "Finish"];

export default function Stepper({ currentStep }) {
  return (
    <div className="flex items-center gap-4 text-sm font-medium">
      {STEPS.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <React.Fragment key={step}>
            {/* Step Item */}
            <div
              className={`flex items-center gap-2 ${
                isActive || isCompleted ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${
                  isActive || isCompleted
                    ? "bg-blue-600 text-white"
                    : "bg-gray-400 text-white"
                }`}
              >
                {isCompleted ? "✓" : stepNumber}
              </span>
              <span className={isActive ? "font-bold" : ""}>{step}</span>
            </div>

            {/* Divider (only show between steps) */}
            {index < STEPS.length - 1 && (
              <div
                className={`h-px w-12 border-t border-dashed transition-colors ${
                  isCompleted ? "border-blue-600" : "border-gray-400"
                }`}
              ></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
