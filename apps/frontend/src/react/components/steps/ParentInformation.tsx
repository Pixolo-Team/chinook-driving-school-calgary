// REACT //
import React, { useEffect } from "react";

// TYPES //
import type {
  ParentInformationValueData,
  StepStateData,
} from "@/react/types/enrollment.type";

// COMPONENTS //
import Button from "../ui/Button";
import Input from "../ui/Input";

// COMPONENT PROPS //
type ParentInformationPropsData = Readonly<{
  value: ParentInformationValueData;
  onChange: (
    fieldKey: keyof ParentInformationValueData,
    fieldValue: ParentInformationValueData[keyof ParentInformationValueData],
  ) => void;
  registerValidator?: (stepId: number, validatorFunction: () => StepStateData) => void;
  onNext?: (state: StepStateData) => void;
  onPrevious?: (state: StepStateData) => void;
}>;

/**
 * Renders the Parent information step and reports field changes to the parent form.
 */
export default function ParentInformation({
  value,
  onChange,
  registerValidator,
  onNext,
  onPrevious,
}: ParentInformationPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions
  /**
   * Returns the current completion state for the Parent information step.
   */
  function getStepState(): StepStateData {
    const requiredFieldValues: string[] = [
      value.full_name ?? "",
      value.email ?? "",
      value.contact_number ?? "",
    ];

    return requiredFieldValues.every(
      (requiredFieldValueItem) => requiredFieldValueItem.trim().length > 0,
    )
      ? "completed"
      : "pending";
  }

  /**
   * Updates a single Parent information field in the parent form state.
   */
  function handleFieldChange(
    fieldKey: keyof ParentInformationValueData,
    fieldValue: ParentInformationValueData[keyof ParentInformationValueData],
  ): void {
    onChange(fieldKey, fieldValue);
  }

  // Use Effects
  useEffect(() => {
    registerValidator?.(5, getStepState);
  }, [registerValidator, value]);

  return (
    <section className="bg-n-50 flex w-full flex-col gap-20">
      <div className="grid w-full grid-cols-1 gap-x-11 gap-y-11 lg:grid-cols-2">
        <Input
          type="text"
          label="Parent's Full Name"
          required
          value={value.full_name ?? ""}
          onChange={(event) => handleFieldChange("full_name", event.target.value)}
          placeholder="Type Parent's Full Name"
          caption="Enter the full legal name of the parent or guardian."
          containerClassName="w-full lg:col-span-2"
        />

        <Input
          type="email"
          label="Parent's Email"
          required
          value={value.email ?? ""}
          onChange={(event) => handleFieldChange("email", event.target.value)}
          placeholder="parent@example.com"
          caption="We’ll use this email for guardian communication and confirmations."
          containerClassName="w-full"
        />

        <Input
          type="text"
          label="Parent's Phone Number"
          required
          value={value.contact_number ?? ""}
          onChange={(event) => handleFieldChange("contact_number", event.target.value)}
          placeholder="+1 403 XXX XXXX"
          caption="Enter the best number to reach the parent or guardian."
          containerClassName="w-full"
          inputMode="tel"
        />
      </div>

      <div className="flex w-full items-center justify-end gap-4">
        <Button variant="unfilled" onClick={() => onPrevious?.(getStepState())}>
          Previous
        </Button>
        <Button variant="filled" onClick={() => onNext?.(getStepState())}>
          Next
        </Button>
      </div>
    </section>
  );
}
