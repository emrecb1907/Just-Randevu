import Link from "next/link";
import { notFound } from "next/navigation";

import { deleteServiceAction, updateServiceAction } from "@/app/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { getTenantDataset, requireTenantContext } from "@/lib/app-data";

type EditServicePageProps = {
  params: Promise<{
    serviceId: string;
  }>;
};

export default async function EditServicePage({ params }: EditServicePageProps) {
  const { serviceId } = await params;
  const { membership } = await requireTenantContext();
  const { business, services } = await getTenantDataset(membership);
  const service = services.find((item) => item.id === serviceId);

  if (!service) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Hizmet Düzenleme</p>
        <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
          {service.name}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Güncel süre ve fiyat yalnızca yeni randevularda kullanılır.
        </p>
      </div>
      <form
        action={updateServiceAction}
        className="grid gap-4 rounded-[24px] border border-border bg-surface p-5 shadow-panel md:grid-cols-2"
      >
        <input type="hidden" name="businessId" value={business.id} />
        <input type="hidden" name="serviceId" value={service.id} />
        <input type="hidden" name="isActive" value="true" />
        <label className="text-sm font-medium">
          Hizmet adı
          <input
            name="name"
            required
            minLength={2}
            defaultValue={service.name}
            className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3"
          />
        </label>
        <label className="text-sm font-medium">
          Kategori
          <input
            name="category"
            required
            minLength={2}
            defaultValue={service.category}
            className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3"
          />
        </label>
        <label className="text-sm font-medium">
          Süre
          <input
            name="durationMinutes"
            required
            type="number"
            min="1"
            max="600"
            defaultValue={service.duration}
            className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3"
          />
        </label>
        <label className="text-sm font-medium">
          Fiyat
          <input
            name="defaultPriceCents"
            required
            inputMode="decimal"
            defaultValue={service.priceCents / 100}
            className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3"
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
            title="Hizmet güncellensin mi?"
            description="Yeni randevular güncel süre ve fiyatla oluşacak. Eski kayıtlar değişmez."
          >
            Güncelle
          </ConfirmSubmitButton>
        </div>
      </form>
      <form action={deleteServiceAction} className="rounded-[24px] border border-red-200 bg-red-50 p-4">
        <input type="hidden" name="businessId" value={business.id} />
        <input type="hidden" name="serviceId" value={service.id} />
        <ConfirmSubmitButton
          title="Hizmet silinsin mi?"
          description="Hizmet pasife alınacak. Geçmiş randevular korunacak."
          className="inline-flex min-h-10 items-center justify-center rounded-xl border border-red-200 bg-white px-3 text-sm font-semibold text-red-700"
        >
          Hizmeti sil
        </ConfirmSubmitButton>
      </form>
    </div>
  );
}
