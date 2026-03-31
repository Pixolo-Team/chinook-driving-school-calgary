import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "filled" | "unfilled" | "Filled" | "Unfilled";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Button({
  variant = "filled",
  type = "button",
  className,
  children = "Continue to User Info",
  disabled = false,
  ...props
}: ButtonProps) {
  const normalizedVariant = variant.toLowerCase() as "filled" | "unfilled";

  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      className={joinClasses(
        "inline-flex min-h-16 items-center justify-center rounded-4xl px-8 py-4 text-center text-lg leading-normal font-semibold transition-colors duration-200 focus:ring-2 focus:ring-[var(--color-blue-500)] focus:ring-offset-2 focus:outline-none",
        normalizedVariant === "filled" &&
          "bg-blue-500)] text-n-50)] hover:bg-blue-600)]",
        normalizedVariant === "unfilled" &&
          "border-2 border-blue-500)] bg-transparent text-blue-500)] hover:bg-blue-50)]",
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      {children}
    </button>
  );
}
