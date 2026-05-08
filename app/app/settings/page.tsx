import {
  toggleModuleAction,
  updateBusinessSettingsAction,
} from "@/app/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { SurfaceCard } from "@/components/surface-card";
import { getTenantDataset, requireTenantContext } from "@/lib/app-data";
import { modules, plans } from "@/lib/product-model";
import type { ModuleKey } from "@/lib/product-model";
import { cn, formatCurrency } from "@/lib/utils";

export default async function SettingsPage() {
  const { membership } = await requireTenantContext();
  const { business, activeModules } = await getTenantDataset(membership);
  const includedModules: ModuleKey[] = plans[business.plan].includedModules;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">İşletme Ayarları</p>
        <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
          İşletme Profili
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          İşletme bilgilerini, çalışma saatlerini ve paket kapsamını yönetin.
        </p>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_0.72fr]">
        <form
          action={updateBusinessSettingsAction}
          className="grid gap-4 rounded-[24px] border border-border bg-surface p-5 shadow-panel md:grid-cols-2"
        >
          <input type="hidden" name="businessId" value={business.id} />
          <label className="text-sm font-medium md:col-span-2">
            İşletme adı
            <input
              name="name"
              required
              minLength={2}
              className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3"
              defaultValue={business.name}
            />
          </label>
          <label className="text-sm font-medium">
            Açılış saati
            <input
              name="opensAt"
              type="time"
              required
              defaultValue={business.opensAt}
              className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3"
            />
            <span className="mt-1 block text-xs text-muted-foreground">
              Takvim ve vardiya ekranları bu saatten başlar.
            </span>
          </label>
          <label className="text-sm font-medium">
            Kapanış saati
            <input
              name="closesAt"
              type="time"
              required
              defaultValue={business.closesAt}
              className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3"
            />
            <span className="mt-1 block text-xs text-muted-foreground">
              Bu saatten sonra randevu alınamaz.
            </span>
          </label>
          <div className="flex items-end md:col-span-2">
            <ConfirmSubmitButton
              title="İşletme ayarları güncellensin mi?"
              description="İşletme adı ve çalışma saatleri kaydedilecek. Takvim ve vardiya görünümü bu saat aralığına göre açılacak."
            >
              Ayarları kaydet
            </ConfirmSubmitButton>
          </div>
        </form>

        <SurfaceCard>
          <p className="text-sm font-semibold text-primary">Paket Bilgisi</p>
          <h2 className="mt-2 text-2xl font-semibold">{business.planName}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Abonelik ücreti kayıt anındaki fiyatla takip edilir; paket fiyatı
            daha sonra değişse bile mevcut abonelik tutarı değişmez.
          </p>
          <dl className="mt-5 grid gap-3 text-sm">
            <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-3">
              <dt className="text-muted-foreground">Mevcut abonelik tutarı</dt>
              <dd className="font-semibold">
                {formatCurrency(
                  business.subscriptionPriceCents || business.planMonthlyPriceCents,
                )}
              </dd>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-3">
              <dt className="text-muted-foreground">Güncel paket fiyatı</dt>
              <dd className="font-semibold">
                {formatCurrency(business.planMonthlyPriceCents)}
              </dd>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-3">
              <dt className="text-muted-foreground">Şube limiti</dt>
              <dd className="font-semibold">{business.branchLimit}</dd>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-3">
              <dt className="text-muted-foreground">Personel limiti</dt>
              <dd className="font-semibold">
                {business.staffLimitPerBranch}{" "}
                {business.staffLimitScope === "branch" ? "şube başı" : "toplam"}
              </dd>
            </div>
          </dl>
        </SurfaceCard>
      </div>
      <section className="overflow-hidden rounded-[24px] border border-border bg-surface shadow-panel">
        <div className="border-b border-border p-4 sm:p-5">
          <p className="text-sm font-semibold text-primary">Modüller</p>
          <h2 className="mt-1 text-xl font-semibold">Açık Özellikler</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            İşletmenin kullanacağı özellikleri tek listeden yönetin.
          </p>
        </div>
        <div className="divide-y divide-border">
          {modules.map((module) => {
            const Icon = module.icon;
            const isActive = activeModules.includes(module.key);
            const isIncluded = includedModules.includes(module.key);
            const canToggle = isIncluded || isActive;

            return (
              <div
                key={module.key}
                className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-center sm:p-5"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className={cn(
                      "grid size-10 shrink-0 place-items-center rounded-xl",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{module.name}</h3>
                      <span
                        className={cn(
                          "rounded-full px-2 py-1 text-[11px] font-bold",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {isActive ? "Açık" : "Kapalı"}
                      </span>
                      {!isIncluded ? (
                        <span className="rounded-full bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-800">
                          Pakette yok
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {module.description}
                    </p>
                  </div>
                </div>

                <form action={toggleModuleAction} className="justify-self-start sm:justify-self-end">
                  <input type="hidden" name="businessId" value={business.id} />
                  <input type="hidden" name="moduleKey" value={module.key} />
                  <input
                    type="hidden"
                    name="enabled"
                    value={isActive ? "false" : "true"}
                  />
                  <button
                    type="submit"
                    disabled={!canToggle}
                    aria-label={`${module.name} ${isActive ? "kapat" : "aç"}`}
                    aria-pressed={isActive}
                    className={cn(
                      "relative h-8 w-14 rounded-full border transition disabled:cursor-not-allowed disabled:opacity-50",
                      isActive
                        ? "border-primary bg-primary"
                        : "border-border bg-muted",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-1 grid size-6 place-items-center rounded-full bg-white shadow-sm transition-transform",
                        isActive ? "translate-x-7" : "translate-x-1",
                      )}
                    />
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
