import "server-only";

import { redirect } from "next/navigation";

import type { ModuleKey, PlanKey, RoleKey } from "@/lib/product-model";
import { modules, plans } from "@/lib/product-model";
import {
  createServerSupabaseClient,
  createSupabaseAdminClient,
  isSupabaseAdminConfigured,
} from "@/lib/supabase/server";

type JsonRecord = Record<string, unknown>;

export type AppointmentStatus =
  | "bekliyor"
  | "onaylandı"
  | "geldi"
  | "tamamlandı"
  | "iptal"
  | "gelmedi";

export type AppointmentColor = "blue" | "green" | "yellow" | "purple" | "rose";

export type Appointment = {
  id: string;
  branchId: string;
  customerId: string;
  customer: string;
  phone: string;
  staffId: string;
  staffName: string;
  serviceId: string;
  service: string;
  dateKey: string;
  day: string;
  start: string;
  startsAt: string;
  durationMinutes: number;
  priceSnapshotCents: number;
  status: AppointmentStatus;
  color: AppointmentColor;
  note: string;
};

export type BranchOption = {
  id: string;
  name: string;
  phone: string;
  address: string;
  isActive: boolean;
};

export type StaffMemberWithProfile = {
  id: string;
  profileId: string;
  firstName: string;
  lastName: string;
  name: string;
  role: RoleKey;
  branchId: string;
  branch: string;
  email: string;
  phone: string;
  utilization: number;
  revenueCents: number;
  services: string[];
};

export type CustomerItem = {
  id: string;
  branchId: string;
  firstName: string;
  lastName: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  kvkkConsent: boolean;
  whatsappConsent: boolean;
  lastService: string;
  status: AppointmentStatus | "aktif";
};

export type ServiceItem = {
  id: string;
  name: string;
  duration: number;
  priceCents: number;
  category: string;
  isActive: boolean;
};

export type StockItem = {
  id: string;
  name: string;
  unit: string;
  stock: number;
  critical: number;
  salePriceCents: number;
  valueCents: number;
};

export type FinanceRow = {
  id: string;
  branchId: string;
  type: "gelir" | "gider";
  category: string;
  amountCents: number;
  occurredAt: string;
  source: string;
  note: string;
};

export type FinanceSummary = {
  dailyRevenueCents: number;
  monthlyRevenueCents: number;
  expensesCents: number;
  receivablesCents: number;
  installmentDueCents: number;
};

export type StaffWorkingHour = {
  id: string;
  businessMemberId: string;
  weekday: number;
  startsAt: string;
  endsAt: string;
  isAvailable: boolean;
};

export type BusinessHour = {
  weekday: number;
  opensAt: string;
  closesAt: string;
  isClosed: boolean;
};

export type TenantBusiness = {
  id: string;
  name: string;
  plan: PlanKey;
  planName: string;
  planMonthlyPriceCents: number;
  subscriptionPriceCents: number;
  subscriptionStatus: string;
  branchLimit: number;
  staffLimitPerBranch: number;
  staffLimitScope: "business" | "branch";
  opensAt: string;
  closesAt: string;
  activeModules: ModuleKey[];
};

export type AppDataset = {
  business: TenantBusiness;
  branches: BranchOption[];
  staffMembers: StaffMemberWithProfile[];
  appointments: Appointment[];
  customers: CustomerItem[];
  services: ServiceItem[];
  stockItems: StockItem[];
  financeRows: FinanceRow[];
  financeSummary: FinanceSummary;
  staffWorkingHours: StaffWorkingHour[];
  businessHours: BusinessHour[];
  activeModules: ModuleKey[];
};

export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  theme: "system" | "light" | "dark";
  mustChangePassword: boolean;
};

export type MembershipContext = {
  memberId: string;
  businessId: string;
  branchId: string;
  role: RoleKey;
  businessName: string;
  businessPlan: PlanKey;
  branchName: string;
  canViewCustomerPhone: boolean;
  canEditPrices: boolean;
  canTakePayments: boolean;
};

