// REACT //
import React, { type ChangeEvent, type InputHTMLAttributes, type ReactNode } from "react";

type RadioPropsData = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "children"> & {
  label: string;
  description?: string;
  content?: ReactNode;
  containerClassName?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

function joinClasses(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function renderCheckIcon(): React.JSX.Element {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
      <path
        d="M4.4 8.3 6.8 10.7 11.6 5.9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function renderSelectionControl({ checked }: { checked: boolean }): React.JSX.Element {
  return (
    <span
      aria-hidden="true"
      className={joinClasses(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border transition-colors duration-200",
        checked ? "border-n-50 bg-blue-500 text-n-50" : "border-n-300 bg-n-50 text-transparent",
      )}
    >
      {renderCheckIcon()}
    </span>
  );
}

/**
 * Renders a single radio card option used by the form groups.
 */
export default function Radio({
  label,
  description = "",
  content,
  checked = false,
  disabled = false,
  className,
  containerClassName,
  onChange,
  ...props
}: RadioPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions
  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    onChange?.(event);
  }

  // Use Effects

  return (
    <label
      className={joinClasses(
        "relative flex w-full items-center gap-6 rounded-[8px] border px-[21px] py-[17px] transition-colors duration-200",
        checked ? "border-blue-100 bg-n-50" : "border-n-300 bg-n-50",
        disabled ? "opacity-60" : "cursor-pointer",
        containerClassName,
      )}
    >
      <input
        {...props}
        type="radio"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        className={joinClasses("peer sr-only", className)}
      />

      {renderSelectionControl({ checked: Boolean(checked) })}

      <span className="text-n-950 min-w-0 flex-1 text-base leading-5">
        {content ?? (
          <>
            <span className="font-semibold">{label}</span>
            <span className="font-medium">{description}</span>
          </>
        )}
      </span>
    </label>
  );
}
