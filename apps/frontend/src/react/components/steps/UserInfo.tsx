// REACT //
import React, { useEffect, useState } from "react";

// TYPES //
import type { StepStateData, UserInfoValueData } from "@/react/types/enrollment.type";

// COMPONENTS //
import Button from "@/react/components/ui/Button";
import Dropdown from "@/react/components/ui/Dropdown";
import Input from "@/react/components/ui/Input";

// CONSTANTS //
import { PROVINCES } from "@/react/constants/form-items";

/** Props for Component */
type UserInfoPropsData = Readonly<{
  value: UserInfoValueData;
  onChange: (
    fieldKey: keyof UserInfoValueData,
    fieldValue: UserInfoValueData[keyof UserInfoValueData],
  ) => void;
  registerValidator?: (stepId: number, validatorFunction: () => StepStateData) => void;
  onNext?: (state: StepStateData) => void;
  onPrevious?: (state: StepStateData) => void;
}>;

type UserInfoTouchedFieldsData = {
  first_name: boolean;
  last_name: boolean;
  date_of_birth: boolean;
  email: boolean;
  phone: boolean;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_DIGIT_PATTERN = /\d/g;

/**
 * Renders the User information step and reports field changes to the parent.
 */
export default function UserInfo({
  value,
  onChange,
  registerValidator,
  onNext,
  onPrevious,
}: UserInfoPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States
  const [touchedFields, setTouchedFields] = useState<UserInfoTouchedFieldsData>({
    first_name: false,
    last_name: false,
    date_of_birth: false,
    email: false,
    phone: false,
  });
  const todayDateValue: string = new Date().toISOString().split("T")[0] ?? "";

  // Helper Functions
  const markFieldAsTouched = (fieldKey: keyof UserInfoTouchedFieldsData): void => {
    setTouchedFields((currentTouchedFields) => ({
      ...currentTouchedFields,
      [fieldKey]: true,
    }));
  };

  const revealValidationErrors = (): void => {
    setTouchedFields({
      first_name: true,
      last_name: true,
      date_of_birth: true,
      email: true,
      phone: true,
    });
  };

  const getFirstNameError = (): string | null =>
    value.first_name.trim().length > 0 ? null : "Please enter your first name.";

  const getLastNameError = (): string | null =>
    value.last_name.trim().length > 0 ? null : "Please enter your last name.";

  const getDateOfBirthError = (): string | null =>
    value.date_of_birth.trim().length > 0 ? null : "Please enter your date of birth.";

  const getEmailError = (): string | null => {
    const emailValue = value.email.trim();

    if (emailValue.length === 0) {
      return "Enter a valid email address.";
    }

    return EMAIL_PATTERN.test(emailValue) ? null : "Enter a valid email address.";
  };

  const getPhoneError = (): string | null => {
    const phoneValue = value.phone.trim();
    const phoneDigits = phoneValue.match(PHONE_DIGIT_PATTERN) ?? [];

    if (phoneValue.length === 0 || phoneDigits.length < 10) {
      return "Enter a valid phone number.";
    }

    return null;
  };

  /**
   * Returns the current completion state for the User information step.
   */
  const getStepState = (): StepStateData => {
    return !getFirstNameError() &&
      !getLastNameError() &&
      !getDateOfBirthError() &&
      !getEmailError() &&
      !getPhoneError()
      ? "completed"
      : "pending";
  };

  /**
   * Updates a single User information field in the parent form state.
   */
  const handleFieldChange = (
    fieldKey: keyof UserInfoValueData,
    fieldValue: UserInfoValueData[keyof UserInfoValueData],
  ): void => {
    onChange(fieldKey, fieldValue);
  };

  const firstNameError = getFirstNameError();
  const lastNameError = getLastNameError();
  const dateOfBirthError = getDateOfBirthError();
  const emailError = getEmailError();
  const phoneError = getPhoneError();
  const shouldShowFirstNameError = touchedFields.first_name && Boolean(firstNameError);
  const shouldShowLastNameError = touchedFields.last_name && Boolean(lastNameError);
  const shouldShowDateOfBirthError = touchedFields.date_of_birth && Boolean(dateOfBirthError);
  const shouldShowEmailError = touchedFields.email && Boolean(emailError);
  const shouldShowPhoneError = touchedFields.phone && Boolean(phoneError);

  // Use Effects
  useEffect(() => {
    registerValidator?.(2, getStepState);
  }, [registerValidator, value]);

  return (
    <section className="bg-n-50 flex w-full flex-col gap-9 md:gap-14">
      <div className="grid w-full grid-cols-1 gap-x-7 gap-y-6 md:gap-y-8 lg:grid-cols-2 lg:gap-x-11 lg:gap-y-11">
        {/* First Name */}
        <Input
          type="text"
          label="First Name"
          required
          value={value.first_name}
          onChange={(event) => handleFieldChange("first_name", event.target.value)}
          onBlur={() => markFieldAsTouched("first_name")}
          placeholder="Type First Name"
          caption="Enter your first name exactly as it appears on your ID or license."
          isError={shouldShowFirstNameError}
          errorMessage={firstNameError ?? undefined}
          containerClassName="w-full"
        />

        {/* Last Name */}
        <Input
          type="text"
          label="Last Name"
          required
          value={value.last_name}
          onChange={(event) => handleFieldChange("last_name", event.target.value)}
          onBlur={() => markFieldAsTouched("last_name")}
          placeholder="Type Last Name"
          caption="Enter your last name exactly as it appears on your ID or license."
          isError={shouldShowLastNameError}
          errorMessage={lastNameError ?? undefined}
          containerClassName="w-full"
        />

        {/* Date of Birth */}
        <Input
          type="date"
          label="Date of Birth"
          required
          value={value.date_of_birth}
          onChange={(event) => handleFieldChange("date_of_birth", event.target.value)}
          onBlur={() => markFieldAsTouched("date_of_birth")}
          placeholder={todayDateValue}
          caption="Example: 01/04/2026"
          isError={shouldShowDateOfBirthError}
          errorMessage={dateOfBirthError ?? undefined}
          containerClassName="w-full"
        />

        {/* Email */}
        <Input
          type="email"
          label="Email Address"
          required
          value={value.email}
          onChange={(event) => handleFieldChange("email", event.target.value)}
          onBlur={() => markFieldAsTouched("email")}
          placeholder="you@example.com"
          caption="We’ll send booking details and updates to this email."
          isError={shouldShowEmailError}
          errorMessage={emailError ?? undefined}
          containerClassName="w-full"
        />

        {/* Mobile Number */}
        <Input
          type="text"
          label="Phone Number"
          required
          value={value.phone}
          onChange={(event) => handleFieldChange("phone", event.target.value)}
          onBlur={() => markFieldAsTouched("phone")}
          placeholder="+1 403 XXX XXXX"
          caption="Your Mobile Phone Number"
          isError={shouldShowPhoneError}
          errorMessage={phoneError ?? undefined}
          containerClassName="w-full"
          inputMode="tel"
        />

        {/* Address */}
        <Input
          type="text"
          label="Residential Address"
          value={value.address}
          onChange={(event) => handleFieldChange("address", event.target.value)}
          placeholder="Street, Building, Floor"
          caption="Enter your current residential address (used for registration and communication)."
          containerClassName="w-full"
        />

        {/* City */}
        <Input
          type="text"
          label="City"
          value={value.city}
          onChange={(event) => handleFieldChange("city", event.target.value)}
          placeholder="Enter City"
          caption="Enter your City Name"
          containerClassName="w-full"
        />

        {/* Postal Code */}
        <Input
          type="text"
          label="Postal Code"
          value={value.postal_code}
          onChange={(event) => handleFieldChange("postal_code", event.target.value)}
          placeholder="e.g. T2X 1A1"
          caption="Enter a valid postal code for your area (used to assign nearby instructors)."
          containerClassName="w-full"
        />

        {/* Province */}
        <Dropdown
          label="Province"
          value={value.state}
          onChange={(event) => handleFieldChange("state", event.target.value)}
          placeholder="Select Province"
          helperText="Select your Province from the dropdown"
          options={PROVINCES.map((provinceItem) => ({
            label: provinceItem.name,
            value: provinceItem.value,
          }))}
          containerClassName="w-full max-w-none lg:col-span-1"
          labelClassName="text-n-700 text-base leading-5 font-normal"
          showTriggerLabel={false}
          styleVariant="minimal"
        />
      </div>

      {/* Previous & Next Buttons */}
      <div className="flex w-full flex-row items-center justify-end gap-3 md:gap-4">
        <Button
          variant="unfilled"
          onClick={() => onPrevious?.(getStepState())}
          className="min-h-0 px-4 py-[14px] text-[12px] md:px-7 md:text-[14px] lg:px-8 lg:py-4 lg:text-lg"
        >
          Back to Select Course
        </Button>
        <Button
          variant="filled"
          onClick={() => {
            revealValidationErrors();
            onNext?.(getStepState());
          }}
          className="min-h-0 px-4 py-[14px] text-[12px] md:px-7 md:text-[14px] lg:px-8 lg:py-4 lg:text-lg"
        >
          Continue to Licence Info
        </Button>
      </div>
    </section>
  );
}
