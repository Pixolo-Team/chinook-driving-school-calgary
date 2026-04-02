// REACT //
import React, { type ChangeEvent, type InputHTMLAttributes } from "react";

const DEFAULT_ICON_SRC = "https://www.figma.com/api/mcp/asset/6108eefa-d366-4360-90ed-d66aca871df7";

type CheckboxTabPropsData = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "children"> & {
  title: string;
  description: string;
  iconSrc?: string;
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

/**
 * Renders a selectable payment-style tab with checkbox semantics.
 */
export default function CheckboxTab({
  title,
  description,
  iconSrc = DEFAULT_ICON_SRC,
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

      <div className="h-7 w-7 shrink-0">
        <img src={iconSrc} alt="" className="block h-full w-full" />
      </div>

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
