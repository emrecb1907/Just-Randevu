"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, X, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";

function ToastContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const success = searchParams.get("success");
  const message = success || error;
  const tone = success ? "success" : "error";
  const [visible, setVisible] = useState(Boolean(message));
  const key = useMemo(() => `${tone}:${message ?? ""}`, [message, tone]);

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 4500);
    return () => window.clearTimeout(timer);
  }, [key, message]);

  if (!message || !visible) {
    return null;
  }

  const Icon = tone === "success" ? CheckCircle2 : XCircle;

  return (
    <div className="fixed right-4 top-4 z-[80] w-[calc(100vw-2rem)] max-w-sm sm:right-5 sm:top-5">
      <div
        className={cn(
          "flex items-start gap-3 rounded-xl border bg-surface p-4 text-sm shadow-2xl",
          tone === "success"
            ? "border-emerald-200 text-emerald-900"
            : "border-red-200 text-red-900",
        )}
        role="status"
        aria-live="polite"
      >
        <Icon
          size={19}
          className={cn(
            "mt-0.5 shrink-0",
            tone === "success" ? "text-emerald-600" : "text-red-600",
          )}
        />
        <p className="min-w-0 flex-1 leading-5">{message}</p>
        <button
          type="button"
          className="grid min-h-8 min-w-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
          aria-label="Bildirimi kapat"
          onClick={() => setVisible(false)}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export function ToastViewport() {
  return (
    <Suspense fallback={null}>
      <ToastContent />
    </Suspense>
  );
}
