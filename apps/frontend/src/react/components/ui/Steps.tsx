// REACT //
import React from "react";

// TYPES //
import type { StepIconData, StepStatusData, StepsPropsData } from "@/react/types/steps.type";

// CONSTANTS //
import { DEFAULT_STEPS } from "@/react/constants/steps";

/**
 * Joins optional class names into a single string.
 */
const joinClasses = (...classes: Array<string | false | null | undefined>): string => {
  return classes.filter(Boolean).join(" ");
};

/**
 * Resolves the visual status for one step.
 */
const getVisualStatus = (
  index: number,
  currentStep: number,
  stepStates: Record<number, StepStatusData>,
  totalSteps: number,
): "current" | StepStatusData => {
  if (currentStep >= 1 && currentStep <= totalSteps && index + 1 === currentStep) {
    return "current" as const;
  }

  return stepStates[index + 1] ?? "untouched";
};

/**
 * Returns the text color token for a step label.
 */
const getLabelColorClassName = (status: "current" | StepStatusData): string => {
  if (status === "current") {
    return "text-n-950";
  }

  if (status === "pending") {
    return "text-n-700";
  }

  return "text-n-400";
};

/**
 * Returns the font weight token for a step label.
 */
const getLabelWeightClassName = (status: "current" | StepStatusData): string => {
  if (status === "pending") {
    return "font-bold";
  }

  return "font-semibold";
};

/**
 * Returns the circle classes for a step status.
 */
const getCircleClassName = (status: "current" | StepStatusData): string => {
  if (status === "current") {
    return "border-blue-500 bg-blue-500 text-n-50";
  }

  if (status === "pending") {
    return "border-amber-500 bg-amber-500 text-n-50";
  }

  if (status === "completed") {
    return "border-green-500 bg-green-500 text-n-50";
  }

  return "border-n-400 bg-n-50 text-n-400";
};

/**
 * Renders the icon inside the step circle.
 */
