// REACT //
import React, { useEffect, useState, type ReactNode } from "react";

// COMPONENTS //
import Radio from "@/react/components/ui/Radio";

type RadioGroupItemData = {
  value: string;
  label: string;
  description?: string;
  content?: ReactNode;
  disabled?: boolean;
};

type RadioGroupPropsData = {
  label?: string;
  required?: boolean;
  items: RadioGroupItemData[];
  selectedItem: string;
  onChange?: (value: string) => void;
  name?: string;
  containerClassName?: string;
  itemContainerClassName?: string;
};

function joinClasses(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Renders a single-select radio group with a shared label.
 */
export default function RadioGroup({
  label,
  required = false,
  items,
  selectedItem,
  onChange,
  name = "radio-group",
  containerClassName,
  itemContainerClassName,
}: RadioGroupPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States
  const [activeValue, setActiveValue] = useState<string>(selectedItem);

  // Helper Functions
  useEffect(() => {
    setActiveValue(selectedItem);
  }, [selectedItem]);

  function handleSelect(value: string): void {
    setActiveValue(value);
    onChange?.(value);
  }

  // Use Effects

  return (
    <div className="flex w-full flex-col gap-5">
      {label ? (
        <p className="text-n-900 flex items-center gap-1 text-lg leading-normal font-semibold">
          <span>{label}</span>
          {required ? <span aria-hidden="true" className="text-error-500">*</span> : null}
        </p>
      ) : null}

      <div
        role="radiogroup"
        className={joinClasses("flex w-full flex-row gap-4", containerClassName)}
      >
        {items.map((itemItem) => (
          <Radio
            key={itemItem.value}
            name={name}
            value={itemItem.value}
            label={itemItem.label}
            description={itemItem.description}
            content={itemItem.content}
            disabled={itemItem.disabled}
            checked={activeValue === itemItem.value}
            onChange={() => handleSelect(itemItem.value)}
            containerClassName={joinClasses("flex-1", itemContainerClassName)}
          />
        ))}
      </div>
    </div>
  );
}
