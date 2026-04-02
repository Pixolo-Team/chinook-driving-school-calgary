// REACT //
import React, { useEffect } from "react";

// TYPES //
import type { AvailabilityValueData, StepStateData } from "@/react/types/enrollment.type";

// COMPONENTS //
import Button from "../ui/Button";
import Input from "../ui/Input";
import RadioTab from "../ui/RadioTab";

// CONSTANTS //
import { PREFERRED_DAYS_ITEMS, TIME_SLOT_ITEMS } from "@/react/constants/form-items";

// COMPONENT PROPS //
type AvailabilityPropsData = Readonly<{
  value: AvailabilityValueData;
  onChange: (
    fieldKey: keyof AvailabilityValueData,
    fieldValue: AvailabilityValueData[keyof AvailabilityValueData],
  ) => void;
  registerValidator?: (stepId: number, validatorFunction: () => StepStateData) => void;
  onNext?: (state: StepStateData) => void;
  onPrevious?: (state: StepStateData) => void;
}>;

/**
 * Renders the Availability step and reports changes back to the parent form.
 */
export default function Availability({
  value,
  onChange,
  registerValidator,
  onNext,
  onPrevious,
}: AvailabilityPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions
  /**
   * Updates one field in the Availability section.
   */
  const handleFieldChange = (
    fieldKey: keyof AvailabilityValueData,
    fieldValue: AvailabilityValueData[keyof AvailabilityValueData],
  ): void => {
    onChange(fieldKey, fieldValue);
  };

  /**
   * Returns the completion state for the Availability step.
   */
  const getStepState = (): StepStateData => {
    // Required Fields
    const requiredFieldValues: Array<string | string[]> = [];

    // Check if Required Fields are fileld
    const hasAllRequiredFields: boolean =
      requiredFieldValues.length > 0
        ? requiredFieldValues.every((requiredFieldValueItem) => {
            if (Array.isArray(requiredFieldValueItem)) {
              return requiredFieldValueItem.length > 0;
            }

            return requiredFieldValueItem.trim().length > 0;
          })
        : true;

    return hasAllRequiredFields ? "completed" : "pending";
  };

  // Use Effects
  useEffect(() => {
    // Register the validator
    registerValidator?.(4, getStepState);
  }, [registerValidator, value]);

  return (
    <section className="bg-n-50 flex w-full flex-col gap-16">
      <div className="flex w-full flex-col gap-10">
        {/* Available From Date */}
        <Input
          type="date"
          label="Available From"
          value={value.date}
          onChange={(event) => handleFieldChange("date", event.target.value)}
          placeholder="YYYY-MM-DD"
          caption="Optional. Select when you can start your lessons."
          containerClassName="w-full"
        />

        {/* Preferred Days */}
        <RadioTab
          label="Preferred Days"
          caption="Choose any days that generally work for your schedule."
          items={PREFERRED_DAYS_ITEMS}
          selected={PREFERRED_DAYS_ITEMS.filter((preferredDayItem) =>
            value.days.includes(preferredDayItem.value),
          )}
          allowMultiple
          onChange={(selectedDayItems) =>
            handleFieldChange(
              "days",
              selectedDayItems.map((selectedDayItem) => selectedDayItem.value),
            )
          }
        />

        {/* Time Slots */}
        <RadioTab
          label="Time Slots"
          caption="Choose any time windows that are most convenient for you."
          items={TIME_SLOT_ITEMS}
          selected={TIME_SLOT_ITEMS.filter((timeSlotItem) =>
            value.time_slots.includes(timeSlotItem.value),
          )}
          allowMultiple
          onChange={(selectedTimeSlotItems) =>
            handleFieldChange(
              "time_slots",
              selectedTimeSlotItems.map((selectedTimeSlotItem) => selectedTimeSlotItem.value),
            )
          }
        />
      </div>

      {/* Previous and Next Buttons */}
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
