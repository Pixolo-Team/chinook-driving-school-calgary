// REACT //
import React from "react";

// COMPONENTS //
import Button from "@/react/components/ui/Button";
import StepStatus from "@/react/components/ui/StepStatus";
import { StepGlyph } from "@/react/components/ui/Steps";

// TYPES //
import type { StepStatusData } from "@/react/types/steps.type";

// CONSTANTS //
import { DEFAULT_STEPS } from "@/react/constants/steps";

type SubmissionModalModeData = "checking" | "sending" | "result";

// COMPONENT PROPS //
type SubmissionModalPropsData = Readonly<{
  isOpen: boolean;
  mode: SubmissionModalModeData;
  title: string;
  message: string;
  stepStatuses?: Record<number, StepStatusData>;
  onSelectStep?: (stepId: number) => void;
  onClose: () => void;
}>;

function joinClasses(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function statusLabel(status: StepStatusData): string {
  if (status === "completed") {
    return "Completed";
  }

  if (status === "pending") {
    return "Pending";
  }

  return "Untouched";
}

/**
 * Renders the submission status popup with an overlay and loader state.
 */
export default function SubmissionModal({
  isOpen,
  mode,
  title,
  message,
  stepStatuses = {},
  onSelectStep,
  onClose,
}: SubmissionModalPropsData): React.JSX.Element | null {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States
  const isChecking: boolean = mode === "checking";
  const isSending: boolean = mode === "sending";
  const isBusy: boolean = mode !== "result";

  if (!isOpen) {
    return null;
  }

  // Helper Functions
  const handleOverlayKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (isBusy) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClose();
    }
  };

  const handleOverlayClick = (): void => {
    if (!isBusy) {
      onClose();
    }
  };

  const completedCount: number = Object.values(stepStatuses).filter(
    (stepStatusItem) => stepStatusItem === "completed",
  ).length;
  const pendingCount: number = Object.values(stepStatuses).filter(
    (stepStatusItem) => stepStatusItem === "pending",
  ).length;
  const untouchedCount: number = Object.values(stepStatuses).filter(
    (stepStatusItem) => stepStatusItem === "untouched",
  ).length;

  // Use Effects
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 py-10">
      <div
        role="button"
        tabIndex={isBusy ? -1 : 0}
        aria-label="Close modal"
        onClick={handleOverlayClick}
        onKeyDown={handleOverlayKeyDown}
        className="absolute inset-0 bg-[rgba(2,6,23,0.56)]"
      />

      <div
        className={joinClasses(
          "bg-n-50 relative z-10 flex w-full flex-col rounded-[28px] shadow-[0_28px_80px_rgba(2,6,23,0.22)]",
          isChecking
            ? "max-w-5xl gap-6 px-6 py-8 text-left md:px-8 md:py-9"
            : "max-w-md items-center gap-6 px-8 py-10 text-center",
        )}
      >
        {isChecking ? (
          <>
            <div className="flex w-full flex-col items-center gap-2 text-center">
              <h3 className="text-n-900 text-4xl leading-normal font-bold">{title}</h3>
              <p className="text-n-800 text-2xl leading-7">
                <span className="font-bold">
                  {completedCount} of {DEFAULT_STEPS.length}
                </span>{" "}
                Steps Completed{" "}
                <span className="px-4" aria-hidden="true">
                  |
                </span>{" "}
                <span className="text-red-600">
                  <span className="font-bold">{pendingCount + untouchedCount}</span> Incomplete
                </span>
              </p>
              {message ? (
                <p className="text-sm leading-6 font-medium text-amber-700">{message}</p>
              ) : null}
            </div>

            <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
              {DEFAULT_STEPS.map((stepItem, stepIndex) => {
                const stepId: number = stepIndex + 1;
                const stepStatus: StepStatusData = stepStatuses[stepId] ?? "untouched";

                return (
                  <StepStatus
                    key={stepItem.label}
                    status={stepStatus}
                    title={stepItem.label}
                    subTitle={statusLabel(stepStatus)}
                    icon={<StepGlyph icon={stepItem.icon} status={stepStatus} />}
                    onClick={stepStatus === "pending" ? () => onSelectStep?.(stepId) : undefined}
                  />
                );
              })}
            </div>
          </>
        ) : isSending ? (
          <div className="flex w-full flex-col items-center gap-3 py-4 text-center">
            <span className="border-n-200 h-14 w-14 animate-spin rounded-full border-4 border-t-blue-500" />
            <p className="text-n-700 text-base leading-7 font-medium">
              Securely sending your details
            </p>
          </div>
        ) : (
          <>
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--color-blue-50)" }}
            >
              <svg
                viewBox="0 0 20 20"
                className="h-8 w-8"
                fill="none"
                style={{ color: "var(--color-blue-500)" }}
              >
                <path
                  d="M10 6.5v4M10 13.5h.01M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex flex-col gap-2">
              <h3
                className="text-2xl leading-normal font-semibold"
                style={{ color: "var(--color-n-900)" }}
              >
                {title}
              </h3>
              <p className="text-base leading-7" style={{ color: "var(--color-n-600)" }}>
                {message}
              </p>
            </div>
          </>
        )}

        <div className="border-n-200 mt-2 w-full border-t pt-5">
          <Button
            variant="unfilled"
            onClick={onClose}
            className="min-h-12 w-full px-6 py-3 text-base"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
