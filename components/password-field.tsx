"use client";

import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";

type PasswordFieldProps = {
  name: string;
  label: string;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  autoComplete?: "current-password" | "new-password";
  className?: string;
  inputClassName?: string;
};

export function PasswordField({
  name,
  label,
  placeholder = "En az 10 karakter",
  minLength = 10,
  maxLength = 72,
  required = true,
  autoComplete = "current-password",
  className,
  inputClassName,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const inputId = useId();

  return (
    <div className={cn("block text-sm font-medium", className)}>
      <label htmlFor={inputId}>{label}</label>
      <div className="relative mt-2">
        <input
          id={inputId}
          name={name}
          type={visible ? "text" : "password"}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          autoComplete={autoComplete}
          className={cn(
            "min-h-11 w-full rounded-xl border border-border bg-background px-3 pr-12 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10",
            inputClassName,
          )}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-2xl text-muted-foreground transition hover:bg-muted hover:text-foreground"
          aria-label={visible ? "Şifreyi gizle" : "Şifreyi göster"}
          onClick={() => setVisible((value) => !value)}
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  );
}
