import {
  toggleModuleAction,
  updateBusinessSettingsAction,
} from "@/app/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { ModuleCard } from "@/components/module-card";
import { getTenantDataset, requireTenantContext } from "@/lib/app-data";
import { modules } from "@/lib/product-model";

export default async function SettingsPage() {
  const { membership } = await requireTenantContext();
  const { business, activeModules } = await getTenantDataset(membership);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Ayarlar</p>
        <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
          İşletme ve Modüller
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Paket hakkı olan modüller işletme tarafından açılıp kapatılabilir.
        </p>
      </div>
      <form
        action={updateBusinessSettingsAction}
        className="grid gap-4 rounded-lg border border-border bg-surface p-4 md:grid-cols-3"
      >
        <input type="hidden" name="businessId" value={business.id} />
        <label className="text-sm font-medium">
          İşletme adı
          <input
            name="name"
            className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3"
            defaultValue={business.name}
          />
        </label>
        <label className="text-sm font-medium">
          Slot süresi
          <select
            name="slotMinutes"
            className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3"
            defaultValue={business.slotMinutes}
          >
            {[5, 10, 15, 20, 30].map((slot) => (
              <option key={slot} value={slot}>
                {slot} dakika
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium">
          Tema tercihi
          <select className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3">
            <option>Sistem</option>
            <option>Light</option>
            <option>Dark</option>
          </select>
        </label>
        <div className="flex items-end md:col-span-3">
          <ConfirmSubmitButton
            title="İşletme ayarları güncellensin mi?"
            description="Slot süresi takvim ve çakışma kontrollerinin temel ritmini belirler."
          >
            Ayarları kaydet
          </ConfirmSubmitButton>
        </div>
      </form>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => (
          <div key={module.key} className="space-y-3">
            <ModuleCard module={module} activeModules={activeModules} />
            <form action={toggleModuleAction}>
              <input type="hidden" name="businessId" value={business.id} />
              <input type="hidden" name="moduleKey" value={module.key} />
              <input
                type="hidden"
                name="enabled"
                value={activeModules.includes(module.key) ? "false" : "true"}
              />
              <ConfirmSubmitButton
                title={`${module.name} ${activeModules.includes(module.key) ? "kapatılsın" : "açılsın"} mı?`}
                description="Modül kapatıldığında veri silinmez; menü ve işlem akışlarından gizlenir."
                className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-semibold"
              >
                {activeModules.includes(module.key)
                  ? "Modülü kapat"
                  : "Modülü aç"}
              </ConfirmSubmitButton>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
