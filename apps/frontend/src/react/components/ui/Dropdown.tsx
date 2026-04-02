// REACT //
import React, {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type SelectHTMLAttributes,
} from "react";

// COMPONENT TYPES //
type DropdownOptionData = {
  label: string;
  value: string;
};

type DropdownPropsData = Readonly<
  Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
    label?: string;
    required?: boolean;
    helperText?: string;
    placeholder?: string;
    options?: DropdownOptionData[];
    containerClassName?: string;
  }
>;

/**
 * Renders a custom-styled dropdown with a non-native option list.
 */
export default function Dropdown({
  label = "License Type",
  required = false,
  helperText = "Choose your current license category (e.g., learner, full license).",
  placeholder = "Select license type",
  options = [],
  value,
  defaultValue = "",
  disabled = false,
  className,
  containerClassName,
  onChange,
  id,
  name,
  ...props
}: DropdownPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Define States
  const generatedId: string = useId();
  const inputId: string = id ?? name ?? `dropdown-${generatedId}`;
  const isControlled: boolean = value !== undefined;
  const initialValue: string = isControlled ? String(value ?? "") : String(defaultValue ?? "");
  const [selectedValue, setSelectedValue] = useState<string>(initialValue);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const activeValue: string = isControlled ? String(value ?? "") : selectedValue;
  const selectedOptionInfo: DropdownOptionData | undefined = options.find(
    (optionItem) => optionItem.value === activeValue,
  );

  // Helper Functions
  /**
   * Joins optional class names into a single string.
   */
  function joinClasses(...classes: Array<string | false | null | undefined>): string {
    return classes.filter(Boolean).join(" ");
  }

  /**
   * Closes the dropdown list.
   */
  function closeDropdown(): void {
    setIsDropdownOpen(false);
  }

  /**
   * Toggles the dropdown list when the trigger is pressed.
   */
  function toggleDropdown(): void {
    if (disabled) {
      return;
    }

    setIsDropdownOpen((currentDropdownState) => !currentDropdownState);
  }

  /**
   * Emits the current value using the existing select onChange shape.
   */
  function triggerChange(nextValue: string): void {
    const syntheticChangeEvent = {
      target: {
        value: nextValue,
        name,
        id: inputId,
      },
      currentTarget: {
        value: nextValue,
        name,
        id: inputId,
      },
    } as ChangeEvent<HTMLSelectElement>;

    onChange?.(syntheticChangeEvent);
  }

  /**
   * Updates the selected value and closes the custom dropdown list.
   */
  function handleOptionSelect(nextValue: string): void {
    if (!isControlled) {
      setSelectedValue(nextValue);
    }

    triggerChange(nextValue);
    closeDropdown();
  }

  /**
   * Handles keyboard support for opening and closing the dropdown.
   */
  function handleTriggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>): void {
    if (disabled) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleDropdown();
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeDropdown();
    }
  }

  // Use Effects
  useEffect(() => {
    if (!isControlled) {
      setSelectedValue(String(defaultValue ?? ""));
    }
  }, [defaultValue, isControlled]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent): void {
      if (!containerRef.current?.contains(event.target as Node)) {
        closeDropdown();
      }
    }

    if (!isDropdownOpen) {
      return;
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isDropdownOpen]);

  return (
    <div className={joinClasses("flex w-full max-w-164 flex-col gap-2", containerClassName)}>
      <label
        htmlFor={inputId}
        className="flex items-center gap-1 text-base leading-5 font-normal"
        style={{ color: "var(--color-n-700)" }}
      >
        <span>{label}</span>
        {required ? (
          <span aria-hidden="true" style={{ color: "var(--color-error-500, #ef4444)" }}>
            *
          </span>
        ) : null}
      </label>

      <div ref={containerRef} className="relative w-full">
        <select
          {...props}
          id={inputId}
          name={name}
          value={activeValue}
          disabled={disabled}
          onChange={() => undefined}
          required={required}
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none absolute h-0 w-0 opacity-0"
        >
          <option value="">{placeholder}</option>
          {options.map((optionItem) => (
            <option key={optionItem.value} value={optionItem.value}>
              {optionItem.label}
            </option>
          ))}
        </select>

        <button
          id={inputId}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isDropdownOpen}
          aria-controls={`${inputId}-listbox`}
          onClick={toggleDropdown}
          onKeyDown={handleTriggerKeyDown}
          className={joinClasses(
            "flex min-h-[76px] w-full items-center justify-between rounded-[18px] border px-4 py-4 text-left transition-[border-color,background-color,box-shadow,transform] duration-200 outline-none",
            "focus-visible:border-[var(--color-blue-500)] focus-visible:ring-2 focus-visible:ring-[var(--color-blue-100)]",
            disabled && "cursor-not-allowed opacity-60",
            className,
          )}
          style={{
            backgroundColor: isDropdownOpen ? "var(--color-n-50)" : "var(--color-n-100)",
            borderColor: isDropdownOpen ? "var(--color-blue-500)" : "var(--color-n-300)",
            boxShadow: isDropdownOpen ? "0 18px 44px rgba(14, 23, 43, 0.08)" : "none",
          }}
        >
          <span className="flex min-w-0 flex-col gap-1">
            <span
              className="text-sm leading-5 font-medium"
              style={{ color: "var(--color-n-500)" }}
            >
              {label}
            </span>
            <span
              className="truncate text-lg leading-normal font-semibold"
              style={{
                color: selectedOptionInfo ? "var(--color-n-900)" : "var(--color-n-400)",
              }}
            >
              {selectedOptionInfo?.label ?? placeholder}
            </span>
          </span>

          <span
            aria-hidden="true"
            className={joinClasses(
              "ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform duration-200",
              isDropdownOpen && "rotate-180",
            )}
            style={{ backgroundColor: "var(--color-blue-50)" }}
          >
            <svg
              viewBox="0 0 20 20"
              className="h-4 w-4"
              fill="none"
              style={{ color: "var(--color-blue-500)" }}
            >
              <path
                d="M5 7.5 10 12.5 15 7.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>

        {isDropdownOpen ? (
          <div
            id={`${inputId}-listbox`}
            role="listbox"
            className="absolute top-[calc(100%+12px)] z-30 max-h-72 w-full overflow-y-auto rounded-[22px] border p-2 shadow-[0_24px_64px_rgba(14,23,43,0.14)]"
            style={{
              backgroundColor: "var(--color-n-50)",
              borderColor: "var(--color-n-200)",
            }}
          >
            {options.map((optionItem) => {
              const isActive: boolean = optionItem.value === activeValue;

              return (
                <button
                  key={optionItem.value}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => handleOptionSelect(optionItem.value)}
                  className="flex w-full items-center justify-between rounded-[16px] px-4 py-3 text-left transition-colors duration-200"
                  style={{
                    backgroundColor: isActive ? "var(--color-blue-500)" : "transparent",
                    color: isActive ? "var(--color-n-50)" : "var(--color-n-800)",
                  }}
                >
                  <span className="text-base leading-normal font-medium">{optionItem.label}</span>

                  {isActive ? (
                    <span
                      className="flex h-6 w-6 items-center justify-center rounded-full"
                      style={{ backgroundColor: "rgba(255,255,255,0.16)" }}
                    >
                      <svg
                        viewBox="0 0 20 20"
                        className="h-3.5 w-3.5"
                        fill="none"
                        style={{ color: "var(--color-n-50)" }}
                      >
                        <path
                          d="M5.6 10.2 8.3 12.9 14.4 6.8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <p className="text-sm leading-5 font-normal" style={{ color: "var(--color-n-500)" }}>
        {helperText}
      </p>
    </div>
  );
}
