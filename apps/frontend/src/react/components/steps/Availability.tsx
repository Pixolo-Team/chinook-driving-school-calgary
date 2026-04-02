// REACT //
import React, { useEffect } from "react";

// TYPES //
import type { AvailabilityValueData, StepStateData } from "@/react/types/enrollment.type";

// COMPONENTS //
import Button from "@/react/components/ui/Button";
import Input from "@/react/components/ui/Input";
import RadioTab from "@/react/components/ui/RadioTab";

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
    const requiredFieldValues: Array<string | string[]> = [value.date, value.days, value.time_slots];

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
    <section className="bg-n-50 flex w-full flex-col gap-9 md:gap-14">
      <div className="flex w-full flex-col gap-7 md:gap-10">
        <div className="flex w-full flex-col gap-7 md:gap-8">
          <p className="text-base leading-5 font-semibold text-n-800 md:text-lg">
            Preferred Schedule
          </p>

          <div className="grid w-full grid-cols-1 gap-7 md:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            {/* Available From Date */}
            <Input
              type="date"
              label="Available From"
              value={value.date}
              onChange={(event) => handleFieldChange("date", event.target.value)}
              placeholder="Select date"
              caption="Choose when you'd like your lessons to begin."
              containerClassName="w-full"
            />

            {/* Preferred Days */}
            <RadioTab
              label="Preferred Days"
              caption="Select the days you're available."
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
              containerClassName="gap-4"
              itemsContainerClassName="gap-2 md:gap-3 md:flex-nowrap"
              itemClassName="min-h-0 rounded-[12px] px-6 py-[14px] text-sm font-semibold md:flex-1 md:px-8 md:text-base"
              activeItemClassName="border-blue-500 bg-blue-500 text-n-50"
              inactiveItemClassName="border-n-400 bg-n-50 text-n-600"
            />
          </div>

          {/* Time Slots */}
          <RadioTab
            label="Time slots"
            caption=""
            items={TIME_SLOT_ITEMS.map((timeSlotItem) => ({
              ...timeSlotItem,
              label:
                timeSlotItem.value === "morning"
                  ? "Morning (9AM-11AM)"
                  : timeSlotItem.value === "afternoon"
                    ? "Afternoon (11AM-2PM)"
                    : "Evening (2PM-5PM)",
            }))}
            selected={TIME_SLOT_ITEMS.filter((timeSlotItem) =>
              value.time_slots.includes(timeSlotItem.value),
            ).map((timeSlotItem) => ({
              ...timeSlotItem,
              label:
                timeSlotItem.value === "morning"
                  ? "Morning (9AM-11AM)"
                  : timeSlotItem.value === "afternoon"
                    ? "Afternoon (11AM-2PM)"
                    : "Evening (2PM-5PM)",
            }))}
            allowMultiple
            onChange={(selectedTimeSlotItems) =>
              handleFieldChange(
                "time_slots",
                selectedTimeSlotItems.map((selectedTimeSlotItem) => selectedTimeSlotItem.value),
              )
            }
            containerClassName="gap-4"
            itemsContainerClassName="gap-2 md:gap-4"
            itemClassName="min-h-0 rounded-[12px] px-5 py-[14px] text-sm font-medium md:flex-none md:text-base"
            activeItemClassName="border-blue-500 bg-blue-500 text-n-50"
            inactiveItemClassName="border-n-400 bg-n-50 text-n-600"
          />
        </div>
      </div>

      {/* Previous and Next Buttons */}
      <div className="flex w-full flex-row items-center justify-end gap-3 md:gap-4">
        <Button
          variant="unfilled"
          onClick={() => onPrevious?.(getStepState())}
          className="min-h-0 px-4 py-[14px] text-[12px] md:px-7 md:text-[14px] lg:px-8 lg:py-4 lg:text-lg"
        >
          Back to Licence Info.
        </Button>
        <Button
          variant="filled"
          onClick={() => onNext?.(getStepState())}
          className="min-h-0 px-4 py-[14px] text-[12px] md:px-7 md:text-[14px] lg:px-8 lg:py-4 lg:text-lg"
        >
          Continue to Parent Info.
        </Button>
      </div>
    </section>
  );
}
