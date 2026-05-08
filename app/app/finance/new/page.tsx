import Link from "next/link";
import { redirect } from "next/navigation";

import { createIncomeExpenseAction } from "@/app/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { Select } from "@/components/ui/select";
import { getTenantDataset, requireTenantContext } from "@/lib/app-data";
import { canManageMembership } from "@/lib/roles";

export default async function NewFinancePage() {
  const { membership } = await requireTenantContext();

  if (!canManageMembership(membership)) {
    redirect("/app/finance");
  }

  const { business, branches, activeModules } = await getTenantDataset(membership);
  const primaryBranch = branches[0];

  if (!activeModules.includes("finance")) {
    redirect("/app/settings");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Yeni Finans Kaydı</p>
        <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
          Manuel Gelir-Gider
        </h1>
      </div>
      {primaryBranch ? (
        <form action={createIncomeExpenseAction} className="grid gap-4 rounded-[24px] border border-border bg-surface p-4 md:grid-cols-2">
          <input type="hidden" name="businessId" value={business.id} />
          <input type="hidden" name="branchId" value={primaryBranch.id} />
          <input type="hidden" name="source" value="manual" />
          <label className="text-sm font-medium">
            Tip
            <Select
              name="type"
              placeholder="Tip seçiniz"
              options={[
                { value: "gelir", label: "Gelir" },
                { value: "gider", label: "Gider" },
              ]}
            />
          </label>
          <label className="text-sm font-medium">Kategori<input name="category" required minLength={2} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3" placeholder="Manuel kayıt" /></label>
          <label className="text-sm font-medium">Tutar<input name="amountCents" required inputMode="decimal" className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3" placeholder="1000" /></label>
          <label className="text-sm font-medium">Tarih<input name="occurredAt" type="datetime-local" required className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3" /></label>
          <label className="text-sm font-medium md:col-span-2">Not<input name="note" maxLength={500} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3" placeholder="Opsiyonel" /></label>
          <div className="flex items-end justify-end gap-2 md:col-span-2">
            <Link href="/app/finance" className="inline-flex min-h-11 items-center rounded-xl border border-border bg-background px-4 text-sm font-semibold">Vazgeç</Link>
            <ConfirmSubmitButton title="Finans kaydı eklensin mi?" description="Bu kayıt manuel kaynaklı gelir-gider hareketi olarak işletme kasasına yazılır.">Finans kaydı ekle</ConfirmSubmitButton>
          </div>
        </form>
      ) : (
        <div className="rounded-[24px] border border-border bg-surface p-4 text-sm text-muted-foreground">Finans kaydı için önce aktif bir şube gerekir.</div>
      )}
    </div>
  );
}
