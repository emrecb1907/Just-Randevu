"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, Check, Clock3, Lock, Plus, Search } from "lucide-react";

import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import type {
  Appointment,
  BranchOption,
  BusinessHour,
  CustomerItem,
  ServiceItem,
  StaffMemberWithProfile,
} from "@/lib/app-data";
import { formatCurrency } from "@/lib/utils";

const appointmentStatuses = [
  "bekliyor",
  "onaylandı",
  "geldi",
  "tamamlandı",
  "iptal",
  "gelmedi",
] as const;

const customerResultLimit = 8;

type AppointmentFormMode = "create" | "edit";

type AppointmentFormProps = {
  mode: AppointmentFormMode;
  businessId: string;
  branches: BranchOption[];
  customers: CustomerItem[];
  staffMembers: StaffMemberWithProfile[];
  services: ServiceItem[];
  appointments: Appointment[];
  businessHours: BusinessHour[];
  defaultBranchId?: string | undefined;
  defaultCustomerId?: string | undefined;
  defaultStaffId?: string | undefined;
  defaultServiceId?: string | undefined;
  defaultStartsAt?: string | undefined;
  defaultStatus?: (typeof appointmentStatuses)[number];
  defaultNote?: string;
  appointmentId?: string;
  action: (formData: FormData) => void | Promise<void>;
};

function toMinutes(value: string) {
  const [hourValue, minuteValue] = value.split(":").map(Number);
  return (hourValue ?? 0) * 60 + (minuteValue ?? 0);
}

