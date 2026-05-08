type PhoneInputProps = {
  name?: string;
  label?: string;
  defaultValue?: string;
  required?: boolean;
};

export function PhoneInput({
  name = "phone",
  label = "Telefon",
  defaultValue,
  required = true,
}: PhoneInputProps) {
  return (
    <label className="text-sm font-medium">
      {label}
      <div className="mt-2 flex min-h-11 overflow-hidden rounded-md border border-border bg-background">
        <span className="grid place-items-center border-r border-border bg-muted px-3 text-sm font-semibold text-muted-foreground">
          +90
        </span>
        <input
          name={name}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required={required}
          defaultValue={defaultValue?.replace(/^\+90/, "")}
          placeholder="5xx xxx xx xx"
          className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground/70"
        />
      </div>
    </label>
  );
}
