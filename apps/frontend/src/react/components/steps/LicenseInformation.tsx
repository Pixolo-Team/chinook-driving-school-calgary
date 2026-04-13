// REACT //
import React, { useEffect, useState } from "react";

// TYPES //
import type { LicenseInformationValueData, StepStateData } from "@/react/types/enrollment.type";

// COMPONENTS //
import Button from "@/react/components/ui/Button";
import Dropdown from "@/react/components/ui/Dropdown";
import Input from "@/react/components/ui/Input";
import RadioGroup from "@/react/components/ui/RadioGroup";
import RadioTab from "@/react/components/ui/RadioTab";

// CONSTANTS //
import {
  DRIVING_EXPERIENCE_ITEMS,
  LICENSE_ISSUING_REGIONS,
  LICENSE_STATUS_ITEMS,
  LICENSE_TYPES,
} from "@/react/constants/form-items";

// UTILS //
import { getLocalTodayDateValue } from "@/react/utils/date.util";

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

type LicenseInformationTouchedFieldsData = {
  status: boolean;
  number: boolean;
  issuing_region: boolean;
  type: boolean;
  issue_date: boolean;
  experience: boolean;
};

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
  const [touchedFields, setTouchedFields] = useState<LicenseInformationTouchedFieldsData>({
    status: false,
    number: false,
    issuing_region: false,
    type: false,
    issue_date: false,
    experience: false,
  });
  const todayDateValue: string = getLocalTodayDateValue();
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

  const markFieldAsTouched = (fieldKey: keyof LicenseInformationTouchedFieldsData): void => {
    setTouchedFields((currentTouchedFields) => ({
      ...currentTouchedFields,
      [fieldKey]: true,
    }));
  };

  const revealValidationErrors = (): void => {
    setTouchedFields({
      status: true,
      number: true,
      issuing_region: true,
      type: true,
      issue_date: true,
      experience: true,
    });
  };

  const getLicenseStatusError = (): string | null =>
    value.status.trim().length > 0 ? null : "Please select your license status.";

  const getLicenseNumberError = (): string | null => {
    if (!isLicenseDetailsVisible) {
      return null;
    }

    return (value.number ?? "").trim().length > 0 ? null : "Please enter your license number.";
  };

  const getIssuingRegionError = (): string | null => {
    if (!isLicenseDetailsVisible) {
      return null;
    }

    return (value.issuing_region ?? "").trim().length > 0
      ? null
      : "Please select your issuing province/state.";
  };

  const getLicenseTypeError = (): string | null => {
    if (!isLicenseDetailsVisible) {
      return null;
    }

    return (value.type ?? "").trim().length > 0 ? null : "Please select your license type.";
  };

  const getLicenseIssueDateError = (): string | null => {
    if (!isLicenseDetailsVisible) {
      return null;
    }

    const issueDateValue = (value.issue_date ?? "").trim();
    if (!issueDateValue) {
      return null;
    }

    return issueDateValue > todayDateValue
      ? "License issue date cannot be in the future."
      : null;
  };

  const getDrivingExperienceError = (): string | null =>
    value.experience.trim().length > 0 ? null : "Please select your driving experience.";

  /**
   * Returns the completion state for the License information step.
   */
  const getStepState = (): StepStateData => {
    return !getLicenseStatusError() &&
      !getLicenseNumberError() &&
      !getIssuingRegionError() &&
      !getLicenseTypeError() &&
      !getLicenseIssueDateError() &&
      !getDrivingExperienceError()
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

  const licenseStatusError = getLicenseStatusError();
  const licenseNumberError = getLicenseNumberError();
  const issuingRegionError = getIssuingRegionError();
  const licenseTypeError = getLicenseTypeError();
  const licenseIssueDateError = getLicenseIssueDateError();
  const drivingExperienceError = getDrivingExperienceError();
  const shouldShowLicenseStatusError = touchedFields.status && Boolean(licenseStatusError);
  const shouldShowLicenseNumberError = touchedFields.number && Boolean(licenseNumberError);
  const shouldShowIssuingRegionError = touchedFields.issuing_region && Boolean(issuingRegionError);
  const shouldShowLicenseTypeError = touchedFields.type && Boolean(licenseTypeError);
  const shouldShowLicenseIssueDateError =
    touchedFields.issue_date && Boolean(licenseIssueDateError);
  const shouldShowDrivingExperienceError =
    touchedFields.experience && Boolean(drivingExperienceError);

  // Use Effects
  useEffect(() => {
    if (!value.experience && DRIVING_EXPERIENCE_ITEMS[0]) {
      onChange("experience", DRIVING_EXPERIENCE_ITEMS[0].value);
    }
  }, [onChange, value.experience]);

  useEffect(() => {
    // Register the Validation function
    registerValidator?.(3, getStepState);
  }, [registerValidator, value]);

  return (
    <section className="bg-n-50 flex w-full flex-col gap-9 md:gap-14">
      <div className="flex w-full flex-col gap-8 md:gap-10">
        {/* License Status */}
        <RadioGroup
          label="License Status"
          name="license-status"
          caption=""
          isError={shouldShowLicenseStatusError}
          errorMessage={licenseStatusError ?? undefined}
          items={LICENSE_STATUS_ITEMS}
          selectedItem={value.status}
          onChange={(selectedValue) => {
            markFieldAsTouched("status");
            handleStatusChange(selectedValue);
          }}
          containerClassName="grid w-full grid-cols-1 gap-[10px] md:grid-cols-4 md:gap-4"
          itemContainerClassName="min-w-0"
        />

        {/* License Information */}
        {isLicenseDetailsVisible ? (
          <div className="flex w-full flex-col gap-6 md:gap-11">
            <div className="grid w-full grid-cols-1 gap-x-11 gap-y-6 md:gap-y-8 lg:grid-cols-2 lg:gap-y-11">
              {/* License Number */}
              <Input
                type="text"
                label="License Number"
                required
                value={value.number ?? ""}
                onChange={(event) => handleFieldChange("number", event.target.value)}
                onBlur={() => markFieldAsTouched("number")}
                placeholder="e.g. 1234-5678-7894"
                caption="Enter your name exactly as it appears on your ID or license."
                isError={shouldShowLicenseNumberError}
                errorMessage={licenseNumberError ?? undefined}
                containerClassName="w-full"
              />

              {/* Issuing Province */}
              <Dropdown
                label="Issuing Province / State"
                required
                value={value.issuing_region ?? ""}
                onChange={(event) => {
                  markFieldAsTouched("issuing_region");
                  handleFieldChange("issuing_region", event.target.value);
                }}
                placeholder="Select province/state"
                helperText="Enter your surname as per your official documents."
                isError={shouldShowIssuingRegionError}
                errorMessage={issuingRegionError ?? undefined}
                options={LICENSE_ISSUING_REGIONS.map((provinceItem) => ({
                  label: provinceItem.name,
                  value: provinceItem.value,
                }))}
                containerClassName="w-full max-w-none"
                labelClassName="text-n-700 text-base leading-5 font-normal"
                showTriggerLabel={false}
                styleVariant="minimal"
              />

              {/* License Type */}
              <Dropdown
                label="License Type"
                required
                value={value.type ?? ""}
                onChange={(event) => {
                  markFieldAsTouched("type");
                  handleFieldChange("type", event.target.value);
                }}
                placeholder="Select license type"
                helperText="Choose your current license category (e.g., learner, full license)."
                isError={shouldShowLicenseTypeError}
                errorMessage={licenseTypeError ?? undefined}
                options={LICENSE_TYPES}
                containerClassName="w-full max-w-none lg:col-span-2"
                labelClassName="text-n-700 text-base leading-5 font-normal"
                showTriggerLabel={false}
                styleVariant="minimal"
              />

              {/* Issue Date */}
              <Input
                type="date"
                label="License Issue Date"
                value={value.issue_date ?? ""}
                onChange={(event) => handleFieldChange("issue_date", event.target.value)}
                onBlur={() => markFieldAsTouched("issue_date")}
                placeholder="MM / DD / YYYY"
                caption="Enter the Issue date printed on your license."
                containerClassName="w-full"
                isError={shouldShowLicenseIssueDateError}
                errorMessage={licenseIssueDateError ?? undefined}
                max={todayDateValue}
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
          items={DRIVING_EXPERIENCE_ITEMS}
          isError={shouldShowDrivingExperienceError}
          errorMessage={drivingExperienceError ?? undefined}
          selected={
            value.experience
              ? DRIVING_EXPERIENCE_ITEMS.filter(
                  (drivingExperienceItem) => drivingExperienceItem.value === value.experience,
                )
              : [DRIVING_EXPERIENCE_ITEMS[0]]
          }
          allowMultiple={false}
          onChange={(selectedExperienceItems) => {
            markFieldAsTouched("experience");
            handleFieldChange("experience", selectedExperienceItems[0]?.value ?? "");
          }}
          caption=""
          labelClassName="text-n-800 text-base font-semibold md:text-lg"
          itemsContainerClassName="border-n-200 w-full flex-col gap-0 rounded-[12px] border p-1.5 md:flex-row md:flex-nowrap md:p-2"
          itemClassName="min-h-0 w-full rounded-[12px] border-0 px-4 py-[14px] text-sm font-semibold md:flex-1 md:text-base"
          activeItemClassName="bg-blue-500 text-n-50"
          inactiveItemClassName="bg-n-50 text-n-800"
        />
      </div>

      {/* Previous & Next buttons */}
      <div className="flex w-full flex-row items-center justify-end gap-3 md:gap-4">
        <Button
          variant="unfilled"
          onClick={() => onPrevious?.(getStepState())}
          className="min-h-0 px-4 py-[14px] text-[12px] md:px-7 md:text-[14px] lg:px-8 lg:py-4 lg:text-lg"
        >
          Back to User Info
        </Button>
        <Button
          variant="filled"
          onClick={() => {
            revealValidationErrors();
            onNext?.(getStepState());
          }}
          className="min-h-0 px-4 py-[14px] text-[12px] md:px-7 md:text-[14px] lg:px-8 lg:py-4 lg:text-lg"
        >
          Continue to Availability
        </Button>
      </div>
    </section>
  );
}
