"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectProps = {
  name?: string;
  value?: string | undefined;
  defaultValue?: string | undefined;
  placeholder?: string;
  options: SelectOption[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  onValueChange?: (value: string) => void;
};

export function Select({
  name,
  value,
  defaultValue = "",
  placeholder = "Seçiniz",
  options,
  required,
  disabled,
  className,
  triggerClassName,
  contentClassName,
  onValueChange,
}: SelectProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const ignoreNextTriggerClickRef = useRef(false);
  const controlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const selectedValue = controlled ? value : internalValue;
  const selectedOption = useMemo(
    () => options.find((option) => option.value === selectedValue),
    [options, selectedValue],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        ignoreNextTriggerClickRef.current = true;
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function commit(nextValue: string) {
    if (!controlled) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
    setOpen(false);
  }

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      {name ? (
        <input
          type="hidden"
          name={name}
          value={selectedValue ?? ""}
          required={required}
        />
      ) : null}
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "mt-2 flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border border-border bg-background px-3 text-left text-sm transition hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-60",
          !selectedOption && "text-muted-foreground",
          triggerClassName,
        )}
        onClick={() => {
          if (ignoreNextTriggerClickRef.current) {
            ignoreNextTriggerClickRef.current = false;
            return;
          }

          setOpen((current) => !current);
        }}
      >
        <span className="min-w-0 truncate">
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDown
          size={17}
          className={cn(
            "shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <div
          role="listbox"
          className={cn(
            "absolute left-0 right-0 top-[calc(100%+8px)] z-40 max-h-64 overflow-y-auto rounded-xl border border-border bg-background p-1 shadow-panel",
            contentClassName,
          )}
        >
          {options.map((option) => {
            const selected = option.value === selectedValue;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                disabled={option.disabled}
                className={cn(
                  "flex min-h-10 w-full items-center justify-between gap-3 rounded-lg px-3 text-left text-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50",
                  selected && "bg-primary/10 text-primary",
                )}
                onClick={() => commit(option.value)}
              >
                <span className="min-w-0 truncate">{option.label}</span>
                {selected ? <Check size={16} className="shrink-0" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
