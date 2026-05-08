import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { superAdminUpdatePlanAction } from "@/app/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { Select } from "@/components/ui/select";
import { getSystemDataset, requireSuperAdminContext } from "@/lib/app-data";
import { formatCurrency } from "@/lib/utils";

function moneyValue(cents: number) {
  return String(cents / 100);
}

export default async function SuperAdminPlansPage() {
  await requireSuperAdminContext();
  const system = await getSystemDataset();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Süper Admin</p>
          <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
            Paket Yönetimi
          </h1>
        </div>
        <Link
          href="/app/super-admin"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-bold text-foreground shadow-sm"
        >
          <ArrowLeft size={16} />
          İşletmelere dön
        </Link>
      </div>

      <section className="grid gap-4 xl:grid-cols-2">
        {system.plans.map((plan) => (
          <form
            key={plan.key}
            action={superAdminUpdatePlanAction}
            className="rounded-[24px] border border-border bg-surface p-5 shadow-panel"
          >
            <input type="hidden" name="plan" value={plan.key} />
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{plan.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Bu değerler yeni işletme kayıtlarında ve paket kontrollerinde
                  kullanılır.
                </p>
              </div>
              <p className="text-xl font-semibold">
                {formatCurrency(plan.monthlyPriceCents)}
              </p>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <label className="text-sm font-medium">
                Aylık fiyat
                <input
                  name="monthlyPriceCents"
                  defaultValue={moneyValue(plan.monthlyPriceCents)}
                  className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3"
                />
              </label>
              <label className="text-sm font-medium">
                Şube limiti
                <input
                  name="branchLimit"
                  type="number"
                  min={1}
                  defaultValue={plan.branchLimit}
                  className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3"
                />
              </label>
              <label className="text-sm font-medium">
                Personel limiti
                <input
                  name="staffLimit"
                  type="number"
                  min={1}
                  defaultValue={plan.staffLimit}
                  className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3"
                />
              </label>
              <label className="text-sm font-medium">
                Personel kapsamı
                <Select
                  name="staffLimitScope"
                  defaultValue={plan.staffLimitScope}
                  options={[
                    { value: "business", label: "İşletme toplamı" },
                    { value: "branch", label: "Şube başı" },
                  ]}
                />
              </label>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  name="isActive"
                  type="checkbox"
                  defaultChecked={plan.isActive}
                  className="size-4"
                />
                Satışta
              </label>
              <ConfirmSubmitButton
                title={`${plan.name} paketi güncellensin mi?`}
                description="Paket fiyatı ve limitleri kaydedilecek. Yeni işletme kayıtları güncel değerleri kullanır."
              >
                Paketi güncelle
              </ConfirmSubmitButton>
            </div>
          </form>
        ))}
      </section>
    </div>
  );
}
