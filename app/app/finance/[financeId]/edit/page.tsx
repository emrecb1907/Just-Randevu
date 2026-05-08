import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { deleteIncomeExpenseAction, updateIncomeExpenseAction } from "@/app/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { getTenantDataset, requireTenantContext } from "@/lib/app-data";

type EditFinancePageProps = {
  params: Promise<{
    financeId: string;
  }>;
};

function toDateTimeLocal(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

export default async function EditFinancePage({ params }: EditFinancePageProps) {
  const { financeId } = await params;
  const { membership } = await requireTenantContext();
  const { business, branches, financeRows, activeModules } = await getTenantDataset(membership);
  const entry = financeRows.find((row) => row.id === financeId);
  const primaryBranch = branches[0];

  if (!activeModules.includes("finance")) {
    redirect("/app/settings");
  }

  if (!entry) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Finans Düzenleme</p>
        <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
          {entry.category}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Gelir-gider hareketinin tutarını, tarihini ve açıklamasını düzenleyin.
        </p>
      </div>
      <form action={updateIncomeExpenseAction} className="grid gap-4 rounded-[24px] border border-border bg-surface p-4 md:grid-cols-2">
        <input type="hidden" name="businessId" value={business.id} />
        <input type="hidden" name="financeId" value={entry.id} />
        <label className="text-sm font-medium">Şube<select name="branchId" defaultValue={entry.branchId || primaryBranch?.id} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3">{branches.map((branch) => (<option key={branch.id} value={branch.id}>{branch.name}</option>))}</select></label>
        <label className="text-sm font-medium">Tip<select name="type" defaultValue={entry.type} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3"><option value="gelir">Gelir</option><option value="gider">Gider</option></select></label>
        <label className="text-sm font-medium">Kategori<input name="category" required minLength={2} defaultValue={entry.category} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3" /></label>
        <label className="text-sm font-medium">Tutar<input name="amountCents" required inputMode="decimal" defaultValue={entry.amountCents / 100} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3" /></label>
        <label className="text-sm font-medium">Kaynak<select name="source" defaultValue={entry.source} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3"><option value="manual">Manuel</option><option value="appointment">Randevu</option><option value="ticket">Adisyon</option><option value="stock">Stok</option><option value="commission">Prim</option></select></label>
        <label className="text-sm font-medium">Tarih<input name="occurredAt" type="datetime-local" required defaultValue={toDateTimeLocal(entry.occurredAt)} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3" /></label>
        <label className="text-sm font-medium md:col-span-2">Not<input name="note" maxLength={500} defaultValue={entry.note} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3" /></label>
        <div className="flex items-end justify-end gap-2 md:col-span-2">
          <Link href="/app/finance" className="inline-flex min-h-11 items-center rounded-xl border border-border bg-background px-4 text-sm font-semibold">Vazgeç</Link>
          <ConfirmSubmitButton title="Finans kaydı güncellensin mi?" description="Gelir-gider hareketinin yeni bilgileri kaydedilecek.">Güncelle</ConfirmSubmitButton>
        </div>
      </form>
      <form action={deleteIncomeExpenseAction} className="rounded-[24px] border border-red-200 bg-red-50 p-4">
        <input type="hidden" name="businessId" value={business.id} />
        <input type="hidden" name="financeId" value={entry.id} />
        <ConfirmSubmitButton title="Finans kaydı silinsin mi?" description="Bu gelir-gider hareketi kalıcı olarak silinecek." className="inline-flex min-h-10 items-center justify-center rounded-xl border border-red-200 bg-white px-3 text-sm font-semibold text-red-700">
          Kaydı sil
        </ConfirmSubmitButton>
      </form>
    </div>
  );
}
