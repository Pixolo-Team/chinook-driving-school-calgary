// REACT //
import React, { useEffect } from "react";

// TYPES //
import type {
  PaymentDetailsValueData,
  StepStateData,
} from "@/react/types/enrollment.type";

// COMPONENTS //
import Button from "../ui/Button";
import CheckboxTabGroup from "../ui/CheckboxTabGroup";
import Input from "../ui/Input";

// CONSTANTS //
import { PAYMENT_METHOD_ITEMS } from "@/react/constants/form-items";

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
  const isCreditCardSelected: boolean = value.method === "card";

  // Helper Functions
  /**
   * Returns the current completion state for the Payment details step.
   */
  function getStepState(): StepStateData {
    const requiredFieldValues: Array<string | number | boolean | null> = [
      value.method,
      value.did_agree_conditions,
    ];

    if (isCreditCardSelected) {
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
        return true;
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
    <section className="bg-n-50 flex w-full flex-col gap-20">
      <div className="flex w-full flex-col gap-10">
        <CheckboxTabGroup
          label="Payment Method"
          required
          items={PAYMENT_METHOD_ITEMS}
          selectedItem={value.method}
          onSelectionChange={handlePaymentMethodChange}
        />

        {isCreditCardSelected ? (
          <div className="grid w-full grid-cols-1 gap-x-11 gap-y-11 lg:grid-cols-2">
            <Input
              type="number"
              label="Card Number"
              required
              value={value.card_number ?? ""}
              onChange={(event) => handleFieldChange("card_number", event.target.value)}
              placeholder="1234 5678 9012 3456"
              caption="Enter the number shown on the front of your card."
              containerClassName="w-full lg:col-span-2"
              inputMode="numeric"
            />

            <Input
              type="date"
              label="Expiry Date"
              required
              value={value.expiry_date ?? ""}
              onChange={(event) => handleFieldChange("expiry_date", event.target.value)}
              placeholder="YYYY-MM-DD"
              caption="Enter the expiry date for the selected card."
              containerClassName="w-full"
            />

            <Input
              type="text"
              label="Name on Card"
              required
              value={value.name_on_card ?? ""}
              onChange={(event) => handleFieldChange("name_on_card", event.target.value)}
              placeholder="Type Name on Card"
              caption="Enter the cardholder name exactly as it appears on the card."
              containerClassName="w-full"
            />
          </div>
        ) : null}

        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={value.did_agree_conditions}
            onChange={(event) => handleFieldChange("did_agree_conditions", event.target.checked)}
            className="mt-1 h-5 w-5 rounded border border-[var(--color-n-300)] text-[var(--color-blue-500)]"
          />
          <span className="text-sm leading-6" style={{ color: "var(--color-n-700)" }}>
            I have read and agree to the{" "}
            <a
              href="#"
              className="font-semibold underline underline-offset-2"
              style={{ color: "var(--color-blue-500)" }}
            >
              Terms and Conditions
            </a>
          </span>
        </label>
      </div>

      <div className="flex w-full items-center justify-end gap-4">
        <Button variant="unfilled" onClick={() => onPrevious?.(getStepState())}>
          Previous
        </Button>
        <Button variant="filled" onClick={() => onNext?.(getStepState())}>
          Complete
        </Button>
      </div>
    </section>
  );
}
