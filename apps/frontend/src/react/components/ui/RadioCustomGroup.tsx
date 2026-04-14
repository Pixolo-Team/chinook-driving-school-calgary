// REACT //
import React, { useEffect, useState } from "react";

// COMPONENTS //
import RadioCustom from "./RadioCustom";

type RadioCustomGroupItemData = {
  value: string;
  title: string;
  imageSrc?: string;
  imageAlt?: string;
  disabled?: boolean;
};

type RadioCustomGroupPropsData = {
  label?: string;
  required?: boolean;
  items: RadioCustomGroupItemData[];
  selectedValues?: string[];
  activeValue?: string;
  onChangeSelection?: (value: string) => void;
  name?: string;
  containerClassName?: string;
  itemContainerClassName?: string;
};

function joinClasses(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Renders a custom-image course-category card group.
 */
export default function RadioCustomGroup({
  label,
  required = false,
  items,
  selectedValues = [],
  activeValue,
  onChangeSelection,
  name = "radio-custom-group",
  containerClassName,
  itemContainerClassName,
}: RadioCustomGroupPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States
  const [focusedValue, setFocusedValue] = useState<string>(activeValue ?? selectedValues[0] ?? "");

  // Helper Functions
  useEffect(() => {
    setFocusedValue(activeValue ?? selectedValues[0] ?? "");
  }, [activeValue, selectedValues]);

  function handleSelect(value: string): void {
    setFocusedValue(value);
    onChangeSelection?.(value);
  }

  // Use Effects

  return (
    <div className="flex w-full flex-col gap-3">
      {label ? (
        <p
          className="flex items-center gap-1 text-lg leading-normal font-semibold"
          style={{ color: "var(--color-n-900)" }}
        >
          <span>{label}</span>
          {required ? (
            <span aria-hidden="true" style={{ color: "var(--color-error-500, #ef4444)" }}>
              *
            </span>
          ) : null}
        </p>
      ) : null}

      <div role="group" className={joinClasses("flex w-full flex-row gap-4", containerClassName)}>
        {items.map((itemItem) => (
          <RadioCustom
            key={itemItem.value}
            name={name}
            value={itemItem.value}
            checked={selectedValues.includes(itemItem.value)}
            highlighted={focusedValue === itemItem.value}
            disabled={itemItem.disabled}
            data={{
              title: itemItem.title,
              imageSrc: itemItem.imageSrc,
              imageAlt: itemItem.imageAlt,
            }}
            onChange={() => handleSelect(itemItem.value)}
            containerClassName={joinClasses("flex-1", itemContainerClassName)}
          />
        ))}
      </div>
    </div>
  );
}
