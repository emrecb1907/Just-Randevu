"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const COOKIE_CONSENT_KEY = "jr_cookie_consent_v2";

type CookieConsent = {
  operational: true;
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
  decision: "accepted" | "rejected" | "custom";
  updatedAt: string;
};

type OptionalCookieKey = "analytics" | "functional" | "marketing";

const optionalCookies: Array<{
  key: OptionalCookieKey;
  title: string;
  description: string;
}> = [
  {
    key: "analytics",
    title: "Analitik",
    description: "Sayfaların nasıl kullanıldığını anlamamıza yardımcı olur.",
  },
  {
    key: "functional",
    title: "Fonksiyonel",
    description: "Tercih ve arayüz seçimlerinin hatırlanmasını sağlar.",
  },
  {
    key: "marketing",
    title: "Pazarlama",
    description: "Kampanya ve reklam ölçüm izinlerini yönetir.",
  },
];

const defaultPreferences: Record<OptionalCookieKey, boolean> = {
  analytics: false,
  functional: false,
  marketing: false,
};

function saveConsent(
  decision: CookieConsent["decision"],
  preferences: Record<OptionalCookieKey, boolean>,
) {
  const consent: CookieConsent = {
    operational: true,
    analytics: preferences.analytics,
    functional: preferences.functional,
    marketing: preferences.marketing,
    decision,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
  document.cookie = `jr_cookie_consent=${decision}; Max-Age=31536000; Path=/; SameSite=Lax`;
}

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] =
    useState<Record<OptionalCookieKey, boolean>>(defaultPreferences);

  useEffect(() => {
    setVisible(!window.localStorage.getItem(COOKIE_CONSENT_KEY));
  }, []);

  if (!visible) {
    return null;
  }

  const closeWithConsent = (
    decision: CookieConsent["decision"],
    nextPreferences: Record<OptionalCookieKey, boolean>,
  ) => {
    saveConsent(decision, nextPreferences);
    setVisible(false);
  };

  const updatePreference = (key: OptionalCookieKey) => {
    setPreferences((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  return (
    <section
      aria-label="Çerez tercihleri"
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 text-[#111111] dark:text-white sm:bottom-5 sm:left-auto sm:right-5 sm:w-[440px] sm:px-0 sm:pb-0"
    >
      <div className="max-h-[calc(100dvh-24px)] overflow-y-auto rounded-lg border border-neutral-200 bg-white p-4 shadow-[0_18px_55px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-[#07100B]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black">Çerez tercihleri</p>
            <p className="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              Zorunlu çerezler platformun çalışması için açıktır. Diğer
              izinleri şimdi seçebilirsiniz.
            </p>
          </div>
        </div>

        {showSettings ? (
          <div className="mt-4 grid gap-3">
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Zorunlu</p>
                  <p className="mt-1 text-xs leading-5 text-neutral-500">
                    Oturum güvenliği ve temel platform işlevleri.
                  </p>
                </div>
                <span className="rounded-md bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  Her zaman açık
                </span>
              </div>
            </div>

            {optionalCookies.map((cookie) => (
              <div
                key={cookie.key}
                className="rounded-lg border border-neutral-200 bg-white p-3 dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{cookie.title}</p>
                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                      {cookie.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-pressed={preferences[cookie.key]}
                    onClick={() => updatePreference(cookie.key)}
                    className={
                      preferences[cookie.key]
                        ? "relative h-7 w-12 rounded-full bg-primary transition"
                        : "relative h-7 w-12 rounded-full bg-neutral-300 transition dark:bg-white/20"
                    }
                  >
                    <span
                      className={
                        preferences[cookie.key]
                          ? "absolute right-1 top-1 size-5 rounded-full bg-white transition"
                          : "absolute left-1 top-1 size-5 rounded-full bg-white transition"
                      }
                    />
                    <span className="sr-only">
                      {cookie.title} çerezlerini değiştir
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-xs leading-5 text-neutral-500">
            Ayrıntılar için{" "}
            <Link
              href="/cerezler"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Çerezler Politikası
            </Link>
            .
          </p>
        )}

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setShowSettings((current) => !current)}
            className="min-h-11 rounded-md border border-neutral-200 bg-white px-4 text-sm font-semibold shadow-sm transition hover:border-primary dark:border-white/10 dark:bg-white/10"
          >
            {showSettings ? "Özete dön" : "Ayarları yönet"}
          </button>
          <button
            type="button"
            onClick={() =>
              closeWithConsent("accepted", {
                analytics: true,
                functional: true,
                marketing: true,
              })
            }
            className="min-h-11 rounded-md bg-[#111111] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-black/80 dark:bg-white dark:text-[#07100B]"
          >
            Tümünü kabul et
          </button>
          {showSettings ? (
            <>
              <button
                type="button"
                onClick={() => closeWithConsent("rejected", defaultPreferences)}
                className="min-h-11 rounded-md border border-neutral-200 bg-white px-4 text-sm font-semibold shadow-sm transition hover:border-primary dark:border-white/10 dark:bg-white/10"
              >
                Sadece zorunlu
              </button>
              <button
                type="button"
                onClick={() => closeWithConsent("custom", preferences)}
                className="min-h-11 rounded-md bg-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
              >
                Seçimleri kaydet
              </button>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
