// REACT //
import React, { useEffect, useState } from "react";

// COMPONENTS //
import CheckboxTab from "./CheckboxTab";

type CheckboxTabGroupItemData = {
  title: string;
  description: string;
  name: string;
};

type CheckboxTabGroupPropsData = {
  label?: string;
  required?: boolean;
  items: CheckboxTabGroupItemData[];
  selectedItem: string;
  containerClassName?: string;
  itemContainerClassName?: string;
  onSelectionChange?: (selectedItem: string) => void;
};

function joinClasses(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Renders a single-select checkbox-tab group for payment-style options.
 */
export default function CheckboxTabGroup({
  label,
  required = false,
  items,
  selectedItem,
  containerClassName,
  itemContainerClassName,
  onSelectionChange,
}: CheckboxTabGroupPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States
  const [activeItem, setActiveItem] = useState<string>(selectedItem);

  // Helper Functions
  useEffect(() => {
    setActiveItem(selectedItem);
  }, [selectedItem]);

  function handleSelect(name: string): void {
    setActiveItem(name);
    onSelectionChange?.(name);
  }

  // Use Effects

  return (
    <div className={joinClasses("flex w-full flex-col gap-4", containerClassName)}>
      {label ? (
        <p className="flex items-center gap-1 text-lg leading-normal font-semibold" style={{ color: "var(--color-n-900)" }}>
          <span>{label}</span>
          {required ? (
            <span aria-hidden="true" style={{ color: "var(--color-error-500, #ef4444)" }}>
              *
            </span>
          ) : null}
        </p>
      ) : null}
      {items.map((itemItem) => (
        <CheckboxTab
          key={itemItem.name}
          name={itemItem.name}
          title={itemItem.title}
          description={itemItem.description}
          checked={activeItem === itemItem.name}
          onChange={() => handleSelect(itemItem.name)}
          containerClassName={itemContainerClassName}
        />
      ))}
    </div>
  );
}
