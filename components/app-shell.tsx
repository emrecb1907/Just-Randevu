"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Bell, LogOut, Menu, Search, Settings } from "lucide-react";

import { logoutAction } from "@/app/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { navigation, systemNavigation } from "@/lib/product-model";
import type { ModuleKey } from "@/lib/product-model";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: ReactNode;
  businessName: string;
  currentUserName: string;
  currentUserEmail: string;
  isSuperAdmin: boolean;
  activeModules: ModuleKey[];
};

export function AppShell({
  children,
  businessName,
  currentUserName,
  currentUserEmail,
  isSuperAdmin,
  activeModules = [],
}: AppShellProps) {
  const pathname = usePathname();
  const navItems = isSuperAdmin
    ? systemNavigation
    : navigation.filter(
        (item) => !item.moduleKey || activeModules.includes(item.moduleKey),
      );
  const activeHref = navItems
    .filter(
      (item) =>
        pathname === item.href ||
        (item.href !== "/app" && pathname.startsWith(`${item.href}/`)),
    )
    .sort((left, right) => right.href.length - left.href.length)[0]?.href;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-surface/95 px-4 backdrop-blur lg:hidden">
        <Link href="/app" className="flex items-center gap-2 font-semibold">
          <span className="grid size-8 place-items-center rounded-xl bg-primary text-white">
            JR
          </span>
          Just Randevu
        </Link>
        <button
          type="button"
          className="grid min-h-11 min-w-11 place-items-center rounded-xl border border-border"
          aria-label="Menüyü aç"
        >
          <Menu size={19} />
        </button>
      </div>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[236px] border-r border-border bg-surface p-4 lg:flex lg:flex-col">
        <Link href="/app" className="mb-8 flex items-center gap-3 px-2">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-sm font-bold text-white">
            JR
          </span>
          <div>
            <p className="font-semibold leading-tight">Just Randevu</p>
            <p className="text-xs text-muted-foreground">v0.1 SaaS</p>
          </div>
        </Link>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeHref === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-2xl px-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
                  active && "bg-primary/10 text-primary shadow-sm",
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-7 border-t border-border pt-5">
          <div className="mb-3 flex items-center justify-between px-3 text-xs font-semibold uppercase text-muted-foreground">
            <span>{isSuperAdmin ? "Platform yönetimi" : businessName}</span>
            <Settings size={14} />
          </div>
          <Link
            href="/app/profile"
            className="flex min-h-11 items-center gap-3 rounded-2xl px-3 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            Profilim
          </Link>
          {isSuperAdmin ? null : (
            <Link
              href="/app/settings"
              className="flex min-h-11 items-center gap-3 rounded-2xl px-3 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              İşletme ayarları
            </Link>
          )}
        </div>

        <div className="mt-auto rounded-[22px] border border-border bg-background p-3">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-primary/10 text-sm font-bold text-primary">
              {currentUserName
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {currentUserName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {currentUserEmail}
              </p>
            </div>
          </div>
          <form action={logoutAction} className="mt-3">
            <ConfirmSubmitButton
              title="Çıkış yapılsın mı?"
              description="Oturum kapatılacak ve giriş ekranına yönlendirileceksiniz."
              showArrow={false}
              className="flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-3 text-sm font-semibold text-muted-foreground transition hover:border-primary hover:text-primary"
            >
              <LogOut size={16} />
              Çıkış yap
            </ConfirmSubmitButton>
          </form>
        </div>
      </aside>

      <main className="pt-16 lg:pl-[236px] lg:pt-0">
        <header className="sticky top-16 z-20 flex min-h-16 items-center gap-3 border-b border-border bg-surface/95 px-4 backdrop-blur lg:top-0 lg:px-7">
          <div className="hidden max-w-md flex-1 items-center gap-2 rounded-2xl border border-border bg-background px-3 lg:flex">
            <Search size={17} className="text-muted-foreground" />
            <input
              className="min-h-11 flex-1 bg-transparent text-sm outline-none"
              placeholder="Müşteri, randevu, personel ara"
              aria-label="Ara"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              className="relative grid min-h-11 min-w-11 place-items-center rounded-2xl border border-border bg-background"
              aria-label="Bildirimler"
            >
              <Bell size={18} />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-accent" />
            </button>
            <ThemeToggle />
          </div>
        </header>
        <div className="px-4 py-5 lg:px-7 lg:py-7">{children}</div>
      </main>
    </div>
  );
}
