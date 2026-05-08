import Link from "next/link";

import { createServiceAction } from "@/app/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { getTenantDataset, requireTenantContext } from "@/lib/app-data";

export default async function NewServicePage() {
  const { membership } = await requireTenantContext();
  const { business } = await getTenantDataset(membership);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Yeni Hizmet</p>
        <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
          Hizmet Tanımla
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Süre ve fiyat yeni randevulara snapshot olarak aktarılır.
        </p>
      </div>
      <form
        action={createServiceAction}
        className="grid gap-4 rounded-lg border border-border bg-surface p-4 md:grid-cols-2"
      >
        <input type="hidden" name="businessId" value={business.id} />
        <input type="hidden" name="isActive" value="true" />
        <label className="text-sm font-medium">
          İşlem adı
          <input
            name="name"
            required
            minLength={2}
            className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3"
            placeholder="Hizmet adı"
          />
        </label>
        <label className="text-sm font-medium">
          Kategori
          <input
            name="category"
            required
            minLength={2}
            className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3"
            placeholder="Kategori"
          />
        </label>
        <label className="text-sm font-medium">
          Süre
          <select
            name="durationMinutes"
            className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3"
            defaultValue="30"
          >
            {[15, 20, 30, 40, 60, 90, 120].map((duration) => (
              <option key={duration} value={duration}>
                {duration} dakika
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium">
          Fiyat
          <input
            name="defaultPriceCents"
            required
            inputMode="decimal"
            className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3"
            placeholder="650"
          />
        </label>
        <div className="flex items-end justify-end gap-2 md:col-span-2">
          <Link
            href="/app/services"
            className="inline-flex min-h-11 items-center rounded-md border border-border bg-background px-4 text-sm font-semibold"
          >
            Vazgeç
          </Link>
          <ConfirmSubmitButton
            title="Hizmet kaydedilsin mi?"
            description="Bu fiyat yeni randevulara snapshot olarak yazılır; eski randevu gelirleri değişmez."
          >
            Hizmet ekle
          </ConfirmSubmitButton>
        </div>
      </form>
    </div>
  );
}
