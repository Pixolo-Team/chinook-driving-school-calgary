// REACT //
import React, { type ChangeEvent, type InputHTMLAttributes } from "react";

const DEFAULT_IMAGE_SRC =
  "https://www.figma.com/api/mcp/asset/a8ed0865-c140-4e9b-a2da-332eeb1922a1";

type RadioCustomData = {
  title: string;
  imageSrc?: string;
  imageAlt?: string;
};

type RadioCustomPropsData = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  value: string;
  data: RadioCustomData;
  containerClassName?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

function joinClasses(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function renderCheckIcon(): React.JSX.Element {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="none"
    >
      <circle cx="10" cy="10" r="10" fill="currentColor" />
      <path
        d="M6.2 10.2 8.6 12.6 13.8 7.4"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Renders the custom course-selection radio card.
 */
export default function RadioCustom({
  value,
  data,
  checked = false,
  disabled = false,
  className,
  containerClassName,
  onChange,
  ...props
}: RadioCustomPropsData) {
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
        "relative flex w-full flex-col gap-3 rounded-[12px] border-2 bg-[var(--color-n-50)] p-[14px] shadow-[6px_9px_17.8px_rgba(0,0,0,0.09)] transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        checked
          ? "border-[var(--color-blue-500)]"
          : "border-[var(--color-n-300)]",
        disabled ? "opacity-60" : "cursor-default hover:scale-[1.01]",
        containerClassName,
      )}
    >
      <input
        {...props}
        type="radio"
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        className={joinClasses("peer sr-only", className)}
      />

      <div className="relative h-[155px] w-full overflow-hidden rounded-[8px] bg-[var(--color-n-100)]">
        <img
          src={data.imageSrc ?? DEFAULT_IMAGE_SRC}
          alt={data.imageAlt ?? data.title}
          className="block h-full w-full object-cover"
        />
      </div>

      <div className="flex w-full items-center justify-between px-2 pb-2">
        <span
          className="text-lg font-bold leading-normal"
          style={{ color: "var(--color-blue-500)" }}
        >
          {data.title}
        </span>

        <span
          className={joinClasses(
            "shrink-0 transition-opacity duration-200",
            checked ? "opacity-100 text-[var(--color-blue-500)]" : "opacity-0",
          )}
          aria-hidden="true"
        >
          {renderCheckIcon()}
        </span>
      </div>
    </label>
  );
}
