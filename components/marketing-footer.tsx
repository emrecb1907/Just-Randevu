import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

const footerColumns = [
  {
    title: "Ürün",
    links: [
      { label: "Randevu", href: "/#paketler" },
      { label: "Müşteri", href: "/#paketler" },
      { label: "Personel", href: "/#paketler" },
      { label: "Stok", href: "/#paketler" },
      { label: "Finans", href: "/#paketler" },
    ],
  },
  {
    title: "Paketler",
    links: [
      { label: "Standart", href: "/#paketler" },
      { label: "Premium", href: "/#paketler" },
      { label: "Kullanım limitleri", href: "/#paketler" },
      { label: "Modüller", href: "/#paketler" },
    ],
  },
  {
    title: "Kaynaklar",
    links: [
      { label: "Destek", href: "/iletisim" },
      { label: "İletişim", href: "/iletisim" },
      { label: "KVKK", href: "/gizlilik-kvkk" },
      { label: "Güvenlik", href: "/gizlilik-kvkk#bolum-10" },
    ],
  },
  {
    title: "Yasal",
    links: [
      { label: "Gizlilik", href: "/gizlilik-kvkk" },
      { label: "Kullanım şartları", href: "/kullanim-kosullari" },
      { label: "Çerezler", href: "/cerezler" },
      { label: "Abonelik", href: "/kullanim-kosullari#g" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-white px-5 py-12 text-[#111111] dark:border-white/10 dark:bg-[#07100B] dark:text-white sm:px-6 lg:px-8">
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
            <Link href="/" className="flex items-center gap-3 text-xl font-semibold">
              <span className="grid size-9 place-items-center rounded-md bg-[#111111] text-xs font-bold text-white dark:bg-white dark:text-[#07100B]">
                JR
              </span>
              Just Randevu
            </Link>
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
                    key={link.label}
                    href={link.href}
                    className="text-sm text-neutral-500 transition hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 text-xs text-neutral-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Just Randevu. Tüm hakları saklıdır.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/gizlilik-kvkk" className="transition hover:text-primary">
              Gizlilik
            </Link>
            <Link href="/kullanim-kosullari" className="transition hover:text-primary">
              Kullanım koşulları
            </Link>
            <Link href="/cerezler" className="transition hover:text-primary">
              Çerezler
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
