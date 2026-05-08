import {
  toggleModuleAction,
  updateBusinessSettingsAction,
} from "@/app/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { ModuleCard } from "@/components/module-card";
import { SurfaceCard } from "@/components/surface-card";
import { getTenantDataset, requireTenantContext } from "@/lib/app-data";
import { modules, plans } from "@/lib/product-model";
import type { ModuleKey } from "@/lib/product-model";
import { formatCurrency } from "@/lib/utils";

type SettingsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const { membership } = await requireTenantContext();
  const { business, activeModules } = await getTenantDataset(membership);
  const params = searchParams ? await searchParams : {};
  const error = firstParam(params.error);
  const success = firstParam(params.success);
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
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          {success}
        </div>
      ) : null}
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
            Takvim aralığı
            <select
              name="slotMinutes"
              required
              defaultValue={business.slotMinutes}
              className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3"
            >
              {[5, 10, 15, 20, 30].map((slot) => (
                <option key={slot} value={slot}>
                  {slot} dakika
                </option>
              ))}
            </select>
            <span className="mt-1 block text-xs text-muted-foreground">
              Randevu başlangıç seçimleri bu aralığa göre ilerler.
            </span>
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
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => {
          const isActive = activeModules.includes(module.key);
          const isIncluded = includedModules.includes(module.key);

          return (
            <div key={module.key} className="space-y-3">
              <ModuleCard module={module} activeModules={activeModules} />
              {isIncluded || isActive ? (
                <form action={toggleModuleAction}>
                  <input type="hidden" name="businessId" value={business.id} />
                  <input type="hidden" name="moduleKey" value={module.key} />
                  <input
                    type="hidden"
                    name="enabled"
                    value={isActive ? "false" : "true"}
                  />
                  <ConfirmSubmitButton
                    title={`${module.name} ${isActive ? "kapatılsın" : "açılsın"} mı?`}
                    description="Modül kapatıldığında veri silinmez; menü ve işlem akışlarından gizlenir."
                    className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 text-sm font-semibold"
                  >
                    {isActive ? "Modülü kapat" : "Modülü aç"}
                  </ConfirmSubmitButton>
                </form>
              ) : (
                <div className="inline-flex min-h-10 w-full items-center justify-center rounded-xl border border-border bg-muted px-3 text-sm font-semibold text-muted-foreground">
                  Pakete dahil değil
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
