import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { deleteProductAction, updateProductAction } from "@/app/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { getTenantDataset, requireTenantContext } from "@/lib/app-data";

type EditStockPageProps = {
  params: Promise<{
    productId: string;
  }>;
};

export default async function EditStockPage({ params }: EditStockPageProps) {
  const { productId } = await params;
  const { membership } = await requireTenantContext();
  const { business, stockItems, activeModules } = await getTenantDataset(membership);
  const item = stockItems.find((product) => product.id === productId);

  if (!activeModules.includes("stock")) {
    redirect("/app/settings");
  }

  if (!item) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Ürün Düzenleme</p>
        <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
          {item.name}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Stok miktarı hareketlerden hesaplanır; burada kart bilgileri değişir.
        </p>
      </div>
      <form action={updateProductAction} className="grid gap-4 rounded-[24px] border border-border bg-surface p-4 md:grid-cols-2">
        <input type="hidden" name="businessId" value={business.id} />
        <input type="hidden" name="productId" value={item.id} />
        <label className="text-sm font-medium">Ürün adı<input name="name" required minLength={2} defaultValue={item.name} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3" /></label>
        <label className="text-sm font-medium">Birim<input name="unit" required defaultValue={item.unit} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3" /></label>
        <label className="text-sm font-medium">Kritik stok<input name="criticalStock" required type="number" min="0" defaultValue={item.critical} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3" /></label>
        <label className="text-sm font-medium">Satış fiyatı<input name="salePriceCents" required inputMode="decimal" defaultValue={item.salePriceCents / 100} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3" /></label>
        <div className="flex items-end justify-end gap-2 md:col-span-2">
          <Link href="/app/stock" className="inline-flex min-h-11 items-center rounded-xl border border-border bg-background px-4 text-sm font-semibold">Vazgeç</Link>
          <ConfirmSubmitButton title="Ürün güncellensin mi?" description="Ürün kartı güncellenecek; stok miktarı hareket kayıtlarından hesaplanmaya devam edecek.">Güncelle</ConfirmSubmitButton>
        </div>
      </form>
      <form action={deleteProductAction} className="rounded-[24px] border border-red-200 bg-red-50 p-4">
        <input type="hidden" name="businessId" value={business.id} />
        <input type="hidden" name="productId" value={item.id} />
        <ConfirmSubmitButton title="Ürün silinsin mi?" description="Ürün pasife alınacak; geçmiş stok hareketleri korunacak." className="inline-flex min-h-10 items-center justify-center rounded-xl border border-red-200 bg-white px-3 text-sm font-semibold text-red-700">
          Ürünü sil
        </ConfirmSubmitButton>
      </form>
    </div>
  );
}
