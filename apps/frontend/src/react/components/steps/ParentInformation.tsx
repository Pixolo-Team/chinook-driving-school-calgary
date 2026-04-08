// REACT //
import React, { useEffect, useState } from "react";

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

type ParentInformationTouchedFieldsData = {
  full_name: boolean;
  email: boolean;
  contact_number: boolean;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_DIGIT_PATTERN = /\d/g;

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
  const [touchedFields, setTouchedFields] = useState<ParentInformationTouchedFieldsData>({
    full_name: false,
    email: false,
    contact_number: false,
  });

  // Helper Functions
  function getParentNameError(): string | null {
    return (value.full_name ?? "").trim().length > 0 ? null : "Please enter parent/guardian name.";
  }

  function getParentEmailError(): string | null {
    const emailValue = (value.email ?? "").trim();

    if (emailValue.length === 0) {
      return "Enter a valid email address.";
    }

    return EMAIL_PATTERN.test(emailValue) ? null : "Enter a valid email address.";
  }

  function getParentPhoneError(): string | null {
    const contactNumberValue = (value.contact_number ?? "").trim();
    const phoneDigits = contactNumberValue.match(PHONE_DIGIT_PATTERN) ?? [];

    if (contactNumberValue.length === 0 || phoneDigits.length < 10) {
      return "Enter a valid phone number.";
    }

    return null;
  }

  /**
   * Returns the current completion state for the Parent information step.
   */
  function getStepState(): StepStateData {
    return !getParentNameError() && !getParentEmailError() && !getParentPhoneError()
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

  function markFieldAsTouched(fieldKey: keyof ParentInformationTouchedFieldsData): void {
    setTouchedFields((currentTouchedFields) => ({
      ...currentTouchedFields,
      [fieldKey]: true,
    }));
  }

  function revealValidationErrors(): void {
    setTouchedFields({
      full_name: true,
      email: true,
      contact_number: true,
    });
  }

  const parentNameError = getParentNameError();
  const parentEmailError = getParentEmailError();
  const parentPhoneError = getParentPhoneError();
  const shouldShowParentNameError = touchedFields.full_name && Boolean(parentNameError);
  const shouldShowParentEmailError = touchedFields.email && Boolean(parentEmailError);
  const shouldShowParentPhoneError = touchedFields.contact_number && Boolean(parentPhoneError);

  // Use Effects
  useEffect(() => {
    registerValidator?.(5, getStepState);
  }, [registerValidator, value]);

  return (
    <section className="bg-n-50 flex w-full flex-col gap-9 md:gap-14">
      <div className="flex w-full flex-col gap-7 md:gap-10">
        <div className="grid w-full grid-cols-1 gap-x-8 gap-y-6 md:gap-y-8 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-10">
          <Input
            type="text"
            label="Parent's Full Name"
            required
            value={value.full_name ?? ""}
            onChange={(event) => handleFieldChange("full_name", event.target.value)}
            onBlur={() => markFieldAsTouched("full_name")}
            placeholder="eg. John Doe"
            caption="Required if you are under 18."
            isError={shouldShowParentNameError}
            errorMessage={parentNameError ?? undefined}
            containerClassName="w-full"
          />

          <Input
            type="email"
            label="Parent's Email Address"
            required
            value={value.email ?? ""}
            onChange={(event) => handleFieldChange("email", event.target.value)}
            onBlur={() => markFieldAsTouched("email")}
            placeholder="parent@example.com"
            caption="We may share booking updates and confirmations."
            isError={shouldShowParentEmailError}
            errorMessage={parentEmailError ?? undefined}
            containerClassName="w-full"
          />

          <Input
            type="text"
            label="Parent's Phone number"
            required
            value={value.contact_number ?? ""}
            onChange={(event) => handleFieldChange("contact_number", event.target.value)}
            onBlur={() => markFieldAsTouched("contact_number")}
            placeholder="+1 403 XXX XXXX"
            caption="Include country code. Used if we need to contact them."
            isError={shouldShowParentPhoneError}
            errorMessage={parentPhoneError ?? undefined}
            containerClassName="w-full"
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
          onClick={() => {
            revealValidationErrors();
            onNext?.(getStepState());
          }}
          className="min-h-0 px-4 py-[14px] text-[12px] md:px-7 md:text-[14px] lg:px-8 lg:py-4 lg:text-lg"
        >
          Continue to Payment Details
        </Button>
      </div>
    </section>
  );
}