const StepGlyph = ({
  icon,
  status,
}: {
  icon: StepIconData;
  status: "current" | StepStatusData;
}): React.JSX.Element => {
  if (status === "completed") {
    return (
      <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5">
        <path
          d="M6.1 10.2 8.5 12.6 13.8 7.3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (icon === "course") {
    return (
      <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5">
        <circle cx="10" cy="10" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="10" cy="10" r="1.6" fill="currentColor" />
        <path
          d="M10 4.5v3.1M15.5 10h-3.1M10 15.5v-3.1M4.5 10h3.1"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (icon === "user") {
    return (
      <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5">
        <circle cx="10" cy="7" r="2.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M5.2 15.3c1-2 2.8-3 4.8-3s3.8 1 4.8 3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (icon === "license") {
    return (
      <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5">
        <rect
          x="3.8"
          y="5"
          width="12.4"
          height="9.8"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M7 9h5.8M7 12h3.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (icon === "availability") {
    return (
      <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5">
        <rect
          x="3.8"
          y="5.2"
          width="12.4"
          height="10.8"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M6.5 3.8v2.4M13.5 3.8v2.4M3.8 8h12.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (icon === "parent") {
    return (
      <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5">
        <circle cx="8" cy="7" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M3.8 14.7c.8-1.8 2.3-2.8 4.2-2.8 1.4 0 2.6.5 3.5 1.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="m12.7 13.7 1.4 1.4 2.6-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5">
      <rect
        x="3.6"
        y="5"
        width="12.8"
        height="10"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M3.8 8.4h12.4M7 12.2h2.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
};

/**
 * Renders the enrollment stepper and exposes click events for step navigation.
 */
export default function Steps({
  currentStep,
  stepStates = {},
  steps = DEFAULT_STEPS,
  className,
  onStepChange,
}: Readonly<StepsPropsData>) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions
  const displayStepNumber: number = Math.min(Math.max(currentStep, 1), steps.length);
  const currentStepIndex: number = Math.max(displayStepNumber - 1, 0);
  const currentStepInfo = steps[currentStepIndex] ?? steps[0];

  // Use Effects
  return (
    <div className={joinClasses("border-n-200 w-full border-b-2 pb-6", className)}>
      <div className="flex w-full flex-col gap-6 md:hidden">
        <div className="flex w-full items-center gap-3">
          <div
            className="text-n-50 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-blue-500 bg-blue-500"
            aria-hidden="true"
          >
            <StepGlyph icon={currentStepInfo.icon} status="current" />
          </div>
          <div className="bg-n-200 relative h-[3px] flex-1 overflow-hidden rounded-full">
            <div className="h-full w-4/5 bg-blue-500" />
          </div>
        </div>

        <p className="text-n-800 text-left text-base leading-normal font-bold">
          {displayStepNumber}. {currentStepInfo.label}
        </p>
      </div>

      <div className="hidden w-full md:flex md:items-start md:justify-between md:gap-2 lg:hidden">
        {steps.map((step, index) => {
          const status = getVisualStatus(index, currentStep, stepStates, steps.length);

          return (
            <button
              key={step.label}
              type="button"
              onClick={() => onStepChange?.(index + 1)}
              className={joinClasses(
                "relative flex min-w-0 flex-1 flex-col items-center gap-2 py-2 text-center transition-transform duration-200",
                onStepChange && "cursor-pointer hover:scale-[1.01]",
              )}
              aria-current={status === "current" ? "step" : undefined}
            >
              <div className="flex w-full items-center justify-center">
                <div
                  className={joinClasses(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                    getCircleClassName(status),
                  )}
                >
                  <StepGlyph icon={step.icon} status={status} />
                </div>
              </div>

              {index !== steps.length - 1 ? (
                <div className="bg-n-200 absolute top-6 left-1/2 -z-10 h-[3px] w-full -translate-y-1/2">
                  <div
                    className={joinClasses(
                      "h-full bg-blue-500 transition-[width] duration-400",
                      currentStep > index + 1 ? "w-full" : "w-0",
                    )}
                  />
                </div>
              ) : null}

              <div className="flex w-full justify-center">
                <p
                  className={joinClasses(
                    "w-full max-w-[120px] text-center text-[10px] leading-snug",
                    getLabelColorClassName(status),
                    getLabelWeightClassName(status),
                  )}
                >
                  {index + 1}. {step.label}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="hidden w-full lg:flex lg:flex-nowrap lg:items-start lg:justify-between lg:gap-y-6">
        {steps.map((step, index) => {
          const status = getVisualStatus(index, currentStep, stepStates, steps.length);

          return (
            <button
              key={step.label}
              type="button"
              onClick={() => onStepChange?.(index + 1)}
              className={joinClasses(
                "relative flex min-w-[140px] flex-1 flex-col items-center gap-[10px] py-3 text-left transition-transform duration-200",
                onStepChange && "cursor-pointer hover:scale-[1.01]",
              )}
              aria-current={status === "current" ? "step" : undefined}
            >
              <div className="flex w-full items-center justify-center gap-3">
                <div
                  className={joinClasses(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border",
                    getCircleClassName(status),
                  )}
                >
                  <StepGlyph icon={step.icon} status={status} />
                </div>
              </div>

              <p
                className={joinClasses(
                  "text-center text-base leading-normal",
                  getLabelColorClassName(status),
                  getLabelWeightClassName(status),
                )}
              >
                {index + 1}. {step.label}
              </p>
              {index !== 5 && (
                <div className="bg-n-200 absolute top-[30px] left-1/2 -z-10 h-[3px] w-full -translate-y-1/2">
                  <div
                    className={joinClasses(
                      "h-full bg-blue-500 transition-[width] duration-400",
                      currentStep > index + 1 ? "w-full" : "w-0",
                    )}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
