// REACT //
import React, { useState } from "react";

// COMPONENTS //
import EnrollmentForm from "./EnrollmentForm";
import EnrollSuccess from "./steps/EnrollSuccess";
import EnrollmentInfo from "./steps/EnrollmentInfo";

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
    return <EnrollSuccess />;
  }

  /**
   * Renders the active enrollment view.
   */
  const renderActiveView = () => {
    if (activeView === "start") {
      return renderFormStart();
    }

    if (activeView === "success") {
      return renderSuccessScreen();
    }

    return <EnrollmentForm onSuccess={() => setActiveView("success")} />;
  };

  // Use Effects
  return renderActiveView();
}
