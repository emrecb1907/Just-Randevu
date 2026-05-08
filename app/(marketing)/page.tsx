import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ClipboardCheck,
  CreditCard,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { modules, plans } from "@/lib/product-model";
import type { PlanKey } from "@/lib/product-model";
import { formatCurrency } from "@/lib/utils";

const capabilityGroups = [
  {
    title: "Randevu akışı",
    description:
      "Personel takvimi, hizmet süresi, çakışma kontrolü ve durum takibi aynı ekranda ilerler.",
    icon: CalendarDays,
    items: [
      "Takvim ve vardiya görünümü",
      "Randevu çakışma engeli",
      "Hizmet bazlı süre ve fiyat",
    ],
  },
  {
    title: "Müşteri ve personel",
    description:
      "Müşteri kayıtları, izin bilgileri, personel yetkileri ve şube bağlantıları düzenli tutulur.",
    icon: Users,
    items: [
      "Müşteri kartları",
      "Personel rolleri",
      "KVKK ve iletişim izinleri",
    ],
  },
  {
    title: "Hizmet ve paket düzeni",
    description:
      "Hizmet fiyatları randevuya kaydedildiği andaki tutarı korur; paket ve plan bilgisi işletme bazında izlenir.",
    icon: ClipboardCheck,
    items: ["Hizmet kataloğu", "Paket kullanımı", "Geçmiş fiyat koruması"],
  },
  {
    title: "Operasyon ve kasa",
    description:
      "Premium modüllerle stok, ürün satışı, adisyon, gelir-gider, tahsilat ve prim süreçleri bağlanır.",
    icon: CreditCard,
    items: ["Stok ve ürün satışı", "Adisyon ve ödeme", "Prim ve hak ediş"],
  },
];

const moduleHighlights = modules
  .filter((module) =>
    [
      "appointments",
      "customers",
      "staff",
      "services",
      "whatsapp",
      "stock",
      "finance",
      "multi_branch",
    ].includes(module.key),
  )
  .slice(0, 8);

