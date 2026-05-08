export const appointmentStatusOptions = [
  { value: "bekliyor", label: "Bekliyor" },
  { value: "geldi", label: "Geldi" },
  { value: "gelmedi", label: "Gelmedi" },
  { value: "iptal", label: "İptal" },
  { value: "tamamlandı", label: "Tamamlandı" },
] as const;

export type AppointmentFormStatus = (typeof appointmentStatusOptions)[number]["value"];

const appointmentStatusLabels: Record<string, string> = {
  aktif: "Aktif",
  bekliyor: "Bekliyor",
  onaylandı: "Onaylandı",
  geldi: "Geldi",
  tamamlandı: "Tamamlandı",
  iptal: "İptal",
  gelmedi: "Gelmedi",
};

const subscriptionStatusLabels: Record<string, string> = {
  active: "Aktif",
  inactive: "Pasif",
  pending: "Bekliyor",
  past_due: "Ödeme Bekliyor",
  unpaid: "Ödeme Bekliyor",
  canceled: "İptal",
  cancelled: "İptal",
  expired: "Süresi Doldu",
  trialing: "Deneme",
};

const paymentStatusLabels: Record<string, string> = {
  success: "Başarılı",
  failure: "Başarısız",
  failed: "Başarısız",
  paid: "Ödendi",
  pending: "Bekliyor",
  canceled: "İptal",
  cancelled: "İptal",
};

const financeSourceLabels: Record<string, string> = {
  appointment: "Randevu",
  ticket: "Adisyon",
  manual: "Manuel",
  stock: "Stok",
  commission: "Prim",
};

const financeTypeLabels: Record<string, string> = {
  gelir: "Gelir",
  gider: "Gider",
};

function fallbackLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toLocaleUpperCase("tr-TR") + part.slice(1))
    .join(" ");
}

export function appointmentStatusLabel(status: string) {
  return appointmentStatusLabels[status] ?? fallbackLabel(status);
}

export function normalizeAppointmentFormStatus(
  status: string,
): AppointmentFormStatus {
  if (
    status === "geldi" ||
    status === "gelmedi" ||
    status === "iptal" ||
    status === "tamamlandı"
  ) {
    return status;
  }

  return "bekliyor";
}

export function subscriptionStatusLabel(status: string) {
  return subscriptionStatusLabels[status] ?? fallbackLabel(status);
}

export function paymentStatusLabel(status: string) {
  return paymentStatusLabels[status] ?? fallbackLabel(status);
}

export function financeSourceLabel(source: string) {
  return financeSourceLabels[source] ?? fallbackLabel(source);
}

export function financeTypeLabel(type: string) {
  return financeTypeLabels[type] ?? fallbackLabel(type);
}
