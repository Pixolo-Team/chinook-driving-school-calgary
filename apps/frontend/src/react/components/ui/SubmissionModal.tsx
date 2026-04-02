// REACT //
import React from "react";

// COMPONENT PROPS //
type SubmissionModalPropsData = Readonly<{
  isOpen: boolean;
  isLoading: boolean;
  title: string;
  message: string;
  onClose: () => void;
}>;

/**
 * Renders the submission status popup with an overlay and loader state.
 */
export default function SubmissionModal({
  isOpen,
  isLoading,
  title,
  message,
  onClose,
}: SubmissionModalPropsData): React.JSX.Element | null {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States
  if (!isOpen) {
    return null;
  }

  // Helper Functions

  // Use Effects
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 py-10">
      <button
        type="button"
        aria-label="Close modal"
        onClick={isLoading ? undefined : onClose}
        className="absolute inset-0 bg-[rgba(2,6,23,0.56)]"
        disabled={isLoading}
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-6 rounded-[28px] bg-[var(--color-n-50)] px-8 py-10 text-center shadow-[0_28px_80px_rgba(2,6,23,0.22)]">
        {isLoading ? (
          <>
            <span className="h-14 w-14 animate-spin rounded-full border-4 border-[var(--color-n-200)] border-t-[var(--color-blue-500)]" />
            <div className="flex flex-col gap-2">
              <h3
                className="text-2xl leading-normal font-semibold"
                style={{ color: "var(--color-n-900)" }}
              >
                Processing Enrollment
              </h3>
              <p className="text-base leading-7" style={{ color: "var(--color-n-600)" }}>
                Checking your form and preparing the submission.
              </p>
            </div>
          </>
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
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-[var(--color-blue-500)] px-6 py-3 text-base font-semibold text-[var(--color-n-50)] transition-[transform,background-color] duration-200 hover:bg-[var(--color-blue-400)]"
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
}
