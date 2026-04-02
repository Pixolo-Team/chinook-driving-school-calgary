// REACT //
import React, { useState } from "react";

// COMPONENTS //
import EnrollmentForm from "./EnrollmentForm";
import EnrollSuccess from "./steps/EnrollSuccess";
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
    return (
      <section className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-6 py-16">
        <div className="flex w-full flex-col items-center gap-6 rounded-[32px] bg-[var(--color-n-50)] px-8 py-14 text-center shadow-[0_24px_80px_rgba(2,6,23,0.10)]">
          <span
            className="rounded-full px-4 py-2 text-sm font-semibold tracking-[0.18em] uppercase"
            style={{
              backgroundColor: "var(--color-blue-50)",
              color: "var(--color-blue-500)",
            }}
          >
            Enrollment
          </span>
          <div className="flex max-w-2xl flex-col gap-3">
            <h1
              className="text-4xl leading-tight font-semibold"
              style={{ color: "var(--color-n-900)" }}
            >
              Start Your Chinook Driving Enrollment
            </h1>
            <p className="text-lg leading-8" style={{ color: "var(--color-n-600)" }}>
              Fill out the enrollment flow step by step and continue later if needed. Your progress
              will be saved automatically on this device.
            </p>
          </div>
          <Button variant="filled" onClick={() => setActiveView("form")}>
            Start Enrollment
          </Button>
        </div>
      </section>
    );
  }

  /**
   * Renders the success screen after a completed API submission.
   */
  function renderSuccessScreen(): React.JSX.Element {
    return <EnrollSuccess />;
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
