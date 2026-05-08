import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Clock3,
  LifeBuoy,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

const contactChannels = [
  {
    title: "Destek e-postası",
    description:
      "Teknik destek, abonelik, fatura, hesap, veri başvurusu ve genel talepler için.",
    value: "[DESTEK_EPOSTA]",
    icon: Mail,
  },
  {
    title: "Şirket adresi",
    description:
      "Yasal bildirimler, KVKK başvuruları ve resmi yazışmalar için kullanılacak adres.",
    value: "[ŞİRKET_ADRESİ]",
    icon: MapPin,
  },
  {
    title: "Ticari bilgiler",
    description:
      "Şirket unvanı, MERSİS, vergi dairesi ve ticaret sicili bilgileri yayına çıkmadan önce tamamlanmalıdır.",
    value: "[ŞİRKET_UNVANI] · [MERSİS_NO] · [VERGİ_DAİRESİ]",
    icon: Building2,
  },
  {
    title: "Yanıt süresi",
    description:
      "Talepleriniz konuya ve doğrulama ihtiyacına göre makul sürede değerlendirilir.",
    value: "[DESTEK_SAATLERİ]",
    icon: Clock3,
  },
];

const requestTypes = [
  "Teknik sorun ve hata bildirimi",
  "Abonelik, paket, ödeme ve fatura talepleri",
  "İşletme, şube, personel ve hesap yönetimi soruları",
  "KVKK başvuruları, veri işleme ve çerez tercihleri",
  "Randevu bildirimleri, WhatsApp, e-posta ve SMS izinleri",
  "Güvenlik bildirimi ve yetkisiz erişim şüphesi",
];

export const metadata: Metadata = {
  title: "İletişim | Just Randevu",
  description:
    "Just Randevu destek, şirket iletişimi, KVKK başvuruları ve güvenlik bildirimleri.",
};

export default function ContactPage() {
  return (
    <main className="min-h-dvh bg-white text-[#111111] dark:bg-[#07100B] dark:text-white">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-6 lg:px-0">
        <Link href="/" className="flex items-center gap-3 text-sm font-semibold">
          <span className="grid size-8 place-items-center rounded-md bg-[#111111] text-xs font-bold text-white dark:bg-white dark:text-[#07100B]">
            JR
          </span>
          Just Randevu
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-4 text-xs font-semibold shadow-sm transition hover:border-primary dark:border-white/10 dark:bg-white/10"
        >
          <ArrowLeft size={14} />
          Ana sayfa
        </Link>
      </header>

      <section className="relative isolate overflow-hidden px-5 pb-12 pt-8 sm:px-6 lg:px-8">
        <div
          className="pointer-events-none absolute left-1/2 top-36 -z-10 h-72 w-[980px] -translate-x-1/2 rounded-[100%] opacity-90 blur-3xl dark:opacity-55"
          style={{
            background:
              "radial-gradient(circle at 20% 50%, rgba(0,139,71,0.42), transparent 34%), radial-gradient(circle at 50% 40%, rgba(248,205,36,0.72), transparent 34%), radial-gradient(circle at 80% 50%, rgba(0,139,71,0.42), transparent 34%)",
          }}
          aria-hidden="true"
        />
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-md bg-[#111111] text-white shadow-lg dark:bg-white dark:text-[#07100B]">
            <MessageCircle size={20} />
          </div>
          <p className="mt-5 text-xs font-black uppercase text-primary">
            Destek ve resmi başvurular
          </p>
          <h1 className="mt-3 font-display text-5xl font-black leading-[1.02] tracking-normal sm:text-6xl">
            İletişim
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300 sm:text-base">
            Platform, abonelik, KVKK, çerez tercihleri, güvenlik ve operasyonel
            destek taleplerinizi aşağıdaki kanallar üzerinden iletebilirsiniz.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="#kanallar"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#111111] px-5 text-sm font-semibold text-white shadow-lg transition hover:bg-black/80 dark:bg-white dark:text-[#07100B]"
            >
              Kanalları gör
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/cerezler"
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-neutral-200 bg-white px-5 text-sm font-semibold shadow-sm transition hover:border-primary dark:border-white/10 dark:bg-white/10"
            >
              Çerezler politikası
            </Link>
          </div>
        </div>
      </section>

      <section
        id="kanallar"
        className="mx-auto grid max-w-6xl gap-8 px-5 pb-20 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-0"
      >
        <div className="grid gap-5 md:grid-cols-2">
          {contactChannels.map((channel) => {
            const Icon = channel.icon;

            return (
              <article
                key={channel.title}
                className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5"
              >
                <div className="grid size-10 place-items-center rounded-md bg-primary/10 text-primary">
                  <Icon size={18} />
                </div>
                <h2 className="mt-5 font-display text-xl font-black">
                  {channel.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                  {channel.description}
                </p>
                <p className="mt-4 break-words rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm font-semibold dark:border-white/10 dark:bg-white/5">
                  {channel.value}
                </p>
              </article>
            );
          })}
        </div>

        <aside className="h-fit rounded-lg border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 lg:sticky lg:top-5">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
              <LifeBuoy size={18} />
            </span>
            <div>
              <h2 className="font-display text-xl font-black">
                Talep kapsamları
              </h2>
              <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                Talebinizde işletme adı, kullanıcı e-postası, ilgili kayıt
                bilgisi, ekran görüntüsü ve talep konusunu paylaşmanız süreci
                hızlandırır.
              </p>
            </div>
          </div>

          <ul className="mt-6 grid gap-3">
            {requestTypes.map((type) => (
              <li key={type} className="flex gap-3 text-sm leading-6">
                <span className="mt-2 size-2.5 shrink-0 rounded-sm bg-gradient-to-br from-primary to-accent" />
                <span className="text-neutral-700 dark:text-neutral-200">
                  {type}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-lg border border-primary/25 bg-primary/5 p-4 text-sm leading-6 text-neutral-700 dark:text-neutral-200">
            <div className="flex items-start gap-3">
              <ShieldCheck size={18} className="mt-0.5 shrink-0 text-primary" />
              <p>
                KVKK başvurularında kimlik doğrulaması için ek bilgi talep
                edilebilir. Güvenlik bildirimi yaparken hassas verileri açık
                metin olarak paylaşmayın.
              </p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
