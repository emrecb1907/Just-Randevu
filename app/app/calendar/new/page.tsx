import { createAppointmentAction } from "@/app/actions";
import { AppointmentForm } from "@/components/appointment-form";
import { getTenantDataset, requireTenantContext } from "@/lib/app-data";
import { isStaffMembership } from "@/lib/roles";

type NewAppointmentPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function NewAppointmentPage({
  searchParams,
}: NewAppointmentPageProps) {
  const { membership } = await requireTenantContext();
  const {
    business,
    branches,
    customers,
    staffMembers,
    services,
    appointments,
    businessHours,
  } =
    await getTenantDataset(membership);
  const params = searchParams ? await searchParams : {};
  const primaryBranch = branches[0];
  const canCreate =
    primaryBranch && customers.length > 0 && staffMembers.length > 0 && services.length > 0;
  const requestedStartsAt = firstParam(params.startsAt);
  const requestedStaffId = firstParam(params.staffId);
  const requestedCustomerId = firstParam(params.customerId);
  const assignmentLocked = isStaffMembership(membership);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Yeni Randevu</p>
        <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
          Randevu Oluştur
        </h1>
      </div>
      {canCreate ? (
        <AppointmentForm
          mode="create"
          businessId={business.id}
          branches={branches}
          customers={customers}
          staffMembers={staffMembers}
          services={services}
          appointments={appointments}
          businessHours={businessHours}
          defaultBranchId={primaryBranch.id}
          defaultCustomerId={requestedCustomerId}
          defaultStaffId={assignmentLocked ? membership.memberId : requestedStaffId}
          defaultStartsAt={requestedStartsAt}
          assignmentLocked={assignmentLocked}
          action={createAppointmentAction}
        />
      ) : (
        <div className="rounded-[24px] border border-border bg-surface p-4 text-sm text-muted-foreground shadow-panel">Randevu eklemek için önce müşteri, personel ve hizmet kaydı gerekir.</div>
      )}
    </div>
  );
}
