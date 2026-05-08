"use client";

import { PageErrorState } from "@/components/page-state";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PageErrorState
      description="Bilgiler alınamadı. Tekrar deneyebilir veya menüden başka bir sayfaya geçebilirsiniz."
      action={
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-bold text-white"
          onClick={() => reset()}
        >
          Tekrar dene
        </button>
      }
    />
  );
}