function toTime(value: number) {
  const hour = Math.floor(value / 60);
  const minute = value % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function dateKey(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toLocalParts(value?: string) {
  const date = value ? new Date(value) : new Date();
  const validDate = Number.isNaN(date.getTime()) ? new Date() : date;

  return {
    date: dateKey(validDate),
    time: validDate.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

function parseQueryLikeDate(value?: string) {
  if (!value) {
    return undefined;
  }

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    return value;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

function weekdayFromDate(value: string) {
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? new Date().getDay() : date.getDay();
}

function overlaps(
  startMinute: number,
  duration: number,
  appointment: Appointment,
  selectedDate: string,
  staffId: string,
  ignoredAppointmentId?: string,
) {
  if (
    appointment.id === ignoredAppointmentId ||
    appointment.staffId !== staffId ||
    appointment.dateKey !== selectedDate ||
    appointment.status === "iptal" ||
    appointment.status === "gelmedi"
  ) {
    return false;
  }

  const appointmentStart = toMinutes(appointment.start);
  const appointmentEnd = appointmentStart + appointment.durationMinutes;
  const endMinute = startMinute + duration;

  return startMinute < appointmentEnd && endMinute > appointmentStart;
}

function normalizeCustomerSearch(value: string) {
  return value.toLocaleLowerCase("tr-TR").replace(/\D/g, "");
}

function normalizeCustomerText(value: string) {
  return value.toLocaleLowerCase("tr-TR").trim();
}

export function AppointmentForm({
  mode,
  businessId,
  branches,
  customers,
  staffMembers,
  services,
  appointments,
  businessHours,
  defaultBranchId,
  defaultCustomerId,
  defaultStaffId,
  defaultServiceId,
  defaultStartsAt,
  defaultStatus = "bekliyor",
  defaultNote = "",
  appointmentId,
  action,
}: AppointmentFormProps) {
  const normalizedDefault = parseQueryLikeDate(defaultStartsAt);
  const defaultParts = toLocalParts(normalizedDefault);
  const defaultCustomer = defaultCustomerId
    ? customers.find((customer) => customer.id === defaultCustomerId)
    : undefined;
  const [branchId, setBranchId] = useState(defaultBranchId ?? branches[0]?.id ?? "");
  const [customerId, setCustomerId] = useState(defaultCustomer?.id ?? "");
  const [customerQuery, setCustomerQuery] = useState(
    defaultCustomer ? `${defaultCustomer.name} ${defaultCustomer.phone}` : "",
  );
  const [staffId, setStaffId] = useState(defaultStaffId ?? staffMembers[0]?.id ?? "");
  const [serviceId, setServiceId] = useState(defaultServiceId ?? services[0]?.id ?? "");
  const [selectedDate, setSelectedDate] = useState(defaultParts.date);
  const [selectedTime, setSelectedTime] = useState(defaultParts.time);
  const selectedService = services.find((service) => service.id === serviceId);
  const selectedCustomer = customers.find((customer) => customer.id === customerId);
  const selectedDuration = selectedService?.duration ?? 30;
  const dayHours = businessHours.find(
    (item) => item.weekday === weekdayFromDate(selectedDate),
  );
  const opensAt = dayHours?.isClosed ? "09:00" : (dayHours?.opensAt ?? "09:00");
  const closesAt = dayHours?.isClosed ? "18:00" : (dayHours?.closesAt ?? "18:00");
  const isClosed = dayHours?.isClosed ?? false;
  const timeOptions = useMemo(() => {
    if (isClosed) {
      return [];
    }

    const start = toMinutes(opensAt);
    const end = toMinutes(closesAt) - selectedDuration;

    return Array.from(
      { length: Math.max(0, Math.floor((end - start) / 5) + 1) },
      (_, index) => {
        const minute = start + index * 5;
        const busy = appointments.some((appointment) =>
          overlaps(
            minute,
            selectedDuration,
            appointment,
            selectedDate,
            staffId,
            appointmentId,
          ),
        );

        return {
          value: toTime(minute),
          busy,
        };
      },
    );
  }, [
    appointmentId,
    appointments,
    closesAt,
    isClosed,
    opensAt,
    selectedDate,
    selectedDuration,
    staffId,
  ]);
  const filteredCustomers = useMemo(() => {
    const textQuery = normalizeCustomerText(customerQuery);
    const digitQuery = normalizeCustomerSearch(customerQuery);
    const matches = customerQuery.trim()
      ? customers.filter((customer) => {
          const haystack = normalizeCustomerText(
            `${customer.name} ${customer.firstName} ${customer.lastName} ${customer.email}`,
          );
          const phone = normalizeCustomerSearch(customer.phone);

          return (
            haystack.includes(textQuery) ||
            Boolean(digitQuery && phone.includes(digitQuery))
          );
        })
      : customers;

    return matches.slice(0, customerResultLimit);
  }, [customerQuery, customers]);
  const selectedSlot = timeOptions.find((option) => option.value === selectedTime);
  const canSubmit = Boolean(customerId && selectedSlot && !selectedSlot.busy);
  const startsAtValue = canSubmit ? `${selectedDate}T${selectedTime}` : "";
  const busyCount = timeOptions.filter((option) => option.busy).length;

  return (
    <form
      action={action}
      className="grid gap-4 rounded-[24px] border border-border bg-surface p-4 shadow-panel sm:p-5 md:grid-cols-2"
    >
      <input type="hidden" name="businessId" value={businessId} />
      {appointmentId ? (
        <input type="hidden" name="appointmentId" value={appointmentId} />
      ) : null}
      <input type="hidden" name="startsAt" value={startsAtValue} required />
      <input type="hidden" name="customerId" value={customerId} required />

      <label className="text-sm font-medium">
        Şube
        <select
          name="branchId"
          required
          value={branchId}
          onChange={(event) => setBranchId(event.target.value)}
          className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3"
        >
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
      </label>

      <div className="text-sm font-medium">
        <label htmlFor="appointment-customer-search">Müşteri</label>
        <div className="mt-2 flex min-h-11 items-center gap-2 rounded-xl border border-border bg-background px-3">
          <Search size={17} className="shrink-0 text-muted-foreground" />
          <input
            id="appointment-customer-search"
            value={customerQuery}
            onChange={(event) => {
              const nextValue = event.target.value;

              setCustomerQuery(nextValue);

              if (
                nextValue.trim() === "" ||
                selectedCustomer &&
                !`${selectedCustomer.name} ${selectedCustomer.phone}`
                  .toLocaleLowerCase("tr-TR")
                  .includes(nextValue.toLocaleLowerCase("tr-TR"))
              ) {
                setCustomerId("");
              }
            }}
            placeholder="İsim veya telefon ile ara"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            autoComplete="off"
          />
        </div>
        <div className="mt-2 max-h-56 overflow-y-auto rounded-xl border border-border bg-background p-1">
          {filteredCustomers.map((customer) => {
            const selected = customer.id === customerId;

            return (
              <button
                key={customer.id}
                type="button"
                onClick={() => {
                  setCustomerId(customer.id);
                  setCustomerQuery(`${customer.name} ${customer.phone}`);
                }}
                className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-3 text-left transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-inset"
              >
                <span className="min-w-0">
                  <span className="block truncate font-semibold">
                    {customer.name}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {customer.phone}
                  </span>
                </span>
                {selected ? (
                  <Check size={17} className="shrink-0 text-primary" />
                ) : null}
              </button>
            );
          })}
          {filteredCustomers.length === 0 ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              Müşteri bulunamadı.
            </div>
          ) : null}
        </div>
        {selectedCustomer ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Seçili müşteri:{" "}
            <span className="font-semibold text-foreground">
              {selectedCustomer.name}
            </span>
          </p>
        ) : (
          <p className="mt-2 text-xs text-amber-700">
            Randevu için listeden bir müşteri seçin.
          </p>
        )}
      </div>

      <label className="text-sm font-medium">
        Personel
        <select
          name="staffId"
          required
          value={staffId}
          onChange={(event) => setStaffId(event.target.value)}
          className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3"
        >
          {staffMembers.map((staff) => (
            <option key={staff.id} value={staff.id}>
              {staff.name}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm font-medium">
        Hizmet
        <select
          name="serviceId"
          required
          value={serviceId}
          onChange={(event) => setServiceId(event.target.value)}
          className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3"
        >
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} · {service.duration} dk · {formatCurrency(service.priceCents)}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm font-medium">
        Tarih
        <input
          type="date"
          required
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
          className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3"
        />
      </label>

      <label className="text-sm font-medium">
        Saat
        <select
          required
          value={selectedTime}
          onChange={(event) => setSelectedTime(event.target.value)}
          className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3 disabled:opacity-60"
          disabled={timeOptions.length === 0}
        >
          {timeOptions.length === 0 ? (
            <option value="">Kapalı</option>
          ) : (
            timeOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.busy}
              >
                {option.value}
                {option.busy ? " · dolu" : ""}
              </option>
            ))
          )}
        </select>
      </label>

      <div className="rounded-xl border border-border bg-background p-3 text-sm md:col-span-2">
        <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
          <span className="inline-flex items-center gap-2 font-semibold text-foreground">
            <Clock3 size={16} />
            {opensAt} - {closesAt}
          </span>
          <span>·</span>
          <span>{selectedDuration} dakika</span>
          <span>·</span>
          <span>{busyCount} dolu başlangıç kilitli</span>
        </div>
        {!canSubmit ? (
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900">
            {selectedSlot?.busy ? <Lock size={17} /> : <AlertCircle size={17} />}
            <p>
              {!customerId
                ? "Randevu oluşturmak için önce müşteri seçin."
                : selectedSlot?.busy
                ? "Bu personelde seçilen aralık dolu. Listeden boş bir saat seçin."
                : "Seçilen hizmet bu mesai aralığına sığmıyor veya işletme o gün kapalı."}
            </p>
          </div>
        ) : null}
      </div>

      <label className="text-sm font-medium">
        Durum
        <select
          name="status"
          className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3"
          defaultValue={defaultStatus}
        >
          {appointmentStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm font-medium">
        Not
        <input
          name="note"
          maxLength={1000}
          defaultValue={defaultNote}
          className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3"
          placeholder="Opsiyonel"
        />
      </label>

      <div className="flex flex-col-reverse gap-2 md:col-span-2 md:flex-row md:items-end md:justify-end">
        <Link
          href="/app/calendar"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-semibold"
        >
          Vazgeç
        </Link>
        <ConfirmSubmitButton
          title={mode === "create" ? "Randevu oluşturulsun mu?" : "Randevu güncellensin mi?"}
          description="Personel uygunluğu ve çalışma saati kontrol edilerek takvime işlenecek."
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90 disabled:opacity-50"
          disabled={!canSubmit}
        >
          <Plus size={16} />
          {mode === "create" ? "Randevu ekle" : "Güncelle"}
        </ConfirmSubmitButton>
      </div>
    </form>
  );
}