const planFeatureLists = {
  standard: [
    "Randevu Yönetimi",
    "Müşteri Takibi",
    "Personel Yönetimi",
    "Hizmetler",
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

export default function HomePage() {
  return (
    <main className="min-h-dvh overflow-hidden bg-white text-[#111111] dark:bg-[#07100B] dark:text-white">
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-6 lg:px-0">
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
            <Link href="#detaylar" className="transition hover:text-primary">
              Detaylar
            </Link>
            <Link href="#paketler" className="transition hover:text-primary">
              Paketler
            </Link>
            <Link href="#sss" className="transition hover:text-primary">
              SSS
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/login"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[#111111] px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-black/80 dark:bg-white dark:text-[#07100B]"
          >
            Giriş
            <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      <section className="relative isolate px-5 pb-16 pt-10 sm:px-6 lg:px-8">
        <div
          className="pointer-events-none absolute left-1/2 top-[110px] z-0 h-[330px] w-[1180px] -translate-x-1/2 rounded-[100%] opacity-100 blur-2xl dark:opacity-75"
          style={{
            background:
              "radial-gradient(circle at 18% 50%, rgba(0,139,71,0.76), transparent 34%), radial-gradient(circle at 50% 42%, rgba(248,205,36,1), transparent 36%), radial-gradient(circle at 82% 50%, rgba(0,139,71,0.76), transparent 34%)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute left-1/2 top-[190px] z-0 h-[180px] w-[1220px] -translate-x-1/2 opacity-70 blur-3xl dark:opacity-50"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(0,139,71,0.55) 18%, rgba(248,205,36,0.9) 50%, rgba(0,139,71,0.55) 82%, transparent 100%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="inline-flex min-h-8 items-center rounded-md border border-primary/25 bg-primary/10 px-3 text-xs font-semibold text-primary">
              Berber, kuaför, güzellik salonu ve klinikler için
            </p>
            <h1 className="mt-5 max-w-3xl font-display text-5xl font-black leading-[1.02] tracking-normal sm:text-6xl">
              Randevu, ekip ve işletme düzeni tek panelde.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-600 dark:text-neutral-300">
              Just Randevu; takvim, müşteri, personel, hizmet, paket, stok ve
              finans akışlarını küçük işletmelerin günlük temposuna göre
              sadeleştirir.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#111111] px-5 text-sm font-semibold text-white shadow-lg transition hover:bg-black/80 dark:bg-white dark:text-[#07100B]"
              >
                Giriş
                <ArrowRight size={16} />
              </Link>
              <Link
                href="#detaylar"
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-neutral-200 bg-white px-5 text-sm font-semibold shadow-sm transition hover:border-primary dark:border-white/10 dark:bg-white/10"
              >
                Detayları incele
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-white/70 bg-white/60 p-4 shadow-[0_24px_70px_rgba(0,139,71,0.16)] backdrop-blur dark:border-white/10 dark:bg-white/5">
            <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-[#0B1710]">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-white/10">
                <div>
                  <p className="text-xs font-semibold text-neutral-500">
                    Bugünün takvimi
                  </p>
                  <p className="mt-1 text-lg font-black">Doluluk görünümü</p>
                </div>
                <span className="rounded-md bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">
                  12 randevu
                </span>
              </div>
              <div className="mt-4 grid gap-3">
                {[
                  ["09:00", "Saç kesim", "Ahmet Mehmet"],
                  ["11:30", "Cilt bakımı", "Zeynep Kaya"],
                  ["15:00", "Paket seansı", "Merve Demir"],
                ].map(([time, service, customer]) => (
                  <div
                    key={`${time}-${service}`}
                    className="grid grid-cols-[56px_1fr] gap-3 rounded-lg border border-neutral-200 bg-white p-3 dark:border-white/10 dark:bg-white/5"
                  >
                    <p className="text-sm font-black tabular-nums text-primary">
                      {time}
                    </p>
                    <div>
                      <p className="text-sm font-semibold">{service}</p>
                      <p className="mt-1 text-xs text-neutral-500">{customer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="detaylar"
        className="relative isolate px-5 py-24 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold text-primary">Detaylar</p>
              <h2 className="mt-3 max-w-xl font-display text-3xl font-black leading-tight tracking-normal sm:text-5xl">
                Operasyon tek akışta toparlanır.
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300 sm:text-base">
              Takvim merkezde kalır; müşteri, personel, hizmet, paket, stok ve
              ödeme bilgisi aynı operasyon ritminin içinde ilerler. Detaylar
              ayrı ayrı yük değil, randevunun doğal devamıdır.
            </p>
          </div>

          <div className="mt-12 overflow-hidden rounded-lg border border-neutral-200 bg-white/86 text-[#111111] shadow-[0_26px_80px_rgba(0,139,71,0.12)] backdrop-blur dark:border-white/10 dark:bg-[#0B1710] dark:text-white">
            <div className="relative p-6 sm:p-8 lg:p-10">
              <div
                className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_70%_20%,rgba(0,139,71,0.18),transparent_38%),radial-gradient(circle_at_92%_85%,rgba(248,205,36,0.22),transparent_36%)] dark:bg-[radial-gradient(circle_at_70%_20%,rgba(0,139,71,0.36),transparent_38%),radial-gradient(circle_at_92%_85%,rgba(248,205,36,0.18),transparent_36%)]"
                aria-hidden="true"
              />
              <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  İşletme akışı
                </p>
                <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-300">
                  Takvim · Müşteri · Hizmet · Kasa
                </p>
              </div>

              <div className="relative z-10 mt-10 grid gap-8 lg:grid-cols-4">
                {capabilityGroups.map((group, index) => {
                  const Icon = group.icon;

                  return (
                    <article key={group.title} className="relative">
                      <div className="mb-5 flex items-center gap-3">
                        <span className="text-xs font-black text-primary">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="h-px flex-1 bg-neutral-200 dark:bg-white/12" />
                      </div>
                      <span className="grid size-10 place-items-center rounded-md bg-primary/10 text-primary dark:bg-white/10 dark:text-white">
                        <Icon size={19} />
                      </span>
                      <h3 className="mt-5 text-xl font-black">{group.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-white/68">
                        {group.description}
                      </p>
                      <div className="mt-5 grid gap-2">
                        {group.items.map((item) => (
                          <div
                            key={item}
                            className="flex items-center gap-2 text-xs font-semibold text-neutral-700 dark:text-white/78"
                          >
                            <Check size={14} className="text-primary" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-neutral-200 bg-white/90 px-5 py-4 text-[#111111] dark:border-white/10 dark:bg-white/5 dark:text-white sm:px-8">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                  Modüller
                </span>
                {moduleHighlights.map((module) => {
                  const Icon = module.icon;

                  return (
                    <span
                      key={module.key}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300"
                    >
                      <Icon size={15} className="text-primary" />
                      {module.name}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="paketler"
        className="relative isolate px-5 py-20 sm:px-6 lg:px-8"
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
          <p className="text-sm font-semibold text-primary">Paketler</p>
          <h2 className="mt-3 font-display text-4xl font-black tracking-normal sm:text-5xl">
            İhtiyaca göre sade paket seçimi.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-neutral-600 dark:text-neutral-300 sm:text-base">
            Küçük işletmeler için hızlı başlangıç, büyüyen ekipler için daha
            kapsamlı operasyon yönetimi.
          </p>
        </div>

        <div className="relative z-10 mx-auto mt-10 grid max-w-5xl items-stretch gap-6 lg:grid-cols-2">
          {pricing.map((packageItem) => {
            const plan = plans[packageItem.key];
            const featureList = planFeatureLists[packageItem.key];

            return (
              <article
                key={packageItem.key}
                className={
                  packageItem.featured
                    ? "relative flex min-h-[500px] w-full flex-col rounded-lg border-2 border-primary bg-white p-5 shadow-[0_24px_65px_rgba(0,139,71,0.18)] dark:bg-[#0B1710]"
                    : "relative flex min-h-[500px] w-full flex-col rounded-lg border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0B1710]"
                }
              >
                <div className="mb-4 min-h-8">
                  {packageItem.featured ? (
                    <div className="ml-auto w-fit rounded-md bg-accent px-3 py-2 text-[11px] font-black text-accent-foreground">
                      EN ÇOK SEÇİLEN
                    </div>
                  ) : null}
                </div>
                <div className="flex min-h-[145px] flex-col">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
                    <div>
                      <h3 className="font-display text-xl font-bold">
                        {packageItem.title}
                      </h3>
                      <p className="mt-3 max-w-xs text-xs leading-5 text-neutral-600 dark:text-neutral-300 sm:text-sm sm:leading-6">
                        {packageItem.description}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
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

                <div className="my-5 h-px bg-neutral-200 dark:bg-white/10" />

                <p className="mb-4 text-sm font-semibold text-primary">
                  {packageItem.footnote}
                </p>
                <div className="grid flex-1 content-start gap-2.5">
                  {featureList.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-3 text-xs sm:text-sm"
                    >
                      <Check size={16} className="mt-0.5 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-5">
                  {packageItem.featured ? (
                    <p className="text-center text-xs text-neutral-500">
                      Modül aç/kapat · Veri korunur · Paket limiti izlenir
                    </p>
                  ) : (
                    <p className="text-center text-xs text-neutral-400">
                      Sade randevu akışı · Hızlı başlangıç · Temiz takvim
                    </p>
                  )}
                </div>
              </article>
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
              className="flex min-h-14 w-full items-center justify-between gap-4 rounded-lg border border-neutral-200 bg-white px-4 text-left text-sm font-semibold shadow-sm transition hover:border-primary dark:border-white/10 dark:bg-white/10"
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

      <section className="px-5 py-24 text-center sm:px-6">
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
        <div className="mt-8 flex justify-center">
          <Link
            href="/login"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#111111] px-5 text-sm font-semibold text-white shadow-lg transition hover:bg-black/80 dark:bg-white dark:text-[#07100B]"
          >
            Giriş
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
