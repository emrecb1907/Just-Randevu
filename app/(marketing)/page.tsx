import Link from "next/link";
import { ArrowRight, Mail, Plus, Sparkles } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { plans } from "@/lib/product-model";
import type { PlanKey } from "@/lib/product-model";
import { formatCurrency } from "@/lib/utils";

const planFeatureLists = {
  standard: [
    "Randevu Yönetimi",
    "Müşteri Takibi",
    "Personel Yönetimi",
    "İşlem ve Hizmetler",
    "WhatsApp Hatırlatma",
    "Admin Doluluk Görünümü",
    "Profil ve Mesai Yönetimi",
  ],
  premium: [
    "Standart paketteki her şey",
    "Stok Yönetimi",
    "Ürün Satışı",
    "Adisyon Yönetimi",
    "Gelir-Gider",
    "Prim ve Hak Ediş",
    "Çoklu Şube Yönetimi",
  ],
} satisfies Record<PlanKey, string[]>;

const pricing = [
  {
    key: "standard",
    title: "Standart",
    description:
      "Tek şubeli berber, kuaför ve küçük klinikler için sade randevu akışı.",
    action: "Standart ile başla",
    featured: false,
    footnote: "1 şube · 8 personel",
  },
  {
    key: "premium",
    title: "Premium",
    description:
      "Çok şubeli ekipler için stok, finans, adisyon ve performans yönetimi.",
    action: "Premium'a geç",
    featured: true,
    footnote: "3 şube · şube başı 20 personel",
  },
] satisfies Array<{
  key: PlanKey;
  title: string;
  description: string;
  action: string;
  featured: boolean;
  footnote: string;
}>;

const faqs = [
  "Standart paket kimler için uygun?",
  "Premium pakette şube ve personel limiti nasıl çalışır?",
  "Modülleri işletme bazında açıp kapatabilir miyim?",
  "WhatsApp hatırlatma gönderimleri nasıl yapılır?",
  "Finans ve stok modülleri kapalıyken randevu akışı etkilenir mi?",
  "Paket değişince eski veriler silinir mi?",
];

const footerColumns = [
  {
    title: "Ürün",
    links: ["Randevu", "Müşteri", "Personel", "Stok", "Finans"],
  },
  {
    title: "Paketler",
    links: ["Standart", "Premium", "Kullanım limitleri", "Modüller"],
  },
  {
    title: "Kaynaklar",
    links: ["Destek", "Dokümantasyon", "KVKK", "Güvenlik"],
  },
  {
    title: "Yasal",
    links: ["Gizlilik", "Kullanım şartları", "Abonelik", "Çerezler"],
  },
];

