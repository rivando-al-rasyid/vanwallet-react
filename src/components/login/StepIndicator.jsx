import { memo } from "react";

/**
 * currentStep: 1-indexed step currently active (1, 2, or 3)
 * label: text shown for the active step
 */
const StepIndicator = memo(function StepIndicator({ currentStep, label }) {
  const steps = [
    { n: 1, text: "Email" },
    { n: 2, text: "Token" },
    { n: 3, text: label },
  ];

  return (
    <ul className="steps steps-horizontal mb-4 w-full text-xs">
      {steps.map(({ n, text }) => (
        <li
          key={n}
          data-content={n <= currentStep ? "✓" : n}
          className={`step ${n <= currentStep ? "step-primary" : ""}`}
        >
          {text}
        </li>
      ))}
    </ul>
  );
});

export default StepIndicator;
