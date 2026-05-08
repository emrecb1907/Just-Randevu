"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight } from "lucide-react";

type ConfirmSubmitButtonProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  showArrow?: boolean;
  disabled?: boolean;
};

export function ConfirmSubmitButton({
  children,
  title = "İşlemi tamamlayalım mı?",
  description = "Değişiklikleri kontrol ettikten sonra kaydedebilirsiniz.",
  className,
  showArrow = true,
  disabled = false,
}: ConfirmSubmitButtonProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const modal =
    open && mounted
      ? createPortal(
          <div className="fixed inset-0 z-[100] grid place-items-center bg-black/40 p-4 backdrop-blur-sm">
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
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        className={
          className ??
          "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
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
      {modal}
    </>
  );
}