export default function HomePage() {
  return (
    <main className="min-h-dvh overflow-hidden bg-white text-[#111111] dark:bg-[#07100B] dark:text-white">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-6 lg:px-0">
        <div className="flex items-center gap-12">
          <Link
            href="/"
            className="flex items-center gap-3 text-sm font-semibold"
          >
            <span className="grid size-8 place-items-center rounded-md bg-[#111111] text-xs font-bold text-white dark:bg-white dark:text-[#07100B]">
              JR
            </span>
            Just Randevu
          </Link>
          <nav className="hidden items-center gap-7 text-xs font-medium text-neutral-600 dark:text-neutral-300 md:flex">
            <Link href="#paketler" className="transition hover:text-primary">
              Paketler
            </Link>
            <Link href="#sss" className="transition hover:text-primary">
              SSS
            </Link>
            <Link href="/app" className="transition hover:text-primary">
              Demo
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/app"
            className="hidden min-h-10 items-center justify-center rounded-md border border-neutral-200 bg-white px-4 text-xs font-semibold shadow-sm transition hover:border-primary dark:border-white/10 dark:bg-white/10 sm:inline-flex"
          >
            Demo gir
          </Link>
          <Link
            href="/login"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[#111111] px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-black/80 dark:bg-white dark:text-[#07100B]"
          >
            Giriş
            <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      <section
        id="paketler"
        className="relative isolate px-5 pb-16 pt-8 sm:px-6 lg:px-8"
      >
        <div
          className="pointer-events-none absolute left-1/2 top-[205px] z-0 h-[330px] w-[1180px] -translate-x-1/2 rounded-[100%] opacity-100 blur-2xl dark:opacity-75"
          style={{
            background:
              "radial-gradient(circle at 18% 50%, rgba(0,139,71,0.76), transparent 34%), radial-gradient(circle at 50% 42%, rgba(248,205,36,1), transparent 36%), radial-gradient(circle at 82% 50%, rgba(0,139,71,0.76), transparent 34%)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute left-1/2 top-[285px] z-0 h-[180px] w-[1220px] -translate-x-1/2 opacity-70 blur-3xl dark:opacity-50"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(0,139,71,0.55) 18%, rgba(248,205,36,0.9) 50%, rgba(0,139,71,0.55) 82%, transparent 100%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h1 className="font-display text-5xl font-black leading-[1.02] tracking-normal sm:text-6xl">
            Esnek paketler
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-neutral-600 dark:text-neutral-300 sm:text-base">
            Randevu odaklı küçük işletmelerden çok şubeli salon ve kliniklere
            kadar, sadece kullanacağınız modülleri açın.
          </p>
          <div className="mx-auto mt-5 inline-flex rounded-md border border-neutral-200 bg-white p-1 shadow-sm dark:border-white/10 dark:bg-white/10">
            <button className="min-h-9 rounded-md bg-[#111111] px-5 text-xs font-semibold text-white dark:bg-white dark:text-[#07100B]">
              Aylık
            </button>
            <button className="min-h-9 rounded-md px-5 text-xs font-semibold text-neutral-500">
              Yıllık
            </button>
          </div>
        </div>

        <div className="relative z-10 mx-auto mt-14 grid max-w-5xl items-stretch gap-6 lg:grid-cols-2">
          {pricing.map((packageItem) => {
            const plan = plans[packageItem.key];
            const featureList = planFeatureLists[packageItem.key];

            return (
              <div key={packageItem.key} className="relative flex">
                {packageItem.featured ? (
                  <>
                    <div
                      className="pointer-events-none absolute -inset-x-3 -inset-y-4 rounded-xl opacity-90 blur-sm"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(248,205,36,0.72), rgba(0,139,71,0.58) 48%, rgba(0,139,71,0.78))",
                      }}
                      aria-hidden="true"
                    />
                    <div
                      className="pointer-events-none absolute -bottom-8 left-1/2 h-28 w-4/5 -translate-x-1/2 rounded-[100%] bg-primary/35 blur-3xl"
                      aria-hidden="true"
                    />
                    <div
                      className="pointer-events-none absolute -top-8 left-1/2 h-14 w-44 -translate-x-1/2 rounded-full bg-accent/70 blur-2xl"
                      aria-hidden="true"
                    />
                    <div className="absolute -top-7 left-1/2 z-20 min-w-[172px] -translate-x-1/2 rounded-md border border-accent/80 bg-accent px-5 py-3 text-center text-[11px] font-black text-accent-foreground shadow-[0_14px_35px_rgba(248,205,36,0.35)]">
                      EN ÇOK SEÇİLEN
                    </div>
                  </>
                ) : null}
                <article
                  className={
                    packageItem.featured
                      ? "relative flex min-h-[500px] w-full flex-col rounded-lg border-2 border-primary bg-white p-5 shadow-[0_34px_80px_rgba(0,139,71,0.32),0_0_0_1px_rgba(255,255,255,0.82)_inset] dark:bg-[#0B1710]"
                      : "relative flex min-h-[500px] w-full flex-col rounded-lg border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0B1710]"
                  }
                >
                  <div className="flex min-h-[145px] flex-col">
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <h2 className="font-display text-xl font-bold">
                          {packageItem.title}
                        </h2>
                        <p className="mt-3 max-w-xs text-xs leading-5 text-neutral-600 dark:text-neutral-300 sm:text-sm sm:leading-6">
                          {packageItem.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-3xl font-black sm:text-4xl">
                          {formatCurrency(plan.monthlyPriceCents)}
                        </p>
                        <p className="mt-1 text-xs text-neutral-500">/ ay</p>
                      </div>
                    </div>

                    <div className="mt-auto pt-6">
                      <Link
                        href="/login"
                        className={
                          packageItem.featured
                            ? "inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
                            : "inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#111111] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-black/80 dark:bg-white dark:text-[#07100B]"
                        }
                      >
                        {packageItem.action}
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>

                  <div className="my-5 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />

                  <p className="mb-4 text-sm font-semibold text-primary">
                    {packageItem.footnote}
                  </p>
                  <div className="grid flex-1 content-start gap-2.5">
                    {featureList.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-start gap-3 text-xs sm:text-sm"
                      >
                        <span className="mt-1 size-2.5 rounded-sm bg-gradient-to-br from-primary to-accent" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto pt-5">
                    {packageItem.featured ? (
                      <p className="text-center text-xs text-neutral-500">
                        Modül aç/kapat · Veri silinmez · Paket limiti korunur
                      </p>
                    ) : (
                      <p className="text-center text-xs text-neutral-400">
                        Sade randevu akışı · Hızlı başlangıç · Temiz takvim
                      </p>
                    )}
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </section>

      <section
        id="sss"
        className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-6"
      >
        <h2 className="font-display text-4xl font-black tracking-normal sm:text-5xl">
          Sık sorulan sorular
        </h2>
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-300">
          Paket, modül ve kullanım limitlerini netleştirin.
        </p>
        <div className="mt-10 space-y-3 text-left">
          {faqs.map((faq) => (
            <button
              key={faq}
              className="flex min-h-14 w-full items-center justify-between gap-4 rounded-md border border-neutral-200 bg-white px-4 text-left text-sm font-semibold shadow-sm transition hover:border-primary dark:border-white/10 dark:bg-white/10"
              type="button"
            >
              {faq}
              <span className="grid size-8 shrink-0 place-items-center rounded-md border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/10">
                <Plus size={16} />
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="relative isolate px-5 py-24 text-center sm:px-6">
        <div
          className="absolute inset-x-0 bottom-0 -z-10 h-[340px] opacity-90 blur-3xl dark:opacity-65"
          style={{
            background:
              "radial-gradient(circle at 18% 75%, rgba(0,139,71,0.58), transparent 34%), radial-gradient(circle at 50% 80%, rgba(248,205,36,0.92), transparent 34%), radial-gradient(circle at 82% 75%, rgba(0,139,71,0.58), transparent 34%)",
          }}
          aria-hidden="true"
        />
        <div className="mx-auto grid size-11 place-items-center rounded-md bg-[#111111] text-white shadow-lg dark:bg-white dark:text-[#07100B]">
          <Sparkles size={20} />
        </div>
        <h2 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-black leading-tight tracking-normal sm:text-6xl">
          İşletmenizin randevu düzenini bugünden kurun.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          Personel takvimi, müşteri kayıtları, paket limitleri ve premium
          modüller tek sistemde.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#111111] px-5 text-sm font-semibold text-white shadow-lg transition hover:bg-black/80 dark:bg-white dark:text-[#07100B]"
          >
            Hemen başla
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/app"
            className="inline-flex min-h-12 items-center justify-center rounded-md border border-neutral-200 bg-white px-5 text-sm font-semibold shadow-sm transition hover:border-primary dark:border-white/10 dark:bg-white/10"
          >
            Demoyu gör
          </Link>
        </div>
      </section>

      <footer className="border-t border-neutral-200 bg-white px-5 py-12 dark:border-white/10 dark:bg-[#07100B] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 border-b border-neutral-200 pb-8 dark:border-white/10 md:flex-row md:items-center md:justify-between">
            <p className="text-lg font-semibold">
              Just Randevu gelişmelerini alın
            </p>
            <label className="flex min-h-12 w-full max-w-sm items-center gap-3 rounded-md border border-neutral-200 bg-white px-4 dark:border-white/10 dark:bg-white/10">
              <Mail size={16} className="text-neutral-500" />
              <input
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                placeholder="E-posta"
                aria-label="E-posta"
              />
              <ArrowRight size={16} />
            </label>
          </div>

          <div className="grid gap-10 py-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
            <div>
              <div className="flex items-center gap-3 text-xl font-semibold">
                <span className="grid size-9 place-items-center rounded-md bg-[#111111] text-xs font-bold text-white dark:bg-white dark:text-[#07100B]">
                  JR
                </span>
                Just Randevu
              </div>
              <p className="mt-5 max-w-xs text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                Randevu, müşteri, personel ve operasyon yönetimini tek panelde
                toplayan çok işletmeli SaaS.
              </p>
              <div className="mt-5 flex items-center gap-2">
                {["X", "in", "ig", "yt"].map((item) => (
                  <span
                    key={item}
                    className="grid size-8 place-items-center rounded-md border border-neutral-200 text-xs font-semibold dark:border-white/10"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-semibold">{column.title}</h3>
                <div className="mt-4 grid gap-3">
                  {column.links.map((link) => (
                    <Link
                      key={link}
                      href={
                        link === "Kullanım şartları"
                          ? "/kullanim-kosullari"
                          : link === "Gizlilik"
                            ? "/gizlilik-kvkk"
                            : "/"
                      }
                      className="text-sm text-neutral-500 transition hover:text-primary"
                    >
                      {link}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 text-xs text-neutral-500 md:flex-row md:items-center md:justify-between">
            <p>© 2026 Just Randevu. Tüm hakları saklıdır.</p>
            <div className="flex gap-2">
              <button className="min-h-9 rounded-md border border-neutral-200 px-3 dark:border-white/10">
                Reddet
              </button>
              <button className="min-h-9 rounded-md bg-[#111111] px-3 text-white dark:bg-white dark:text-[#07100B]">
                Kabul et
              </button>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
