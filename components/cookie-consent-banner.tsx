"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const COOKIE_CONSENT_KEY = "jr_cookie_consent_v1";

type CookieConsent = {
  operational: true;
  functional: boolean;
  marketing: boolean;
  decision: "accepted" | "rejected";
  updatedAt: string;
};

function saveConsent(decision: CookieConsent["decision"]) {
  const consent: CookieConsent = {
    operational: true,
    functional: decision === "accepted",
    marketing: decision === "accepted",
    decision,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
  document.cookie = `jr_cookie_consent=${decision}; Max-Age=31536000; Path=/; SameSite=Lax`;
}

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!window.localStorage.getItem(COOKIE_CONSENT_KEY));
  }, []);

  if (!visible) {
    return null;
  }

  const handleDecision = (decision: CookieConsent["decision"]) => {
    saveConsent(decision);
    setVisible(false);
  };

  return (
    <section
      aria-label="Çerez tercihleri"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white/95 px-5 py-4 text-[#111111] shadow-[0_-18px_55px_rgba(15,23,42,0.12)] backdrop-blur dark:border-white/10 dark:bg-[#07100B]/95 dark:text-white sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-black">Çerez tercihleri</p>
          <p className="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            Just Randevu, oturum güvenliği ve temel platform işlevleri için
            zorunlu operasyonel çerezleri kullanır. Analitik, fonksiyonel ve
            pazarlama çerezleri yalnızca izninize göre çalışır. Ayrıntılar için{" "}
            <Link
              href="/cerezler"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Çerezler Politikası
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => handleDecision("rejected")}
            className="min-h-11 rounded-xl border border-neutral-200 bg-white px-4 text-sm font-semibold shadow-sm transition hover:border-primary dark:border-white/10 dark:bg-white/10"
          >
            Reddet
          </button>
          <button
            type="button"
            onClick={() => handleDecision("accepted")}
            className="min-h-11 rounded-xl bg-[#111111] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-black/80 dark:bg-white dark:text-[#07100B]"
          >
            Hepsini kabul et
          </button>
        </div>
      </div>
    </section>
  );
}
