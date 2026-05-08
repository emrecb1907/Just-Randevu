import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { deleteAppointmentAction, updateAppointmentAction } from "@/app/actions";
import { AppointmentForm } from "@/components/appointment-form";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { getTenantDataset, requireTenantContext } from "@/lib/app-data";
import { isStaffMembership } from "@/lib/roles";

type EditAppointmentPageProps = {
  params: Promise<{
    appointmentId: string;
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

export default async function EditAppointmentPage({ params }: EditAppointmentPageProps) {
  const { appointmentId } = await params;
  const { membership } = await requireTenantContext();
  const {
    business,
    branches,
    appointments,
    customers,
    staffMembers,
    services,
    businessHours,
  } =
    await getTenantDataset(membership);
  const appointment = appointments.find((item) => item.id === appointmentId);
  const primaryBranch = branches[0];
  const assignmentLocked = isStaffMembership(membership);

  if (assignmentLocked) {
    redirect("/app/calendar");
  }

  if (!appointment) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Randevu Düzenleme</p>
        <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
          {appointment.customer}
        </h1>
      </div>
      <AppointmentForm
        mode="edit"
        businessId={business.id}
        branches={branches}
        customers={customers}
        staffMembers={staffMembers}
        services={services}
        appointments={appointments}
        businessHours={businessHours}
        defaultBranchId={appointment.branchId || primaryBranch?.id}
        defaultCustomerId={appointment.customerId}
        defaultStaffId={appointment.staffId}
        defaultServiceId={appointment.serviceId || services[0]?.id}
        defaultStartsAt={toDateTimeLocal(appointment.startsAt)}
        defaultStatus={appointment.status}
        defaultNote={appointment.note}
        appointmentId={appointment.id}
        assignmentLocked={assignmentLocked}
        action={updateAppointmentAction}
      />
      {assignmentLocked ? null : (
        <form action={deleteAppointmentAction} className="rounded-[24px] border border-red-200 bg-red-50 p-4">
          <input type="hidden" name="businessId" value={business.id} />
          <input type="hidden" name="appointmentId" value={appointment.id} />
          <ConfirmSubmitButton title="Randevu silinsin mi?" description="Bu randevu ve varsa bağlı ödeme hareketi kaldırılacak. Bu işlem geri alınamaz." className="inline-flex min-h-10 items-center justify-center rounded-xl border border-red-200 bg-white px-3 text-sm font-semibold text-red-700">
            Randevuyu sil
          </ConfirmSubmitButton>
        </form>
      )}
    </div>
  );
}
