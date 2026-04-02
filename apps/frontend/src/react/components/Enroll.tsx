// REACT //
import React, { useState } from "react";

// COMPONENTS //
import EnrollmentForm from "./EnrollmentForm";
import EnrollmentInfo from "./steps/EnrollmentInfo";
import Button from "./ui/Button";

type EnrollViewData = "start" | "form" | "success";

/**
 * Coordinates the enrollment entry flow between start, form, and success screens.
 */
export default function EnrollForm(): React.JSX.Element {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States
  const [activeView, setActiveView] = useState<EnrollViewData>("start");

  // Helper Functions
  /**
   * Renders the start screen before the user opens the form.
   */
  function renderFormStart(): React.JSX.Element {
    return <EnrollmentInfo onStart={() => setActiveView("form")} />;
  }

  /**
   * Renders the success screen after a completed API submission.
   */
  function renderSuccessScreen(): React.JSX.Element {
    return (
      <section className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-6 py-16">
        <div className="flex w-full flex-col items-center gap-6 rounded-[32px] bg-[var(--color-n-50)] px-8 py-14 text-center shadow-[0_24px_80px_rgba(2,6,23,0.10)]">
          <div
            className="flex h-18 w-18 items-center justify-center rounded-full"
            style={{ backgroundColor: "var(--color-blue-50)" }}
          >
            <svg
              viewBox="0 0 20 20"
              className="h-9 w-9"
              fill="none"
              style={{ color: "var(--color-blue-500)" }}
            >
              <path
                d="M5.2 10.3 8.4 13.5 14.8 7.1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex max-w-2xl flex-col gap-3">
            <h2
              className="text-4xl leading-tight font-semibold"
              style={{ color: "var(--color-n-900)" }}
            >
              Enrollment Submitted
            </h2>
            <p className="text-lg leading-8" style={{ color: "var(--color-n-600)" }}>
              Your enrollment has been submitted successfully. Our team will review the details and
              contact you with the next steps.
            </p>
          </div>
          <Button variant="filled" onClick={() => setActiveView("start")}>
            Back to Start
          </Button>
        </div>
      </section>
    );
  }

  /**
   * Renders the active enrollment view.
   */
  function renderActiveView(): React.JSX.Element {
    if (activeView === "start") {
      return renderFormStart();
    }

    if (activeView === "success") {
      return renderSuccessScreen();
    }

    return <EnrollmentForm onSuccess={() => setActiveView("success")} />;
  }

  // Use Effects
  return renderActiveView();
}
