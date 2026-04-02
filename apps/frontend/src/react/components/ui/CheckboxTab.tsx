// REACT //
import React, { type ChangeEvent, type InputHTMLAttributes } from "react";

export type CheckboxTabIconNameData = "card" | "online" | "bank_transfer" | "in_person";

type CheckboxTabPropsData = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "children"> & {
  title: string;
  description: string;
  iconName?: CheckboxTabIconNameData;
  containerClassName?: string;
};

function joinClasses(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function renderCheckIndicator({ checked }: { checked: boolean }): React.JSX.Element {
  return (
    <span
      aria-hidden="true"
      className={joinClasses(
        "absolute top-4 right-4 flex h-5 w-5 items-center justify-center rounded-full border border-[1px] transition-colors duration-200",
        checked ? "border-blue-500 bg-blue-500 text-n-50" : "border-n-300 bg-n-300 text-n-50",
      )}
    >
      <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none">
        <path
          d="M5.5 10.25 8.625 13.375 14.5 7.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function renderPaymentIcon(iconName: CheckboxTabIconNameData): React.JSX.Element {
  if (iconName === "online") {
    return (
      <svg viewBox="0 0 28 28" className="h-7 w-7" fill="none" aria-hidden="true">
        <path
          d="M5 7.5A3.5 3.5 0 0 1 8.5 4h11A3.5 3.5 0 0 1 23 7.5v8A3.5 3.5 0 0 1 19.5 19h-11A3.5 3.5 0 0 1 5 15.5v-8Z"
          stroke="#1D283D"
          strokeWidth="1.8"
        />
        <path d="M2.5 21h23" stroke="#1D283D" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M11.5 24h5" stroke="#1D283D" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (iconName === "bank_transfer") {
    return (
      <svg viewBox="0 0 28 28" className="h-7 w-7" fill="none" aria-hidden="true">
        <path
          d="M14 3 3.5 8.5h21L14 3Z"
          stroke="#00C950"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M6 10.5V20M11 10.5V20M17 10.5V20M22 10.5V20M4 23h20" stroke="#00C950" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (iconName === "in_person") {
    return (
      <svg viewBox="0 0 28 28" className="h-7 w-7" fill="none" aria-hidden="true">
        <rect x="3.5" y="6.5" width="21" height="15" rx="3.5" stroke="#1D283D" strokeWidth="1.8" />
        <path d="M3.5 11h21M8.5 16.5h5M15.5 16.5h4" stroke="#1D283D" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 28 28" className="h-7 w-7" fill="none" aria-hidden="true">
      <rect x="2.5" y="4" width="23" height="20" rx="4" stroke="#1D283D" strokeWidth="1.8" />
      <path d="M2.5 10h23" stroke="#1D283D" strokeWidth="1.8" />
      <path d="M16.5 17h5" stroke="#1D283D" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Renders a selectable payment-style tab with checkbox semantics.
 */
export default function CheckboxTab({
  title,
  description,
  iconName = "card",
  checked,
  disabled = false,
  className,
  containerClassName,
  onChange,
  ...props
}: CheckboxTabPropsData) {
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
        "border-n-400 bg-n-50 relative flex w-full flex-col gap-3 rounded-xl border border-[1px] p-3 text-left transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        disabled
          ? "cursor-not-allowed opacity-60"
          : "cursor-pointer hover:cursor-pointer hover:scale-[1.01] hover:shadow-[0_10px_24px_rgba(14,23,43,0.08)]",
        containerClassName,
      )}
    >
      <input
        {...props}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        className={joinClasses("peer sr-only", className)}
      />

      <div className="h-7 w-7 shrink-0">{renderPaymentIcon(iconName)}</div>

      <div className="flex w-full flex-col gap-0.5 pr-10">
        <span
          className={joinClasses(
            "text-lg leading-normal",
            checked ? "text-n-800 font-semibold" : "text-n-600 font-medium",
          )}
        >
          {title}
        </span>
        <span
          className={joinClasses(
            "text-sm leading-normal",
            checked ? "text-n-500 font-normal" : "text-n-600 font-normal",
          )}
        >
          {description}
        </span>
      </div>

      {renderCheckIndicator({ checked: Boolean(checked) })}

      <span className="peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-n-50 pointer-events-none absolute inset-0 rounded-xl ring-0 ring-transparent transition peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2" />
    </label>
  );
}