export type UserContext = {
  profile: UserProfile;
  memberships: MembershipContext[];
  isSuperAdmin: boolean;
  tenantMembership: MembershipContext | null;
};

export type SystemBusiness = {
  id: string;
  name: string;
  legalName: string;
  email: string;
  phone: string;
  plan: PlanKey;
  opensAt: string;
  closesAt: string;
  isActive: boolean;
  createdAt: string;
  branchCount: number;
  memberCount: number;
  enabledModuleCount: number;
  subscriptionStatus: string;
  subscriptionPriceCents: number;
};

export type SystemPlan = {
  key: PlanKey;
  name: string;
  monthlyPriceCents: number;
  branchLimit: number;
  staffLimit: number;
  staffLimitScope: "business" | "branch";
  isActive: boolean;
};

export type SystemSubscription = {
  id: string;
  businessId: string;
  businessName: string;
  plan: PlanKey;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  createdAt: string;
  priceSnapshotCents: number;
};

export type SystemPayment = {
  id: string;
  businessId: string;
  businessName: string;
  amountCents: number;
  status: string;
  provider: string;
  createdAt: string;
};

export type SystemDataset = {
  businesses: SystemBusiness[];
  plans: SystemPlan[];
  moduleCount: number;
  subscriptions: SystemSubscription[];
  payments: SystemPayment[];
  metrics: {
    businesses: number;
    activeSubscriptions: number;
    pendingSubscriptions: number;
    monthlyRecurringCents: number;
  };
};

const appointmentColors = [
  "blue",
  "green",
  "yellow",
  "purple",
  "rose",
] as const satisfies readonly AppointmentColor[];

const appointmentStatuses = [
  "bekliyor",
  "onaylandı",
  "geldi",
  "tamamlandı",
  "iptal",
  "gelmedi",
] as const satisfies readonly AppointmentStatus[];

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonRecord)
    : {};
}

