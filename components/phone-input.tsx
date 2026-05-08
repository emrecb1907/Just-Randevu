"use client";

type PhoneInputProps = {
  name?: string;
  label?: string;
  defaultValue?: string;
  required?: boolean;
};

function normalizeVisiblePhone(value: string) {
  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("90")) {
    digits = digits.slice(2);
  }

  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  return digits.slice(0, 10);
}

export function PhoneInput({
  name = "phone",
  label = "Telefon",
  defaultValue,
  required = true,
}: PhoneInputProps) {
  return (
    <label className="text-sm font-medium">
      {label}
      <div className="mt-2 flex min-h-11 overflow-hidden rounded-xl border border-border bg-background">
        <span className="grid place-items-center border-r border-border bg-muted px-3 text-sm font-semibold text-muted-foreground">
          +90
        </span>
        <input
          name={name}
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          required={required}
          defaultValue={defaultValue?.replace(/^\+90/, "")}
          placeholder="5xx xxx xx xx"
          minLength={10}
          maxLength={10}
          size={10}
          pattern="[1-9][0-9]{9}"
          title="Telefon numarası 10 haneli olmalı. Örnek: 5321234567"
          onInput={(event) => {
            const input = event.currentTarget;
            input.value = normalizeVisiblePhone(input.value);
          }}
          className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground/70"
        />
      </div>
    </label>
  );
}
