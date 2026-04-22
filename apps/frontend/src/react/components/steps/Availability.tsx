// REACT //
import React, { useEffect, useState } from "react";

// TYPES //
import type { AvailabilityValueData, StepStateData } from "@/react/types/enrollment.type";

// COMPONENTS //
import Button from "@/react/components/ui/Button";
import Input from "@/react/components/ui/Input";
import RadioTab from "@/react/components/ui/RadioTab";

// CONSTANTS //
import { PREFERRED_DAYS_ITEMS, TIME_SLOT_ITEMS } from "@/react/constants/form-items";

// UTILS //
import { getLocalTodayDateValue } from "@/react/utils/date.util";

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

type AvailabilityTouchedFieldsData = {
  date: boolean;
  days: boolean;
  time_slots: boolean;
};

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
  const [touchedFields, setTouchedFields] = useState<AvailabilityTouchedFieldsData>({
    date: false,
    days: false,
    time_slots: false,
  });
  const todayDateValue: string = getLocalTodayDateValue();

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

  const markFieldAsTouched = (fieldKey: keyof AvailabilityTouchedFieldsData): void => {
    setTouchedFields((currentTouchedFields) => ({
      ...currentTouchedFields,
      [fieldKey]: true,
    }));
  };

  const revealValidationErrors = (): void => {
    setTouchedFields({
      date: true,
      days: true,
      time_slots: true,
    });
  };

  const getDateError = (): string | null => {
    const availabilityDateValue = value.date.trim();

    if (availabilityDateValue.length === 0) {
      return "Please select an available from date.";
    }

    if (availabilityDateValue < todayDateValue) {
      return "Available from date cannot be in the past.";
    }

    return null;
  };

  const getPreferredDaysError = (): string | null =>
    value.days.length > 0 ? null : "Please select at least one preferred day.";

  const getTimeSlotsError = (): string | null =>
    value.time_slots.length > 0 ? null : "Please select at least one time slot.";

  /**
   * Returns the completion state for the Availability step.
   */
  const getStepState = (): StepStateData => {
    return !getDateError() && !getPreferredDaysError() && !getTimeSlotsError()
      ? "completed"
      : "pending";
  };

  const dateError = getDateError();
  const preferredDaysError = getPreferredDaysError();
  const timeSlotsError = getTimeSlotsError();
  const shouldShowDateError = touchedFields.date && Boolean(dateError);
  const shouldShowPreferredDaysError = touchedFields.days && Boolean(preferredDaysError);
  const shouldShowTimeSlotsError = touchedFields.time_slots && Boolean(timeSlotsError);

  // Use Effects
  useEffect(() => {
    // Register the validator
    registerValidator?.(4, getStepState);
  }, [registerValidator, value]);

  return (
    <section className="bg-n-50 flex w-full flex-col gap-9 md:gap-14">
      <div className="flex w-full flex-col gap-7 md:gap-10">
        <div className="flex w-full flex-col gap-7 md:gap-8">
          <div className="grid w-full grid-cols-1 gap-7 md:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            {/* Available From Date */}
            <Input
              type="date"
              label="Available From"
              value={value.date}
              onChange={(event) => handleFieldChange("date", event.target.value)}
              onBlur={() => markFieldAsTouched("date")}
              placeholder="Select date"
              caption="Choose when you'd like your lessons to begin."
              isError={shouldShowDateError}
              errorMessage={dateError ?? undefined}
              containerClassName="w-full"
              min={todayDateValue}
            />

            {/* Preferred Days */}
            <RadioTab
              label="Preferred Days"
              caption="Select the days you're available."
              isError={shouldShowPreferredDaysError}
              errorMessage={preferredDaysError ?? undefined}
              items={PREFERRED_DAYS_ITEMS}
              selected={PREFERRED_DAYS_ITEMS.filter((preferredDayItem) =>
                value.days.includes(preferredDayItem.value),
              )}
              allowMultiple
              onChange={(selectedDayItems) => {
                markFieldAsTouched("days");
                handleFieldChange(
                  "days",
                  selectedDayItems.map((selectedDayItem) => selectedDayItem.value),
                );
              }}
              containerClassName="gap-4"
              itemsContainerClassName="gap-2 md:gap-3"
              itemClassName="min-h-0 rounded-[12px] px-6 py-[14px] text-sm font-semibold md:flex-none md:px-8 md:text-base"
              activeItemClassName="border-blue-500 bg-blue-500 text-n-50"
              inactiveItemClassName="border-n-400 bg-n-50 text-n-600"
            />
          </div>

          {/* Time Slots */}
          <RadioTab
            label="Time slots"
            caption=""
            isError={shouldShowTimeSlotsError}
            errorMessage={timeSlotsError ?? undefined}
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
            onChange={(selectedTimeSlotItems) => {
              markFieldAsTouched("time_slots");
              handleFieldChange(
                "time_slots",
                selectedTimeSlotItems.map((selectedTimeSlotItem) => selectedTimeSlotItem.value),
              );
            }}
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
          Back to License Info
        </Button>
        <Button
          variant="filled"
          onClick={() => {
            revealValidationErrors();
            onNext?.(getStepState());
          }}
          className="min-h-0 px-4 py-[14px] text-[12px] md:px-7 md:text-[14px] lg:px-8 lg:py-4 lg:text-lg"
        >
          Continue to Emergency Contact Info
        </Button>
      </div>
    </section>
  );
}
