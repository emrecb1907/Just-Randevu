import Link from "next/link";
import { AtSign, BriefcaseBusiness, Camera, Play } from "lucide-react";

const footerLinks = [
  { label: "Ana sayfa", href: "/" },
  { label: "Paketler", href: "/#paketler" },
  { label: "İletişim", href: "/iletisim" },
  { label: "Gizlilik ve KVKK", href: "/gizlilik-kvkk" },
  { label: "Kullanım koşulları", href: "/kullanim-kosullari" },
  { label: "Çerezler", href: "/cerezler" },
];

const socialItems = [
  { label: "Instagram", icon: Camera },
  { label: "LinkedIn", icon: BriefcaseBusiness },
  { label: "X", icon: AtSign },
  { label: "YouTube", icon: Play },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-white px-5 py-10 text-[#111111] dark:border-white/10 dark:bg-[#07100B] dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <Link href="/" className="flex items-center gap-3 text-xl font-semibold">
              <span className="grid size-9 place-items-center rounded-md bg-[#111111] text-xs font-bold text-white dark:bg-white dark:text-[#07100B]">
                JR
              </span>
              Just Randevu
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              Randevu, müşteri, personel ve operasyon yönetimini tek panelde
              toplayan SaaS.
            </p>
          </div>

          <nav
            aria-label="Alt menü"
            className="grid gap-3 text-sm sm:grid-cols-2 md:min-w-[360px]"
          >
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-neutral-500 transition hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-neutral-200 pt-6 text-xs text-neutral-500 dark:border-white/10 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Just Randevu. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-2">
            {socialItems.map((item) => {
              const Icon = item.icon;

              return (
                <span
                  key={item.label}
                  title={item.label}
                  className="grid size-9 place-items-center rounded-md border border-neutral-200 text-neutral-600 dark:border-white/10 dark:text-neutral-300"
                >
                  <Icon size={17} />
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
