// REACT //
import React, { useEffect } from "react";

// TYPES //
import type { StepStateData, UserInfoValueData } from "@/react/types/enrollment.type";

// COMPONENTS //
import Button from "../ui/Button";
import Dropdown from "../ui/Dropdown";
import Input from "../ui/Input";

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
  const todayDateValue: string = new Date().toISOString().split("T")[0] ?? "";

  // Helper Functions
  /**
   * Returns the current completion state for the User information step.
   */
  const getStepState = (): StepStateData => {
    // Required Fields
    const requiredFieldValues: string[] = [
      value.first_name,
      value.last_name,
      value.date_of_birth,
      value.email,
      value.phone,
    ];

    // Check if all fields are required
    return requiredFieldValues.every(
      (requiredFieldValueItem) => requiredFieldValueItem.trim().length > 0,
    )
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

  // Use Effects
  useEffect(() => {
    registerValidator?.(2, getStepState);
  }, [registerValidator, value]);

  return (
    <section className="bg-n-50 flex w-full flex-col gap-20">
      <div className="grid w-full grid-cols-1 gap-x-11 gap-y-11 lg:grid-cols-2">
        {/* First Name */}
        <Input
          type="text"
          label="First Name"
          required
          value={value.first_name}
          onChange={(event) => handleFieldChange("first_name", event.target.value)}
          placeholder="Type First Name"
          caption="Enter your first name exactly as it appears on your ID or license."
          containerClassName="w-full"
        />

        {/* Last Name */}
        <Input
          type="text"
          label="Last Name"
          required
          value={value.last_name}
          onChange={(event) => handleFieldChange("last_name", event.target.value)}
          placeholder="Type Last Name"
          caption="Enter your last name exactly as it appears on your ID or license."
          containerClassName="w-full"
        />

        {/* Date of Birth */}
        <Input
          type="date"
          label="Date of Birth"
          required
          value={value.date_of_birth}
          onChange={(event) => handleFieldChange("date_of_birth", event.target.value)}
          placeholder={todayDateValue}
          caption="Example: 01/04/2026"
          containerClassName="w-full"
        />

        {/* Email */}
        <Input
          type="email"
          label="Email Address"
          required
          value={value.email}
          onChange={(event) => handleFieldChange("email", event.target.value)}
          placeholder="you@example.com"
          caption="We’ll send booking details and updates to this email."
          containerClassName="w-full"
        />

        {/* Mobile Number */}
        <Input
          type="text"
          label="Phone Number"
          required
          value={value.phone}
          onChange={(event) => handleFieldChange("phone", event.target.value)}
          placeholder="+1 403 XXX XXXX"
          caption="Your Mobile Phone Number"
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
      </div>

      {/* Previous & Next Buttons */}
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
