// REACT //
import React, { useEffect, useState } from "react";

type RadioTabItemData = {
  label: string;
  value: string;
};

type RadioTabPropsData = {
  label: string;
  caption: string;
  required?: boolean;
  isError?: boolean;
  errorMessage?: string;
  items: RadioTabItemData[];
  selected: RadioTabItemData[];
  allowMultiple?: boolean;
  onChange?: (selected: RadioTabItemData[]) => void;
  containerClassName?: string;
};

function joinClasses(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Renders selectable tabs that can work in single or multi-select mode.
 */
export default function RadioTab({
  label,
  caption,
  required = false,
  isError = false,
  errorMessage,
  items,
  selected,
  allowMultiple = true,
  onChange,
  containerClassName,
}: RadioTabPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States
  const [selectedItems, setSelectedItems] = useState<RadioTabItemData[]>(selected);

  // Helper Functions
  useEffect(() => {
    setSelectedItems(selected);
  }, [selected]);

  function isSelected(value: string): boolean {
    return selectedItems.some((itemItem) => itemItem.value === value);
  }

  function handleToggle(item: RadioTabItemData): void {
    let nextSelectedItems: RadioTabItemData[];

    if (allowMultiple) {
      nextSelectedItems = isSelected(item.value)
        ? selectedItems.filter((selectedItem) => selectedItem.value !== item.value)
        : [...selectedItems, item];
    } else {
      nextSelectedItems = isSelected(item.value) ? [] : [item];
    }

    setSelectedItems(nextSelectedItems);
    onChange?.(nextSelectedItems);
  }

  // Use Effects
  const helperText = isError ? (errorMessage ?? caption) : caption;

  return (
    <div className={joinClasses("flex w-full flex-col gap-4", containerClassName)}>
      {label ? (
        <p className="text-base leading-5 font-normal" style={{ color: "var(--color-n-700)" }}>
          {label}
          {required ? (
            <span className="ml-1" style={{ color: "var(--color-error-500, #ef4444)" }}>
              *
            </span>
          ) : null}
        </p>
      ) : null}

      <div className="flex w-full flex-wrap items-start gap-3">
        {items.map((itemItem) => {
          const active: boolean = isSelected(itemItem.value);

          return (
            <button
              key={itemItem.value}
              type="button"
              onClick={() => handleToggle(itemItem)}
              aria-pressed={active}
              className={joinClasses(
                "flex min-h-[52px] flex-1 items-center justify-center rounded-[12px] border px-8 py-[14px] text-base leading-normal font-semibold transition-[transform,background-color,border-color,color] duration-200 ease-out",
                active && "bg-[var(--color-blue-500)] text-[var(--color-n-50)]",
                !active && "border-[1.4px] bg-[var(--color-n-50)] text-[var(--color-n-600)]",
              )}
              style={{
                borderColor: active
                  ? "var(--color-blue-500)"
                  : isError
                    ? "var(--color-error-500, #dc2626)"
                    : "var(--color-n-400)",
                color: active
                  ? "var(--color-n-50)"
                  : isError
                    ? "var(--color-error-500, #dc2626)"
                    : "var(--color-n-600)",
              }}
            >
              {itemItem.label}
            </button>
          );
        })}
      </div>

      {helperText ? (
        <p
          className="text-sm leading-5 font-normal"
          style={{
            color: isError ? "var(--color-error-500, #dc2626)" : "var(--color-n-500)",
          }}
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
