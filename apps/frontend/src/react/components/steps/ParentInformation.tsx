// REACT //
import React, { useEffect } from "react";

// TYPES //
import type {
  ParentInformationValueData,
  StepStateData,
} from "@/react/types/enrollment.type";

// COMPONENTS //
import Button from "@/react/components/ui/Button";
import Input from "@/react/components/ui/Input";

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
    <section className="bg-n-50 flex w-full flex-col gap-9 md:gap-14">
      <div className="flex w-full flex-col gap-7 md:gap-10">
        <p className="text-n-800 text-base leading-5 font-semibold md:text-lg">
          Parent / Guardian Details
        </p>

        <div className="grid w-full grid-cols-1 gap-x-8 gap-y-6 md:gap-y-8 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-10">
        <Input
          type="text"
          label="Parent's Full Name"
          required
          value={value.full_name ?? ""}
          onChange={(event) => handleFieldChange("full_name", event.target.value)}
          placeholder="eg. John Doe"
          caption="Required if you are under 18."
          containerClassName="w-full"
        />

        <Input
          type="email"
          label="Parent's Email Address"
          required
          value={value.email ?? ""}
          onChange={(event) => handleFieldChange("email", event.target.value)}
          placeholder="parent@example.com"
          caption="We may share booking updates and confirmations."
          containerClassName="w-full"
        />

        <Input
          type="text"
          label="Parent's Phone number"
          required
          value={value.contact_number ?? ""}
          onChange={(event) => handleFieldChange("contact_number", event.target.value)}
          placeholder="+1 403 XXX XXXX"
          caption="Include country code. Used if we need to contact them."
          containerClassName="w-full lg:max-w-[calc(50%-32px)]"
          inputMode="tel"
        />
      </div>
      </div>

      <div className="flex w-full flex-row items-center justify-end gap-3 md:gap-4">
        <Button
          variant="unfilled"
          onClick={() => onPrevious?.(getStepState())}
          className="min-h-0 px-4 py-[14px] text-[12px] md:px-7 md:text-[14px] lg:px-8 lg:py-4 lg:text-lg"
        >
          Back to Availability
        </Button>
        <Button
          variant="filled"
          onClick={() => onNext?.(getStepState())}
          className="min-h-0 px-4 py-[14px] text-[12px] md:px-7 md:text-[14px] lg:px-8 lg:py-4 lg:text-lg"
        >
          Continue to Payment Details
        </Button>
      </div>
    </section>
  );
}