function asArray(value: unknown): JsonRecord[] {
  return Array.isArray(value) ? value.map(asRecord) : [];
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function asBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function asPlanKey(value: unknown): PlanKey {
  return value === "premium" ? "premium" : "standard";
}

function asRoleKey(value: unknown): RoleKey {
  if (
    value === "super_admin" ||
    value === "business_owner" ||
    value === "admin" ||
    value === "staff"
  ) {
    return value;
  }

  return "staff";
}

function asAppointmentStatus(
  value: unknown,
  fallback: AppointmentStatus = "bekliyor",
) {
  return appointmentStatuses.find((status) => status === value) ?? fallback;
}

function isModuleKey(value: string): value is ModuleKey {
  return modules.some((module) => module.key === value);
}

function planLimits(plan: PlanKey) {
  if (plan === "premium") {
    return {
      branchLimit: 3,
      staffLimitPerBranch: 20,
      staffLimitScope: "branch" as const,
    };
  }

  return {
    branchLimit: 1,
    staffLimitPerBranch: 8,
    staffLimitScope: "business" as const,
  };
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function sameMonth(value: string, monthDate: Date) {
  const date = new Date(value);
  return (
    !Number.isNaN(date.getTime()) &&
    date.getFullYear() === monthDate.getFullYear() &&
    date.getMonth() === monthDate.getMonth()
  );
}

function sameDay(value: string, dayDate: Date) {
  const date = new Date(value);
  return (
    !Number.isNaN(date.getTime()) && formatDateKey(date) === formatDateKey(dayDate)
  );
}

function emptyDataset(businessId: string, businessName: string): AppDataset {
  const plan = "standard";
  const limits = planLimits(plan);

  return {
    business: {
      id: businessId,
      name: businessName,
      plan,
      planName: "Standart",
      planMonthlyPriceCents: 0,
      subscriptionPriceCents: 0,
      subscriptionStatus: "pending",
      ...limits,
      opensAt: "09:00",
      closesAt: "18:00",
      activeModules: [],
    },
    branches: [],
    staffMembers: [],
    appointments: [],
    customers: [],
    services: [],
    stockItems: [],
    financeRows: [],
    financeSummary: {
      dailyRevenueCents: 0,
      monthlyRevenueCents: 0,
      expensesCents: 0,
      receivablesCents: 0,
      installmentDueCents: 0,
    },
    staffWorkingHours: [],
    businessHours: [],
    activeModules: [],
  };
}

export async function getCurrentUserContext(): Promise<UserContext | null> {
  if (!isSupabaseAdminConfigured()) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.rpc("rpc_get_user_context", {
    target_profile_id: user.id,
  });

  if (error) {
    console.error("rpc_get_user_context failed", error.message);
    return null;
  }

  const root = asRecord(data);
  const profileRow = asRecord(root.profile);
  const memberships = asArray(root.memberships).map((membership) => ({
    memberId: asString(membership.member_id),
    businessId: asString(membership.business_id),
    branchId: asString(membership.branch_id),
    role: asRoleKey(membership.role),
    businessName: asString(membership.business_name),
    businessPlan: asPlanKey(membership.business_plan),
    branchName: asString(membership.branch_name),
    canViewCustomerPhone: asBoolean(membership.can_view_customer_phone),
    canEditPrices: asBoolean(membership.can_edit_prices),
    canTakePayments: asBoolean(membership.can_take_payments),
  }));
  const isSuperAdmin = memberships.some(
    (membership) => membership.role === "super_admin",
  );
  const tenantMembership =
    memberships.find((membership) => membership.role !== "super_admin") ?? null;

  return {
    profile: {
      id: asString(profileRow.id, user.id),
      firstName: asString(profileRow.first_name),
      lastName: asString(profileRow.last_name),
      email: asString(profileRow.email, user.email ?? ""),
      phone: asString(profileRow.phone),
      avatarUrl: asString(profileRow.avatar_url),
      theme: asString(profileRow.theme, "light") as UserProfile["theme"],
      mustChangePassword: asBoolean(profileRow.must_change_password),
    },
    memberships,
    isSuperAdmin,
    tenantMembership,
  };
}

export async function requireUserContext() {
  const context = await getCurrentUserContext();

  if (!context) {
    redirect("/login");
  }

  return context;
}

export async function requireTenantContext() {
  const context = await requireUserContext();

  if (!context.tenantMembership) {
    redirect("/app");
  }

  return {
    user: context,
    membership: context.tenantMembership,
  };
}

export async function requireSuperAdminContext() {
  const context = await requireUserContext();

  if (!context.isSuperAdmin) {
    redirect("/app");
  }

  return context;
}

export async function getTenantDataset(
  membership: MembershipContext,
): Promise<AppDataset> {
  if (!isSupabaseAdminConfigured()) {
    return emptyDataset(membership.businessId, membership.businessName);
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.rpc("rpc_get_app_context", {
      target_business_id: membership.businessId,
    });

    if (error) {
      console.error("rpc_get_app_context failed", error.message);
      return emptyDataset(membership.businessId, membership.businessName);
    }

    const root = asRecord(data);
    const businessRow = asRecord(root.business);
    const planRow = asRecord(root.plan);
    const subscriptionRow = asRecord(root.subscription);
    const plan = asPlanKey(businessRow.plan_key);
    const catalogPlan = plans[plan];
    const fallbackLimits = planLimits(plan);
    const limits = {
      branchLimit: asNumber(planRow.branch_limit, fallbackLimits.branchLimit),
      staffLimitPerBranch: asNumber(
        planRow.staff_limit,
        fallbackLimits.staffLimitPerBranch,
      ),
      staffLimitScope:
        asString(planRow.staff_limit_scope) === "branch"
          ? ("branch" as const)
          : ("business" as const),
    };

    const activeModules = asArray(root.business_modules)
      .filter((row) => asBoolean(row.is_enabled))
      .map((row) => asString(row.module_key))
      .filter(isModuleKey);

    const businessHours = asArray(root.business_hours).map((row) => ({
      weekday: asNumber(row.weekday),
      opensAt: asString(row.opens_at, "09:00").slice(0, 5),
      closesAt: asString(row.closes_at, "18:00").slice(0, 5),
      isClosed: asBoolean(row.is_closed),
    }));
    const firstOpenDay =
      businessHours.find((row) => !row.isClosed) ?? businessHours[0];

    const branches = asArray(root.branches).map((branch) => ({
      id: asString(branch.id),
      name: asString(branch.name, "Merkez"),
      phone: asString(branch.phone),
      address: asString(branch.address),
      isActive: asBoolean(branch.is_active, true),
    }));

    const appointments: Appointment[] = asArray(root.appointments).map(
      (appointment, index) => {
        const startsAt = new Date(asString(appointment.starts_at));
        const validDate = !Number.isNaN(startsAt.getTime());

        return {
          id: asString(appointment.id),
          branchId: asString(appointment.branch_id),
          customerId: asString(appointment.customer_id),
          customer: asString(appointment.customer_name, "Müşteri"),
          phone: asString(appointment.customer_phone),
          staffId: asString(appointment.staff_member_id),
          staffName: asString(appointment.staff_name, "Personel"),
          serviceId: asString(appointment.service_id),
          service: asString(appointment.service_name, "Randevu"),
          dateKey: validDate ? formatDateKey(startsAt) : "",
          day: validDate
            ? startsAt.toLocaleDateString("tr-TR", {
                weekday: "short",
                day: "numeric",
              })
            : "",
          start: validDate
            ? startsAt.toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "09:00",
          startsAt: asString(appointment.starts_at),
          durationMinutes: asNumber(appointment.duration_minutes, 30),
          priceSnapshotCents: asNumber(appointment.total_price_cents),
          status: asAppointmentStatus(appointment.status),
          color: appointmentColors[index % appointmentColors.length] ?? "blue",
          note: asString(appointment.note),
        };
      },
    );

    const staffMembers = asArray(root.members).map((member) => {
      const memberId = asString(member.id);
      const memberAppointments = appointments.filter(
        (appointment) => appointment.staffId === memberId,
      );
      const completed = memberAppointments.filter(
        (appointment) => appointment.status === "tamamlandı",
      );
      const revenueCents = completed.reduce(
        (total, appointment) => total + appointment.priceSnapshotCents,
        0,
      );
      const services = Array.from(
        new Set(memberAppointments.map((appointment) => appointment.service)),
      );

      return {
        id: memberId,
        profileId: asString(member.profile_id),
        firstName: asString(member.first_name),
        lastName: asString(member.last_name),
        name:
          `${asString(member.first_name)} ${asString(member.last_name)}`.trim() ||
          "Personel",
        role: asRoleKey(member.role),
        branchId: asString(member.branch_id),
        branch: asString(member.branch_name, "Merkez"),
        email: asString(member.email),
        phone: asString(member.phone),
        utilization: Math.min(100, memberAppointments.length * 10),
        revenueCents,
        services,
      };
    });

    const services = asArray(root.services).map((service) => ({
      id: asString(service.id),
      name: asString(service.name),
      duration: asNumber(service.duration_minutes),
      priceCents: asNumber(service.default_price_cents),
      category: asString(service.category),
      isActive: asBoolean(service.is_active, true),
    }));

    const customers: CustomerItem[] = asArray(root.customers).map((customer) => {
      const customerId = asString(customer.id);
      const customerPhone = asString(customer.phone);
      const latestAppointment = appointments
        .filter((appointment) => appointment.customerId === customerId)
        .at(-1);

      return {
        id: customerId,
        branchId: asString(customer.branch_id),
        firstName: asString(customer.first_name),
        lastName: asString(customer.last_name),
        name: `${asString(customer.first_name)} ${asString(customer.last_name)}`.trim(),
        phone: customerPhone,
        email: asString(customer.email),
        notes: asString(customer.notes),
        kvkkConsent: asBoolean(customer.kvkk_consent),
        whatsappConsent: asBoolean(customer.whatsapp_consent),
        lastService: latestAppointment?.service ?? "Randevu bulunmuyor",
        status: latestAppointment?.status ?? "aktif",
      };
    });

    const stockItems = asArray(root.products).map((product) => {
      const stock = asNumber(product.stock);
      return {
        id: asString(product.id),
        name: asString(product.name),
        unit: asString(product.unit, "adet"),
        stock,
        critical: asNumber(product.critical_stock),
        salePriceCents: asNumber(product.sale_price_cents),
        valueCents: stock * asNumber(product.sale_price_cents),
      };
    });

    const financeRows = asArray(root.income_expenses).map((entry) => ({
      id: asString(entry.id),
      branchId: asString(entry.branch_id),
      type: asString(entry.type, "gelir") as "gelir" | "gider",
      category: asString(entry.category),
      amountCents: asNumber(entry.amount_cents),
      occurredAt: asString(entry.occurred_at),
      source: asString(entry.source),
      note: asString(entry.note),
    }));

    const staffIds = staffMembers.map((member) => member.id);
    const { data: workingHoursRows } = staffIds.length
      ? await supabase
          .from("staff_working_hours")
          .select("id,business_member_id,weekday,starts_at,ends_at,is_available")
          .in("business_member_id", staffIds)
      : { data: [] };
    const staffWorkingHours = asArray(workingHoursRows).map((row) => ({
      id: asString(row.id),
      businessMemberId: asString(row.business_member_id),
      weekday: asNumber(row.weekday),
      startsAt: asString(row.starts_at),
      endsAt: asString(row.ends_at),
      isAvailable: asBoolean(row.is_available, true),
    }));

    const now = new Date();
    const dailyRevenueCents = financeRows
      .filter((row) => row.type === "gelir" && sameDay(row.occurredAt, now))
      .reduce((total, row) => total + row.amountCents, 0);
    const monthlyRevenueCents = financeRows
      .filter((row) => row.type === "gelir" && sameMonth(row.occurredAt, now))
      .reduce((total, row) => total + row.amountCents, 0);
    const expensesCents = financeRows
      .filter((row) => row.type === "gider" && sameMonth(row.occurredAt, now))
      .reduce((total, row) => total + row.amountCents, 0);

    return {
      business: {
        id: asString(businessRow.id, membership.businessId),
        name: asString(businessRow.name, membership.businessName),
        plan,
        planName: asString(planRow.name, catalogPlan.name),
        planMonthlyPriceCents: asNumber(
          planRow.monthly_price_cents,
          catalogPlan.monthlyPriceCents,
        ),
        subscriptionPriceCents: asNumber(subscriptionRow.price_snapshot_cents),
        subscriptionStatus: asString(subscriptionRow.status, "pending"),
        ...limits,
        opensAt: firstOpenDay?.opensAt ?? "09:00",
        closesAt: firstOpenDay?.closesAt ?? "18:00",
        activeModules,
      },
      branches,
      staffMembers,
      appointments,
      customers,
      services,
      stockItems,
      financeRows,
      financeSummary: {
        dailyRevenueCents,
        monthlyRevenueCents,
        expensesCents,
        receivablesCents: 0,
        installmentDueCents: 0,
      },
      staffWorkingHours,
      businessHours,
      activeModules,
    };
  } catch (error) {
    console.error("getTenantDataset failed", error);
    return emptyDataset(membership.businessId, membership.businessName);
  }
}

export async function getSystemDataset(): Promise<SystemDataset> {
  if (!isSupabaseAdminConfigured()) {
    return {
      businesses: [],
      plans: [],
      moduleCount: 0,
      subscriptions: [],
      payments: [],
      metrics: {
        businesses: 0,
        activeSubscriptions: 0,
        pendingSubscriptions: 0,
        monthlyRecurringCents: 0,
      },
    };
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.rpc("rpc_get_system_context");

  if (error) {
    console.error("rpc_get_system_context failed", error.message);
    return {
      businesses: [],
      plans: [],
      moduleCount: 0,
      subscriptions: [],
      payments: [],
      metrics: {
        businesses: 0,
        activeSubscriptions: 0,
        pendingSubscriptions: 0,
        monthlyRecurringCents: 0,
      },
    };
  }

  const root = asRecord(data);
  const businesses = asArray(root.businesses).map((business) => ({
    id: asString(business.id),
    name: asString(business.name),
    legalName: asString(business.legal_name),
    email: asString(business.email),
    phone: asString(business.phone),
    plan: asPlanKey(business.plan_key),
    opensAt: asString(business.opens_at, "09:00").slice(0, 5),
    closesAt: asString(business.closes_at, "18:00").slice(0, 5),
    isActive: asBoolean(business.is_active),
    createdAt: asString(business.created_at),
    branchCount: asNumber(business.branch_count),
    memberCount: asNumber(business.member_count),
    enabledModuleCount: asNumber(business.enabled_module_count),
    subscriptionStatus: asString(business.subscription_status, "pending"),
    subscriptionPriceCents: asNumber(business.subscription_price_snapshot_cents),
  }));
  const plans = asArray(root.plans).map((plan) => ({
    key: asPlanKey(plan.key),
    name: asString(plan.name),
    monthlyPriceCents: asNumber(plan.monthly_price_cents),
    branchLimit: asNumber(plan.branch_limit),
    staffLimit: asNumber(plan.staff_limit),
    staffLimitScope:
      asString(plan.staff_limit_scope) === "branch"
        ? ("branch" as const)
        : ("business" as const),
    isActive: asBoolean(plan.is_active, true),
  }));
  const subscriptions = asArray(root.subscriptions).map((subscription) => ({
    id: asString(subscription.id),
    businessId: asString(subscription.business_id),
    businessName: asString(subscription.business_name),
    plan: asPlanKey(subscription.plan_key),
    status: asString(subscription.status),
    currentPeriodStart: asString(subscription.current_period_start),
    currentPeriodEnd: asString(subscription.current_period_end),
    createdAt: asString(subscription.created_at),
    priceSnapshotCents: asNumber(subscription.price_snapshot_cents),
  }));
  const payments = asArray(root.payments).map((payment) => ({
    id: asString(payment.id),
    businessId: asString(payment.business_id),
    businessName: asString(payment.business_name),
    amountCents: asNumber(payment.amount_cents),
    status: asString(payment.status),
    provider: asString(payment.provider),
    createdAt: asString(payment.created_at),
  }));
  const activeSubscriptions = subscriptions.filter(
    (subscription) => subscription.status === "active",
  );
  const monthlyRecurringCents = activeSubscriptions.reduce((total, subscription) => {
    if (subscription.priceSnapshotCents > 0) {
      return total + subscription.priceSnapshotCents;
    }

    const plan = plans.find((item) => item.key === subscription.plan);
    return total + (plan?.monthlyPriceCents ?? 0);
  }, 0);

  return {
    businesses,
    plans,
    moduleCount: asArray(root.modules).length,
    subscriptions,
    payments,
    metrics: {
      businesses: businesses.length,
      activeSubscriptions: activeSubscriptions.length,
      pendingSubscriptions: subscriptions.filter(
        (subscription) => subscription.status !== "active",
      ).length,
      monthlyRecurringCents,
    },
  };
}
