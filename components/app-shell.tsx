"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";
import {
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Store,
  UserRound,
  X,
} from "lucide-react";

import { logoutAction } from "@/app/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { navigation, systemNavigation } from "@/lib/product-model";
import type { ModuleKey, RoleKey } from "@/lib/product-model";
import { isStaffRole } from "@/lib/roles";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: ReactNode;
  businessName: string;
  currentUserName: string;
  currentUserEmail: string;
  isSuperAdmin: boolean;
  activeModules: ModuleKey[];
  role: RoleKey | undefined;
};

export function AppShell({
  children,
  businessName,
  currentUserName,
  currentUserEmail,
  isSuperAdmin,
  activeModules = [],
  role,
}: AppShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = isSuperAdmin
    ? systemNavigation
    : navigation.filter(
        (item) =>
          (!item.moduleKey || activeModules.includes(item.moduleKey)) &&
          (!(role && isStaffRole(role)) ||
            [
              "/app",
              "/app/calendar",
              "/app/daily",
              "/app/customers",
              "/app/finance",
            ].includes(item.href)),
      );
  const sidebarItems = isSuperAdmin
    ? navItems
    : navItems.filter((item) => item.href !== "/app/settings");
  const activeHref = navItems
    .filter(
      (item) =>
        pathname === item.href ||
        (item.href !== "/app" && pathname.startsWith(`${item.href}/`)),
    )
    .sort((left, right) => right.href.length - left.href.length)[0]?.href;
  const sidebarWidth = collapsed ? 84 : 236;

  const sidebar = (mobile = false) => (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col border-border bg-surface p-3",
        mobile ? "w-[min(88vw,320px)] border-r" : "w-full",
      )}
    >
      <div
        className={cn(
          "mb-4 flex shrink-0 items-center gap-2",
          collapsed && !mobile ? "justify-center" : "justify-between",
        )}
      >
        {collapsed && !mobile ? null : (
          <Link
            href="/app"
            className="flex min-w-0 items-center gap-3 rounded-xl px-2 py-1.5"
            aria-label="Just Randevu"
            onClick={() => setMobileOpen(false)}
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-sm font-bold text-white">
              JR
            </span>
            <div className="min-w-0">
              <p className="truncate font-semibold leading-tight">Just Randevu</p>
              <p className="truncate text-xs text-muted-foreground">
                {isSuperAdmin ? "Platform" : businessName}
              </p>
            </div>
          </Link>
        )}
        {mobile ? (
          <button
            type="button"
            className="grid min-h-11 min-w-11 place-items-center rounded-xl border border-border"
            aria-label="Menüyü kapat"
            onClick={() => setMobileOpen(false)}
          >
            <X size={19} />
          </button>
        ) : (
          <button
            type="button"
            className="hidden min-h-11 min-w-11 place-items-center rounded-xl border border-border text-muted-foreground transition hover:border-primary hover:text-primary lg:grid"
            aria-label={collapsed ? "Menüyü genişlet" : "Menüyü daralt"}
            onClick={() => setCollapsed((value) => !value)}
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        )}
      </div>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto overflow-x-hidden pb-4 pr-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const active = activeHref === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed && !mobile ? item.label : undefined}
              aria-label={item.label}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex min-h-11 min-w-0 items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
                active && "bg-primary/10 text-primary shadow-sm",
                collapsed && !mobile && "justify-center px-0",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-inset",
              )}
            >
              <Icon size={18} className="shrink-0" />
              {collapsed && !mobile ? null : (
                <span className="truncate">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="min-h-dvh bg-background text-foreground lg:h-dvh lg:overflow-hidden">
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
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={19} />
        </button>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 bg-black/35 backdrop-blur-sm lg:hidden">
          {sidebar(true)}
        </div>
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden border-r border-border bg-surface transition-[width] duration-200 lg:block",
          collapsed ? "w-[84px]" : "w-[236px]",
        )}
      >
        {sidebar(false)}
      </aside>

      <main
        className="pt-16 lg:fixed lg:inset-y-0 lg:right-0 lg:flex lg:min-w-0 lg:flex-col lg:pt-0"
        style={{ left: sidebarWidth } as CSSProperties}
      >
        <header className="sticky top-16 z-20 flex min-h-16 shrink-0 min-w-0 items-center gap-3 border-b border-border bg-surface/95 px-4 backdrop-blur lg:static lg:px-7">
          <div className="ml-auto flex min-w-0 items-center gap-2">
            <ThemeToggle />
            {isSuperAdmin || (role && isStaffRole(role)) ? null : (
              <Link
                href="/app/settings"
                className="grid min-h-11 min-w-11 place-items-center rounded-xl border border-border bg-background text-muted-foreground transition hover:border-primary hover:text-primary"
                aria-label="İşletme ayarları"
                title="İşletme ayarları"
              >
                <Store size={18} />
              </Link>
            )}
            {role && isStaffRole(role) ? null : (
              <Link
                href="/app/profile"
                className="grid min-h-11 min-w-11 place-items-center rounded-xl border border-border bg-background text-muted-foreground transition hover:border-primary hover:text-primary"
                aria-label="Hesabım"
                title={`${currentUserName} · ${currentUserEmail}`}
              >
                <UserRound size={19} />
              </Link>
            )}
            <form action={logoutAction}>
              <ConfirmSubmitButton
                title="Çıkış yapılsın mı?"
                description="Oturum kapatılacak ve giriş ekranına yönlendirileceksiniz."
                showArrow={false}
                className="grid min-h-11 min-w-11 place-items-center rounded-xl border border-border bg-background px-0 text-muted-foreground transition hover:border-primary hover:text-primary"
              >
                <LogOut size={18} />
                <span className="sr-only">Çıkış yap</span>
              </ConfirmSubmitButton>
            </form>
          </div>
        </header>
        <div className="px-4 py-5 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:px-7 lg:py-7">{children}</div>
      </main>
    </div>
  );
}
