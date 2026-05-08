import Link from "next/link";

import { createBranchAction } from "@/app/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { PhoneInput } from "@/components/phone-input";
import { getTenantDataset, requireTenantContext } from "@/lib/app-data";

export default async function NewBranchPage() {
  const { membership } = await requireTenantContext();
  const { business, branches } = await getTenantDataset(membership);
  const canAddBranch = branches.length < business.branchLimit;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Yeni Şube</p>
        <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
          Şube Ekle
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Şube işletmeden bağımsız bir kayıt değildir; personel, randevu, stok
          ve finans hareketleri bu şube altında toplanır.
        </p>
      </div>
      {canAddBranch ? (
        <form
          action={createBranchAction}
          className="grid gap-4 rounded-[24px] border border-border bg-surface p-4 md:grid-cols-2"
        >
          <input type="hidden" name="businessId" value={business.id} />
          <label className="text-sm font-medium">
            Şube adı
            <input
              name="name"
              required
              minLength={2}
              maxLength={80}
              className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3"
              placeholder="Örn. Kadıköy"
            />
          </label>
          <PhoneInput />
          <label className="text-sm font-medium md:col-span-2">
            Adres
            <textarea
              name="address"
              maxLength={240}
              className="mt-2 min-h-28 w-full rounded-xl border border-border bg-background px-3 py-2"
              placeholder="Mahalle, cadde, kapı no..."
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
              title="Şube oluşturulsun mu?"
              description="Yeni şube personel ve randevu formlarında seçilebilir olacak."
            >
              Şube oluştur
            </ConfirmSubmitButton>
          </div>
        </form>
      ) : (
        <div className="rounded-[24px] border border-border bg-surface p-4 text-sm text-muted-foreground">
          Bu pakette yeni şube hakkı kalmadı. Paket limiti {business.branchLimit}.
        </div>
      )}
    </div>
  );
}
