// REACT //
import React, { useEffect } from "react";

// TYPES //
import type { LicenseInformationValueData, StepStateData } from "@/react/types/enrollment.type";

// COMPONENTS //
import Button from "../ui/Button";
import Dropdown from "../ui/Dropdown";
import Input from "../ui/Input";
import RadioGroup from "../ui/RadioGroup";
import RadioTab from "../ui/RadioTab";

// CONSTANTS //
import {
  DRIVING_EXPERIENCE_ITEMS,
  LICENSE_STATUS_ITEMS,
  LICENSE_TYPES,
  PROVINCES,
} from "@/react/constants/form-items";

// COMPONENT PROPS //
type LicenseInformationPropsData = Readonly<{
  value: LicenseInformationValueData;
  onChange: (
    fieldKey: keyof LicenseInformationValueData,
    fieldValue: LicenseInformationValueData[keyof LicenseInformationValueData],
  ) => void;
  registerValidator?: (stepId: number, validatorFunction: () => StepStateData) => void;
  onNext?: (state: StepStateData) => void;
  onPrevious?: (state: StepStateData) => void;
}>;

/**
 * Renders the License information step and reports updates to the parent form.
 */
export default function LicenseInformation({
  value,
  onChange,
  registerValidator,
  onNext,
  onPrevious,
}: LicenseInformationPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States
  const isLicenseDetailsVisible: boolean =
    value.status.trim().length > 0 && value.status !== "none";

  // Helper Functions
  /**
   * Updates one field in the License information section.
   */
  const handleFieldChange = (
    fieldKey: keyof LicenseInformationValueData,
    fieldValue: LicenseInformationValueData[keyof LicenseInformationValueData],
  ): void => {
    onChange(fieldKey, fieldValue);
  };

  /**
   * Returns the completion state for the License information step.
   */
  const getStepState = (): StepStateData => {
    // Base Required Values
    const baseRequiredFieldValues: string[] = [value.status, value.experience];

    // Check if Base fields are filled
    const hasBaseRequiredFields: boolean = baseRequiredFieldValues.every(
      (requiredFieldValueItem) => requiredFieldValueItem.trim().length > 0,
    );

    if (!hasBaseRequiredFields) {
      return "pending";
    }

    if (!isLicenseDetailsVisible) {
      return "completed";
    }

    // If the License details are required - then check other fields
    const conditionalRequiredFieldValues: Array<string | null> = [
      value.number,
      value.issuing_region,
      value.type,
    ];

    // Check if other License fields are filled
    return conditionalRequiredFieldValues.every(
      (requiredFieldValueItem) => (requiredFieldValueItem ?? "").trim().length > 0,
    )
      ? "completed"
      : "pending";
  };

  /**
   * Handles License Status changes and clears dependent fields when needed.
   */
  const handleStatusChange = (selectedValue: string): void => {
    handleFieldChange("status", selectedValue);

    if (selectedValue === "none") {
      handleFieldChange("number", null);
      handleFieldChange("issuing_region", null);
      handleFieldChange("type", null);
      handleFieldChange("issue_date", null);
      handleFieldChange("expiry_date", null);
    }
  };

  // Use Effects
  useEffect(() => {
    // Register the Validation function
    registerValidator?.(3, getStepState);
  }, [registerValidator, value]);

  return (
    <section className="bg-n-50 flex w-full flex-col gap-16">
      <div className="flex w-full flex-col gap-10">
        {/* License Status */}
        <RadioGroup
          label="License Status"
          required
          name="license-status"
          items={LICENSE_STATUS_ITEMS}
          selectedItem={value.status}
          onChange={handleStatusChange}
          containerClassName="gap-4"
        />

        {/* License Information */}
        {isLicenseDetailsVisible ? (
          <div className="flex w-full flex-col gap-11">
            <div className="grid w-full grid-cols-1 gap-x-11 gap-y-11 lg:grid-cols-2">
              {/* License Number */}
              <Input
                type="text"
                label="License Number"
                required
                value={value.number ?? ""}
                onChange={(event) => handleFieldChange("number", event.target.value)}
                placeholder="e.g. 1234-5678-7894"
                caption="Enter your name exactly as it appears on your ID or license."
                containerClassName="w-full"
              />

              {/* Issuing Province */}
              <Dropdown
                label="Issuing Province / State"
                required
                value={value.issuing_region ?? ""}
                onChange={(event) => handleFieldChange("issuing_region", event.target.value)}
                placeholder="Select province/state"
                helperText="Enter your surname as per your official documents."
                options={PROVINCES.map((provinceItem) => ({
                  label: provinceItem.name,
                  value: provinceItem.value,
                }))}
                containerClassName="w-full max-w-none"
              />

              {/* License Type */}
              <Dropdown
                label="License Type"
                required
                value={value.type ?? ""}
                onChange={(event) => handleFieldChange("type", event.target.value)}
                placeholder="Select license type"
                helperText="Choose your current license category (e.g., learner, full license)."
                options={LICENSE_TYPES}
                containerClassName="w-full max-w-none lg:col-span-2"
              />

              {/* Issue Date */}
              <Input
                type="date"
                label="License Issue Date"
                value={value.issue_date ?? ""}
                onChange={(event) => handleFieldChange("issue_date", event.target.value)}
                placeholder="MM / DD / YYYY"
                caption="Enter the Issue date printed on your license."
                containerClassName="w-full"
              />

              {/* Expiry Date */}
              <Input
                type="date"
                label="License Expiry Date"
                value={value.expiry_date ?? ""}
                onChange={(event) => handleFieldChange("expiry_date", event.target.value)}
                placeholder="MM / DD / YYYY"
                caption="Enter the expiry date printed on your license."
                containerClassName="w-full"
              />
            </div>
          </div>
        ) : null}

        {/* Driving Experience */}
        <RadioTab
          label="Driving Experience"
          required
          items={DRIVING_EXPERIENCE_ITEMS}
          selected={
            value.experience
              ? DRIVING_EXPERIENCE_ITEMS.filter(
                  (drivingExperienceItem) => drivingExperienceItem.value === value.experience,
                )
              : [DRIVING_EXPERIENCE_ITEMS[0]]
          }
          allowMultiple={false}
          onChange={(selectedExperienceItems) =>
            handleFieldChange("experience", selectedExperienceItems[0]?.value ?? "")
          }
          caption=""
        />
      </div>

      {/* Previous & Next buttons */}
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
