import Link from "next/link";
import { redirect } from "next/navigation";

import { createServiceAction } from "@/app/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { Select } from "@/components/ui/select";
import { getTenantDataset, requireTenantContext } from "@/lib/app-data";
import { canManageMembership } from "@/lib/roles";

export default async function NewServicePage() {
  const { membership } = await requireTenantContext();

  if (!canManageMembership(membership)) {
    redirect("/app/calendar");
  }

  const { business } = await getTenantDataset(membership);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Yeni Hizmet</p>
        <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
          Hizmet Tanımla
        </h1>
      </div>
      <form
        action={createServiceAction}
        className="grid gap-4 rounded-[24px] border border-border bg-surface p-5 shadow-panel md:grid-cols-2"
      >
        <input type="hidden" name="businessId" value={business.id} />
        <input type="hidden" name="isActive" value="true" />
        <label className="text-sm font-medium md:col-span-2">
          Hizmet adı
          <input
            name="name"
            required
            minLength={2}
            className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3"
            placeholder="Hizmet adı"
          />
        </label>
        <label className="text-sm font-medium">
          Süre
          <Select
            name="durationMinutes"
            placeholder="Süre seçiniz"
            options={[15, 20, 30, 40, 60, 90, 120].map((duration) => ({
              value: String(duration),
              label: `${duration} dakika`,
            }))}
          />
        </label>
        <label className="text-sm font-medium">
          Fiyat
          <input
            name="defaultPriceCents"
            required
            inputMode="decimal"
            className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3"
            placeholder="650"
          />
        </label>
        <div className="flex items-end justify-end gap-2 md:col-span-2">
          <Link
            href="/app/services"
            className="inline-flex min-h-11 items-center rounded-xl border border-border bg-background px-4 text-sm font-semibold"
          >
            Vazgeç
          </Link>
          <ConfirmSubmitButton
            title="Hizmet kaydedilsin mi?"
            description="Bu fiyat yeni randevularda kullanılır. Eski randevu gelirleri değişmez."
          >
            Hizmet ekle
          </ConfirmSubmitButton>
        </div>
      </form>
    </div>
  );
}
