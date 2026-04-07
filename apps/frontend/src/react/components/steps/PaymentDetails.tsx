// REACT //
import React, { useEffect } from "react";

// TYPES //
import type { PaymentDetailsValueData, StepStateData } from "@/react/types/enrollment.type";

// COMPONENTS //
import Button from "@/react/components/ui/Button";
import CheckboxTabGroup from "@/react/components/ui/CheckboxTabGroup";
import Input from "@/react/components/ui/Input";

// CONSTANTS //
import { PAYMENT_METHOD_ITEMS } from "@/react/constants/form-items";
import { URLS } from "@/infrastructure/constants/urls";

// COMPONENT PROPS //
type PaymentDetailsPropsData = Readonly<{
  value: PaymentDetailsValueData;
  onChange: (
    fieldKey: keyof PaymentDetailsValueData,
    fieldValue: PaymentDetailsValueData[keyof PaymentDetailsValueData],
  ) => void;
  registerValidator?: (stepId: number, validatorFunction: () => StepStateData) => void;
  onNext?: (state: StepStateData) => void;
  onPrevious?: (state: StepStateData) => void;
}>;

/**
 * Renders the Payment details step and reports field changes to the parent form.
 */
export default function PaymentDetails({
  value,
  onChange,
  registerValidator,
  onNext,
  onPrevious,
}: PaymentDetailsPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States
  const requiresCardDetails: boolean = value.method === "card";

  // Helper Functions
  /**
   * Returns the current completion state for the Payment details step.
   */
  function getStepState(): StepStateData {
    const requiredFieldValues: Array<string | number | boolean | null> = [
      value.method,
      value.did_agree_conditions,
    ];

    if (requiresCardDetails) {
      requiredFieldValues.push(value.card_number, value.expiry_date, value.name_on_card);
    }

    return requiredFieldValues.every((requiredFieldValueItem) => {
      if (typeof requiredFieldValueItem === "string") {
        return requiredFieldValueItem.trim().length > 0;
      }

      if (typeof requiredFieldValueItem === "number") {
        return true;
      }

      if (typeof requiredFieldValueItem === "boolean") {
        return requiredFieldValueItem;
      }

      return requiredFieldValueItem !== null;
    })
      ? "completed"
      : "pending";
  }

  /**
   * Updates a single Payment details field in the parent form state.
   */
  function handleFieldChange(
    fieldKey: keyof PaymentDetailsValueData,
    fieldValue: PaymentDetailsValueData[keyof PaymentDetailsValueData],
  ): void {
    onChange(fieldKey, fieldValue);
  }

  /**
   * Updates the selected payment method and clears card details when not needed.
   */
  function handlePaymentMethodChange(methodValue: string): void {
    handleFieldChange("method", methodValue);

    if (methodValue !== "card") {
      handleFieldChange("card_number", null);
      handleFieldChange("expiry_date", null);
      handleFieldChange("name_on_card", null);
    }
  }

  // Use Effects
  useEffect(() => {
    registerValidator?.(6, getStepState);
  }, [registerValidator, value]);

  return (
    <section className="bg-n-50 flex w-full flex-col gap-9 md:gap-14">
      <div className="flex w-full flex-col gap-8 md:gap-10">
        <CheckboxTabGroup
          items={PAYMENT_METHOD_ITEMS}
          selectedItem={value.method}
          onSelectionChange={handlePaymentMethodChange}
          itemsWrapperClassName="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
          itemContainerClassName="max-w-none"
        />

        {requiresCardDetails ? (
          <div className="flex w-full flex-col gap-6 md:gap-8">
            <p className="text-n-800 text-base leading-5 font-semibold md:text-lg">
              Payment Details
            </p>

            <div className="grid w-full grid-cols-1 gap-x-11 gap-y-6 md:gap-y-8 lg:grid-cols-2 lg:gap-y-10">
              <Input
                type="text"
                label="Card Number"
                required
                value={value.card_number ?? ""}
                onChange={(event) => handleFieldChange("card_number", event.target.value)}
                placeholder="0000 0000 0000 0000"
                caption="Enter the 16-digit number on your card."
                containerClassName="w-full"
                inputMode="numeric"
              />

              <Input
                type="text"
                label="Expiry Date"
                required
                value={value.expiry_date ?? ""}
                onChange={(event) => handleFieldChange("expiry_date", event.target.value)}
                placeholder="MM / YY"
                caption="Month and year your card expires."
                containerClassName="w-full"
              />

              <Input
                type="text"
                label="Name on Card"
                required
                value={value.name_on_card ?? ""}
                onChange={(event) => handleFieldChange("name_on_card", event.target.value)}
                placeholder="John Doe"
                caption="Enter the name exactly as shown on your card."
                containerClassName="w-full lg:col-span-2"
              />
            </div>

            <p className="text-n-600 text-base leading-5 font-semibold">
              Your payment details are secure and encrypted
            </p>
          </div>
        ) : null}
      </div>

      <div className="flex w-full flex-col items-start gap-5">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={value.did_agree_conditions}
            onChange={(event) => handleFieldChange("did_agree_conditions", event.target.checked)}
            className="border-n-300 h-5 w-5 rounded border text-blue-500"
          />
          <span className="text-sm leading-6" style={{ color: "var(--color-n-700)" }}>
            I agree to the{" "}
            <a
              href={URLS.TERMS_OF_SERVICE}
              className="font-semibold underline underline-offset-2"
              style={{ color: "var(--color-blue-500)" }}
            >
              Terms and Conditions
            </a>
          </span>
        </label>

        <div className="flex w-full flex-row items-center justify-end gap-3 md:gap-4">
          <Button
            variant="unfilled"
            onClick={() => onPrevious?.(getStepState())}
            className="min-h-0 px-4 py-[14px] text-[12px] md:px-7 md:text-[14px] lg:px-8 lg:py-4 lg:text-lg"
          >
            Back to Parent Info
          </Button>
          <Button
            variant="filled"
            onClick={() => onNext?.(getStepState())}
            className="min-h-0 px-4 py-[14px] text-[12px] md:px-7 md:text-[14px] lg:px-8 lg:py-4 lg:text-lg"
          >
            Complete Enrollment
          </Button>
        </div>
      </div>
    </section>
  );
}
