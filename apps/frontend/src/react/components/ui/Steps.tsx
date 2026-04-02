// REACT //
import React from "react";

// TYPES //
import type { StepIconData, StepStatusData, StepsPropsData } from "@/react/types/steps.type";

// ASSETS //
import blankCalendarIcon from "@/assets/icons/BlankCalendar.svg";
import checkIcon from "@/assets/icons/check.svg";
import creditCardApprovedIcon from "@/assets/icons/CreditCardApproved.svg";
import documentContractLicenseIcon from "@/assets/icons/DocumentContractLicense.svg";
import steeringWheelIcon from "@/assets/icons/SteeringWheel.svg";
import userCheckValidateIcon from "@/assets/icons/UserCheckValidate.svg";
import userCircleAvatarHappyIcon from "@/assets/icons/UserCircleAvatarHappy.svg";

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
  const stepIconMap: Record<StepIconData, string> = {
    course: steeringWheelIcon,
    user: userCircleAvatarHappyIcon,
    license: documentContractLicenseIcon,
    availability: blankCalendarIcon,
    parent: userCheckValidateIcon,
    payment: creditCardApprovedIcon,
  };

  if (status === "completed") {
    return (
      <img src={checkIcon} alt="" aria-hidden="true" className="h-5 w-5 object-contain" />
    );
  }

  return (
    <img
      src={stepIconMap[icon]}
      alt=""
      aria-hidden="true"
      className="h-5 w-5 object-contain"
    />
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
