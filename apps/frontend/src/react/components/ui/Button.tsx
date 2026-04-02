// REACT //
import React, { type ButtonHTMLAttributes } from "react";

type ButtonVariantData = "filled" | "unfilled" | "Filled" | "Unfilled";

type ButtonPropsData = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariantData;
};

function joinClasses(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Renders the shared primary and secondary button styles used in the form.
 */
export default function Button({
  variant = "filled",
  type = "button",
  className,
  children = "Continue to User Info",
  disabled = false,
  ...props
}: ButtonPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States
  const normalizedVariant: "filled" | "unfilled" = variant.toLowerCase() as "filled" | "unfilled";

  // Helper Functions

  // Use Effects

  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      className={joinClasses(
        "inline-flex min-h-16 items-center justify-center rounded-4xl px-8 py-4 text-center text-lg leading-normal font-semibold transition-[transform,background-color,color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus:ring-2 focus:ring-[var(--color-blue-500)] focus:ring-offset-2 focus:outline-none",
        !disabled && "cursor-pointer hover:scale-[1.02] active:scale-[0.99]",
        normalizedVariant === "filled" &&
          "bg-[var(--color-blue-500)] text-[var(--color-n-50)] hover:bg-[var(--color-blue-400)]",
        normalizedVariant === "unfilled" &&
          "border-2 border-[var(--color-blue-500)] bg-transparent text-[var(--color-blue-500)] hover:bg-[var(--color-blue-50)]",
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      {children}
    </button>
  );
}
