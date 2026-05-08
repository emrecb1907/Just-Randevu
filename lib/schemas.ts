import { z } from "zod";

export const roleSchema = z.enum([
  "super_admin",
  "business_owner",
  "admin",
  "staff",
]);

export function normalizeTurkishPhone(value: unknown) {
  if (typeof value !== "string") {
    return value;
  }

  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("90") && digits.length === 12) {
    return `+${digits}`;
  }

  if (digits.startsWith("0") && digits.length === 11) {
    return `+90${digits.slice(1)}`;
  }

  if (digits.length === 10) {
    return `+90${digits}`;
  }

  return value.trim();
}

export const turkishPhoneSchema = z.preprocess(
  normalizeTurkishPhone,
  z.string().regex(/^\+90[1-9]\d{9}$/, "Telefon +90 formatında olmalıdır."),
);

export const moneyCentsSchema = z.preprocess((value) => {
  if (typeof value === "number") {
    return Math.round(value * 100);
  }

  if (typeof value !== "string") {
    return value;
  }

  const normalized = value.replace(/\./g, "").replace(",", ".");
  const amount = Number(normalized);

  if (!Number.isFinite(amount)) {
    return value;
  }

  return Math.round(amount * 100);
}, z.number().int().min(0));

export const requiredKvkkConsentSchema = z.preprocess(
  (value) => value === "on" || value === true,
  z.literal(true, { error: "KVKK onayı zorunludur." }),
);

export const appointmentStatusSchema = z.enum([
  "bekliyor",
  "onaylandı",
  "geldi",
  "tamamlandı",
  "iptal",
  "gelmedi",
]);

export const moduleKeySchema = z.enum([
  "appointments",
  "customers",
  "staff",
  "services",
  "whatsapp",
  "stock",
  "product_sales",
  "tickets",
  "finance",
  "receivables",
  "installments",
  "payments",
  "performance",
  "commissions",
  "surveys",
  "advanced_permissions",
  "multi_branch",
  "package_tracking",
]);

export const businessRegistrationSchema = z.object({
  businessName: z.string().min(2).max(120),
  ownerName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: turkishPhoneSchema,
  password: z.string().min(10).max(72),
  plan: z.enum(["standard", "premium"]),
  opensAt: z.string().regex(/^\d{2}:\d{2}$/).default("09:00"),
  closesAt: z.string().regex(/^\d{2}:\d{2}$/).default("18:00"),
  kvkkConsent: requiredKvkkConsentSchema,
});

export const profileSchema = z.object({
  firstName: z.string().min(2).max(60),
  lastName: z.string().min(2).max(60),
  email: z.string().email(),
  phone: turkishPhoneSchema,
  avatarUrl: z.string().url().optional().or(z.literal("")),
  theme: z.enum(["system", "light", "dark"]),
});

export const staffCreateSchema = z.object({
  firstName: z.string().min(2).max(60),
  lastName: z.string().min(2).max(60),
  email: z.string().email(),
  phone: turkishPhoneSchema,
  branchId: z.string().uuid(),
  role: z.enum(["admin", "staff"]),
  temporaryPassword: z.string().min(10).max(72),
  forcePasswordChange: z.preprocess(
    (value) => value === "true" || value === true,
    z.literal(true),
  ),
});

export const branchSchema = z.object({
  name: z.string().min(2, "Şube adı en az 2 karakter olmalıdır.").max(80),
  phone: turkishPhoneSchema.optional().or(z.literal("")),
  address: z.string().max(240).optional(),
});

export const branchUpdateSchema = branchSchema.extend({
  branchId: z.string().uuid(),
  isActive: z.preprocess(
    (value) => value === "true" || value === true || value === "on",
    z.boolean(),
  ),
});

export const staffScheduleSchema = z.object({
  memberId: z.string().uuid(),
  weekday: z.coerce.number().int().min(0).max(6),
  startsAt: z.string().regex(/^\d{2}:\d{2}$/),
  endsAt: z.string().regex(/^\d{2}:\d{2}$/),
  isAvailable: z.preprocess(
    (value) => value === "true" || value === true || value === "on",
    z.boolean(),
  ),
});

export const customerSchema = z.object({
  firstName: z.string().min(2).max(60),
  lastName: z.string().min(2).max(60),
  phone: turkishPhoneSchema,
  email: z.string().email().optional().or(z.literal("")),
  notes: z.string().max(1000).optional(),
  kvkkConsent: requiredKvkkConsentSchema,
  whatsappConsent: z.preprocess(
    (value) => value === "on" || value === true,
    z.boolean(),
  ),
});

export const serviceSchema = z.object({
  name: z.string().min(2).max(100),
  category: z.string().min(2).max(80),
  durationMinutes: z.coerce.number().int().positive().max(600),
  defaultPriceCents: moneyCentsSchema,
  isActive: z.preprocess(
    (value) => value === "true" || value === true || value === "on",
    z.boolean(),
  ),
});

export const idSchema = z.string().uuid();

