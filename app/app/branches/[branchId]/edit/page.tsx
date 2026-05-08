import Link from "next/link";
import { notFound } from "next/navigation";

import { deleteBranchAction, updateBranchAction } from "@/app/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { PhoneInput } from "@/components/phone-input";
import { getTenantDataset, requireTenantContext } from "@/lib/app-data";

export default async function EditBranchPage({
  params,
}: {
  params: Promise<{ branchId: string }>;
}) {
  const { branchId } = await params;
  const { membership } = await requireTenantContext();
  const { business, branches } = await getTenantDataset(membership);
  const branch = branches.find((item) => item.id === branchId);

  if (!branch) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Şube Düzenleme</p>
        <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
          {branch.name}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Şube bilgileri personel, randevu, stok ve finans ekranlarında görünür.
        </p>
      </div>
      <form
        action={updateBranchAction}
        className="grid gap-4 rounded-[24px] border border-border bg-surface p-4 md:grid-cols-2"
      >
        <input type="hidden" name="businessId" value={business.id} />
        <input type="hidden" name="branchId" value={branch.id} />
        <input type="hidden" name="isActive" value="true" />
        <label className="text-sm font-medium">
          Şube adı
          <input
            name="name"
            required
            minLength={2}
            maxLength={80}
            defaultValue={branch.name}
            className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3"
          />
        </label>
        <PhoneInput defaultValue={branch.phone} />
        <label className="text-sm font-medium md:col-span-2">
          Adres
          <textarea
            name="address"
            maxLength={240}
            defaultValue={branch.address}
            className="mt-2 min-h-28 w-full rounded-xl border border-border bg-background px-3 py-2"
          />
        </label>
        <div className="flex items-end justify-end gap-2 md:col-span-2">
          <Link
            href="/app/branches"
            className="inline-flex min-h-11 items-center rounded-xl border border-border bg-background px-4 text-sm font-semibold"
          >
            Vazgeç
          </Link>
          <ConfirmSubmitButton
            title="Şube güncellensin mi?"
            description="Personel ve operasyon ekranlarında yeni bilgiler görünecek."
          >
            Güncelle
          </ConfirmSubmitButton>
        </div>
      </form>
      <form action={deleteBranchAction}>
        <input type="hidden" name="businessId" value={business.id} />
        <input type="hidden" name="branchId" value={branch.id} />
        <ConfirmSubmitButton
          title="Şube pasife alınsın mı?"
          description="Veriler silinmez; şube yeni personel ve randevu seçimlerinde gizlenir."
          className="inline-flex min-h-10 items-center justify-center rounded-xl border border-red-200 bg-white px-3 text-sm font-semibold text-red-700"
        >
          Şubeyi pasife al
        </ConfirmSubmitButton>
      </form>
    </div>
  );
}
