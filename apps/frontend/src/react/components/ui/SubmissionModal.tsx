// REACT //
import React from "react";

// COMPONENTS //
import Button from "@/react/components/ui/Button";
import StepStatus from "@/react/components/ui/StepStatus";

// TYPES //
import type { StepIconData, StepStatusData } from "@/react/types/steps.type";

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

function renderStepIcon(icon: StepIconData): React.JSX.Element {
  if (icon === "course") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <path
          d="M7 16a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm10 0a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM4 11.5h16M12 4v7.5M5.6 7.2A8.5 8.5 0 0 1 12 4a8.5 8.5 0 0 1 6.4 3.2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (icon === "user") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <path
          d="M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM4 21a8 8 0 1 1 16 0"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (icon === "license") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <path
          d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11ZM8 9h8M8 13h5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (icon === "availability") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <path
          d="M7 3.5V6M17 3.5V6M4 9h16M6.5 5h11A2.5 2.5 0 0 1 20 7.5v10A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-10A2.5 2.5 0 0 1 6.5 5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (icon === "parent") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <path
          d="M9 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7.5 1a3.5 3.5 0 1 0 0-7M3 20a6 6 0 1 1 12 0M14.5 20a4.5 4.5 0 0 1 4.5-4.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path
        d="M4.5 7.5A2.5 2.5 0 0 1 7 5h10a2.5 2.5 0 0 1 2.5 2.5v9A2.5 2.5 0 0 1 17 19H7a2.5 2.5 0 0 1-2.5-2.5v-9ZM4.5 9.5h15M8 14.5h2.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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
          "relative z-10 flex w-full flex-col rounded-[28px] bg-[var(--color-n-50)] shadow-[0_28px_80px_rgba(2,6,23,0.22)]",
          isChecking ? "max-w-5xl gap-6 px-6 py-8 text-left md:px-8 md:py-9" : "max-w-md items-center gap-6 px-8 py-10 text-center",
        )}
      >
        {isChecking ? (
          <>
            <div className="flex w-full flex-col gap-2">
              <h3 className="text-n-900 text-2xl leading-normal font-semibold">{title}</h3>
              <p className="text-n-700 text-base leading-7">
                Completed: {completedCount}/{DEFAULT_STEPS.length} • Pending: {pendingCount} • Untouched:{" "}
                {untouchedCount}
              </p>
              {message ? <p className="text-amber-700 text-sm leading-6 font-medium">{message}</p> : null}
            </div>

            <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {DEFAULT_STEPS.map((stepItem, stepIndex) => {
                const stepId: number = stepIndex + 1;
                const stepStatus: StepStatusData = stepStatuses[stepId] ?? "untouched";

                return (
                  <StepStatus
                    key={stepItem.label}
                    status={stepStatus}
                    title={stepItem.label}
                    subTitle={statusLabel(stepStatus)}
                    icon={renderStepIcon(stepItem.icon)}
                    onClick={stepStatus === "pending" ? () => onSelectStep?.(stepId) : undefined}
                  />
                );
              })}
            </div>
          </>
        ) : isSending ? (
          <div className="flex w-full flex-col items-center gap-3 py-4 text-center">
            <span className="h-14 w-14 animate-spin rounded-full border-4 border-[var(--color-n-200)] border-t-[var(--color-blue-500)]" />
            <p className="text-n-700 text-base leading-7 font-medium">Securely sending your details</p>
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
          <Button variant="unfilled" onClick={onClose} className="min-h-[48px] w-full px-6 py-3 text-base">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
