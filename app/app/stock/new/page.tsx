import Link from "next/link";
import { redirect } from "next/navigation";

import { createProductAction } from "@/app/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { getTenantDataset, requireTenantContext } from "@/lib/app-data";

export default async function NewStockPage() {
  const { membership } = await requireTenantContext();
  const { business, branches, activeModules } = await getTenantDataset(membership);
  const primaryBranch = branches[0];

  if (!activeModules.includes("stock")) {
    redirect("/app/settings");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Yeni Ürün</p>
        <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
          Ürün ve Açılış Stoğu
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ürün kartı ve ilk stok hareketi tek işlemde oluşturulur.
        </p>
      </div>
      {primaryBranch ? (
        <form action={createProductAction} className="grid gap-4 rounded-lg border border-border bg-surface p-4 md:grid-cols-2">
          <input type="hidden" name="businessId" value={business.id} />
          <input type="hidden" name="branchId" value={primaryBranch.id} />
          <label className="text-sm font-medium">Ürün adı<input name="name" required minLength={2} className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3" placeholder="Ürün adı" /></label>
          <label className="text-sm font-medium">Birim<input name="unit" required defaultValue="adet" className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3" /></label>
          <label className="text-sm font-medium">Kritik stok<input name="criticalStock" required type="number" min="0" defaultValue="5" className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3" /></label>
          <label className="text-sm font-medium">Satış fiyatı<input name="salePriceCents" required inputMode="decimal" placeholder="250" className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3" /></label>
          <label className="text-sm font-medium">Açılış miktarı<input name="openingQuantity" required type="number" min="0" defaultValue="0" className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3" /></label>
          <label className="text-sm font-medium">Hareket açıklaması<input name="reason" required minLength={2} defaultValue="Açılış stok girişi" className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3" /></label>
          <div className="flex items-end justify-end gap-2 md:col-span-2">
            <Link href="/app/stock" className="inline-flex min-h-11 items-center rounded-md border border-border bg-background px-4 text-sm font-semibold">Vazgeç</Link>
            <ConfirmSubmitButton title="Ürün ve stok hareketi kaydedilsin mi?" description="Ürün kartı ve açılış hareketi birlikte oluşturulur.">Ürün ekle</ConfirmSubmitButton>
          </div>
        </form>
      ) : (
        <div className="rounded-lg border border-border bg-surface p-4 text-sm text-muted-foreground">Ürün kaydı için önce aktif bir şube gerekir.</div>
      )}
    </div>
  );
}
