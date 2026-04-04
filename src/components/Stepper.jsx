import React from "react";

export default function Stepper({ steps, currentStep }) {
  return (
    <div className="flex items-center gap-3 text-sm font-medium">
      {steps.map((label, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isDone = step < currentStep;
        return (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 transition-colors ${isActive ? "text-blue-600" : isDone ? "text-blue-400" : "text-gray-400"}`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${isActive ? "bg-blue-600 text-white" : isDone ? "bg-blue-400 text-white" : "bg-gray-200 text-gray-500"}`}
              >
                {isDone ? "✓" : step}
              </span>
              <span>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="h-px w-10 border-t border-dashed border-gray-300 ml-1" />
            )}
          </div>
        );
      })}
    </div>
  );
}
