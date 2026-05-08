"use client";

import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

type ConfirmSubmitButtonProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  showArrow?: boolean;
};

export function ConfirmSubmitButton({
  children,
  title = "İşlemi tamamlayalım mı?",
  description = "Değişiklikleri kontrol ettikten sonra kaydedebilirsiniz.",
  className,
  showArrow = true,
}: ConfirmSubmitButtonProps) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  return (
    <>
      <button
        type="button"
        className={
          className ??
          "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90"
        }
        onClick={(event) => {
          const form = event.currentTarget.closest("form");

          if (!form || !form.reportValidity()) {
            return;
          }

          formRef.current = form;
          setOpen(true);
        }}
      >
        {children}
        {showArrow ? <ArrowRight size={16} /> : null}
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[24px] border border-border bg-surface p-5 shadow-2xl">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                className="min-h-10 rounded-xl border border-border bg-background px-4 text-sm font-semibold"
                onClick={() => setOpen(false)}
              >
                Vazgeç
              </button>
              <button
                type="button"
                className="min-h-10 rounded-xl bg-primary px-4 text-sm font-bold text-white"
                onClick={() => {
                  const form = formRef.current;

                  if (!form || !form.reportValidity()) {
                    setOpen(false);
                    return;
                  }

                  setOpen(false);
                  form.requestSubmit();
                }}
              >
                Onayla
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