export const appointmentCreateSchema = z.object({
  customerId: z.string().uuid(),
  staffId: z.string().uuid(),
  branchId: z.string().uuid(),
  startsAt: z.string().datetime(),
  durationMinutes: z.number().int().positive().max(600),
  serviceIds: z.array(z.string().uuid()).min(1),
  priceSnapshotCents: z.number().int().min(0),
  status: appointmentStatusSchema.default("bekliyor"),
  note: z.string().max(1000).optional(),
});

export const appointmentFormSchema = z.object({
  branchId: idSchema,
  customerId: idSchema,
  staffId: idSchema,
  serviceId: idSchema,
  startsAt: z
    .string()
    .min(1, "Randevu zamanı zorunludur.")
    .transform((value) => new Date(value).toISOString()),
  status: appointmentStatusSchema.default("bekliyor"),
  note: z.string().max(1000).optional(),
});

export const appointmentUpdateSchema = appointmentFormSchema.extend({
  appointmentId: idSchema,
});

export const stockMovementSchema = z.object({
  productId: z.string().uuid(),
  branchId: z.string().uuid(),
  movementType: z.enum([
    "giris",
    "cikis",
    "duzeltme",
    "satis",
    "islemde_kullanim",
  ]),
  quantity: z.coerce.number().positive(),
  unitCostCents: moneyCentsSchema.optional(),
  reason: z.string().min(2).max(240),
});

export const productCreateSchema = z.object({
  businessId: z.string().uuid(),
  branchId: z.string().uuid(),
  name: z.string().min(2).max(120),
  unit: z.string().min(1).max(30),
  criticalStock: z.coerce.number().min(0),
  salePriceCents: moneyCentsSchema,
  openingQuantity: z.coerce.number().min(0),
  reason: z.string().min(2).max(240),
});

export const customerUpdateSchema = customerSchema.extend({
  customerId: idSchema,
  branchId: idSchema,
});

export const serviceUpdateSchema = serviceSchema.extend({
  serviceId: idSchema,
});

export const staffUpdateSchema = z.object({
  memberId: idSchema,
  profileId: idSchema,
  firstName: z.string().min(2).max(60),
  lastName: z.string().min(2).max(60),
  email: z.string().email(),
  phone: turkishPhoneSchema,
  branchId: idSchema,
  role: z.enum(["admin", "staff"]),
});

export const productUpdateSchema = productCreateSchema
  .omit({ businessId: true, branchId: true, openingQuantity: true, reason: true })
  .extend({
    productId: idSchema,
  });

export const incomeExpenseSchema = z.object({
  branchId: z.string().uuid(),
  type: z.enum(["gelir", "gider"]),
  category: z.string().min(2).max(80),
  amountCents: moneyCentsSchema.refine(
    (value) => value > 0,
    "Tutar sıfırdan büyük olmalıdır.",
  ),
  occurredAt: z
    .string()
    .min(1)
    .transform((value) => new Date(value).toISOString()),
  source: z.enum(["appointment", "ticket", "manual", "stock", "commission"]),
  note: z.string().max(500).optional(),
});

export const incomeExpenseUpdateSchema = incomeExpenseSchema.extend({
  financeId: idSchema,
});

export const deleteEntitySchema = z.object({
  id: idSchema,
});

export const loginSchema = z.object({
  email: z.string().email("Geçerli e-posta girin."),
  password: z.string().min(8, "Şifre en az 8 karakter olmalıdır."),
});

export const businessSettingsSchema = z.object({
  businessId: z.string().uuid(),
  name: z.string().min(2).max(120),
  opensAt: z.string().regex(/^\d{2}:\d{2}$/),
  closesAt: z.string().regex(/^\d{2}:\d{2}$/),
});

export const systemBusinessUpdateSchema = z.object({
  businessId: idSchema,
  name: z.string().min(2).max(120),
  email: z.string().email().optional().or(z.literal("")),
  phone: turkishPhoneSchema.optional().or(z.literal("")),
  plan: z.enum(["standard", "premium"]),
  opensAt: z.string().regex(/^\d{2}:\d{2}$/),
  closesAt: z.string().regex(/^\d{2}:\d{2}$/),
  isActive: z.preprocess(
    (value) => value === "true" || value === true || value === "on",
    z.boolean(),
  ),
});

export const planUpdateSchema = z.object({
  plan: z.enum(["standard", "premium"]),
  monthlyPriceCents: moneyCentsSchema,
  branchLimit: z.coerce.number().int().min(1).max(100),
  staffLimit: z.coerce.number().int().min(1).max(1000),
  staffLimitScope: z.enum(["business", "branch"]),
  isActive: z.preprocess(
    (value) => value === "true" || value === true || value === "on",
    z.boolean(),
  ),
});

export const moduleToggleSchema = z.object({
  businessId: z.string().uuid(),
  moduleKey: moduleKeySchema,
  enabled: z.preprocess(
    (value) => value === "true" || value === true,
    z.boolean(),
  ),
});

export const iyzicoCallbackSchema = z.object({
  token: z.string().min(1),
  conversationId: z.string().min(1),
  status: z.enum(["success", "failure"]),
});

export const whatsappWebhookSchema = z.object({
  object: z.string(),
  entry: z.array(z.unknown()),
});
