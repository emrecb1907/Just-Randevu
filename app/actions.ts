"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  branchSchema,
  branchUpdateSchema,
  businessRegistrationSchema,
  businessSettingsSchema,
  customerSchema,
  customerUpdateSchema,
  deleteEntitySchema,
  appointmentFormSchema,
  appointmentStatusUpdateSchema,
  appointmentUpdateSchema,
  incomeExpenseSchema,
  incomeExpenseUpdateSchema,
  loginSchema,
  moduleToggleSchema,
  planUpdateSchema,
  productCreateSchema,
  productUpdateSchema,
  profileSchema,
  serviceSchema,
  serviceUpdateSchema,
  staffCreateSchema,
  staffScheduleSchema,
  staffUpdateSchema,
  systemBusinessUpdateSchema,
} from "@/lib/schemas";
import {
  createServerSupabaseClient,
  createSupabaseAdminClient,
} from "@/lib/supabase/server";
import {
  getTenantDataset,
  requireSuperAdminContext,
  requireTenantContext,
  requireUserContext,
} from "@/lib/app-data";
import { canManageMembership, isStaffMembership } from "@/lib/roles";

function formObject(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

function formString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function assertUuid(value: string, label: string) {
  return z.string().uuid(`${label} geçersiz.`).parse(value);
}

function assertBusinessScope(formData: FormData, expectedBusinessId: string) {
  const businessId = assertUuid(formString(formData, "businessId"), "İşletme");

  if (businessId !== expectedBusinessId) {
    redirect("/app?error=yetkisiz-isletme");
  }
}

function assertCanManageBusiness(
  membership: Awaited<ReturnType<typeof requireTenantContext>>["membership"],
  redirectPath = "/app/calendar",
) {
  if (!canManageMembership(membership)) {
    redirect(redirectPath);
  }
}

async function assertModuleEnabled(
  membership: Awaited<ReturnType<typeof requireTenantContext>>["membership"],
  moduleKey: "finance" | "stock",
  redirectPath: string,
) {
  const dataset = await getTenantDataset(membership);

  if (!dataset.activeModules.includes(moduleKey)) {
    redirect(
      `${redirectPath}?error=${encodeURIComponent("Bu özellik paketinizde açık değil.")}`,
    );
  }

  return dataset;
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts.shift() ?? fullName;
  const lastName = parts.join(" ") || "Yetkili";
  return { firstName, lastName };
}

function dateKeyFromDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function timeFromDate(date: Date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;
}

function minutesFromTime(value: string) {
  const [hourValue, minuteValue] = value.split(":").map(Number);
  return (hourValue ?? 0) * 60 + (minuteValue ?? 0);
}

async function assertAppointmentAvailability({
  membership,
  startsAt,
  staffId,
  serviceId,
  ignoredAppointmentId,
}: {
  membership: Awaited<ReturnType<typeof requireTenantContext>>["membership"];
  startsAt: string;
  staffId: string;
  serviceId: string;
  ignoredAppointmentId?: string;
}) {
  const dataset = await getTenantDataset(membership);
  const service = dataset.services.find((item) => item.id === serviceId);
  const startDate = new Date(startsAt);

  if (!service || Number.isNaN(startDate.getTime())) {
    redirect(
      `/app/calendar?error=${encodeURIComponent("Randevu bilgileri geçerli değil.")}`,
    );
  }

  if (startDate.getMinutes() % 5 !== 0) {
    redirect(
      `/app/calendar?error=${encodeURIComponent("Randevu dakikası 5 dakikalık aralıklarla seçilmeli.")}`,
    );
  }

  const selectedDateKey = dateKeyFromDate(startDate);
  const selectedTime = timeFromDate(startDate);
  const selectedStart = minutesFromTime(selectedTime);
  const selectedEnd = selectedStart + service.duration;
  const dayHours = dataset.businessHours.find(
    (item) => item.weekday === startDate.getDay(),
  );
  const opensAt = dayHours?.opensAt ?? dataset.business.opensAt;
  const closesAt = dayHours?.closesAt ?? dataset.business.closesAt;

  if (
    dayHours?.isClosed ||
    selectedStart < minutesFromTime(opensAt) ||
    selectedEnd > minutesFromTime(closesAt)
  ) {
    redirect(
      `/app/calendar?error=${encodeURIComponent("Randevu işletme çalışma saatleri içinde olmalı.")}`,
    );
  }

  const hasOverlap = dataset.appointments.some((appointment) => {
    if (
      appointment.id === ignoredAppointmentId ||
      appointment.staffId !== staffId ||
      appointment.dateKey !== selectedDateKey ||
      appointment.status === "iptal" ||
      appointment.status === "gelmedi"
    ) {
      return false;
    }

    const appointmentStart = minutesFromTime(appointment.start);
    const appointmentEnd = appointmentStart + appointment.durationMinutes;
    return selectedStart < appointmentEnd && selectedEnd > appointmentStart;
  });

  if (hasOverlap) {
    redirect(
      `/app/calendar?error=${encodeURIComponent("Bu personelde seçilen saat dolu.")}`,
    );
  }
}

export async function loginAction(formData: FormData) {
  const input = loginSchema.parse(formObject(formData));
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword(input);

  if (error) {
    redirect(`/login?error=${encodeURIComponent("Giriş bilgileri hatalı.")}`);
  }

  redirect("/app");
}

export async function logoutAction() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function registerBusinessAction(formData: FormData) {
  if (formString(formData, "paymentConsent") !== "on") {
    redirect(
      `/register?error=${encodeURIComponent("Ödeme adımı tamamlanmadan kayıt oluşturulamaz.")}`,
    );
  }

  const input = businessRegistrationSchema.parse(formObject(formData));
  const admin = createSupabaseAdminClient();
  const { firstName, lastName } = splitName(input.ownerName);

  const { data: userData, error: userError } =
    await admin.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: true,
      phone: input.phone,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        phone: input.phone,
        onboarding: "business_owner",
      },
    });

  if (userError || !userData.user) {
    redirect(
      `/register?error=${encodeURIComponent(userError?.message ?? "Kayıt oluşturulamadı.")}`,
    );
  }

  const { error: profileError } = await admin.rpc("rpc_upsert_profile", {
    profile_id: userData.user.id,
    profile_first_name: firstName,
    profile_last_name: lastName,
    profile_email: input.email,
    profile_phone: input.phone,
    profile_avatar_url: null,
    profile_theme: "light",
    profile_must_change_password: false,
  });

  if (profileError) {
    redirect(`/register?error=${encodeURIComponent(profileError.message)}`);
  }

  const { error: rpcError } = await admin.rpc(
    "rpc_create_business_with_owner",
    {
      owner_profile_id: userData.user.id,
      business_name: input.businessName,
      business_email: input.email,
      business_phone: input.phone,
      selected_plan: input.plan,
      business_opens_at: input.opensAt,
      business_closes_at: input.closesAt,
    },
  );

  if (rpcError) {
    redirect(`/register?error=${encodeURIComponent(rpcError.message)}`);
  }

  revalidatePath("/app");

  const supabase = await createServerSupabaseClient();
  await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  redirect("/app");
}

export async function superAdminCreateBusinessAction(formData: FormData) {
  await requireSuperAdminContext();
  const input = businessRegistrationSchema.parse(formObject(formData));
  const admin = createSupabaseAdminClient();
  const { firstName, lastName } = splitName(input.ownerName);

  const { data: userData, error: userError } =
    await admin.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: true,
      phone: input.phone,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        phone: input.phone,
        onboarding: "business_owner",
      },
    });

  if (userError || !userData.user) {
    redirect(
      `/app/super-admin?error=${encodeURIComponent(userError?.message ?? "İşletme admini oluşturulamadı.")}`,
    );
  }

  const { error: profileError } = await admin.rpc("rpc_upsert_profile", {
    profile_id: userData.user.id,
    profile_first_name: firstName,
    profile_last_name: lastName,
    profile_email: input.email,
    profile_phone: input.phone,
    profile_avatar_url: null,
    profile_theme: "light",
    profile_must_change_password: true,
  });

  if (profileError) {
    redirect(`/app/super-admin?error=${encodeURIComponent(profileError.message)}`);
  }

  const { error: rpcError } = await admin.rpc(
    "rpc_create_business_with_owner",
    {
      owner_profile_id: userData.user.id,
      business_name: input.businessName,
      business_email: input.email,
      business_phone: input.phone,
      selected_plan: input.plan,
      business_opens_at: input.opensAt,
      business_closes_at: input.closesAt,
    },
  );

  if (rpcError) {
    redirect(`/app/super-admin?error=${encodeURIComponent(rpcError.message)}`);
  }

  revalidatePath("/app");
  revalidatePath("/app/super-admin");
  redirect("/app/super-admin");
}

export async function superAdminUpdateBusinessAction(formData: FormData) {
  await requireSuperAdminContext();
  const input = systemBusinessUpdateSchema.parse(formObject(formData));
  const admin = createSupabaseAdminClient();
  const { error } = await admin.rpc("rpc_super_admin_update_business", {
    target_business_id: input.businessId,
    business_name: input.name,
    business_email: input.email || null,
    business_phone: input.phone || null,
    selected_plan: input.plan,
    business_opens_at: input.opensAt,
    business_closes_at: input.closesAt,
    target_is_active: input.isActive,
  });

  if (error) {
    redirect(`/app/super-admin?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/app");
  revalidatePath("/app/super-admin");
  redirect("/app/super-admin");
}

export async function superAdminDeleteBusinessAction(formData: FormData) {
  await requireSuperAdminContext();
  const input = deleteEntitySchema.parse({
    id: formString(formData, "businessId"),
  });
  const admin = createSupabaseAdminClient();
  const { error } = await admin.rpc("rpc_super_admin_delete_business", {
    target_business_id: input.id,
  });

  if (error) {
    redirect(`/app/super-admin?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/app");
  revalidatePath("/app/super-admin");
  redirect("/app/super-admin");
}

export async function superAdminUpdatePlanAction(formData: FormData) {
  await requireSuperAdminContext();
  const input = planUpdateSchema.parse(formObject(formData));
  const admin = createSupabaseAdminClient();
  const { error } = await admin.rpc("rpc_super_admin_update_plan", {
    target_plan: input.plan,
    target_monthly_price_cents: input.monthlyPriceCents,
    target_branch_limit: input.branchLimit,
    target_staff_limit: input.staffLimit,
    target_staff_limit_scope: input.staffLimitScope,
    target_is_active: input.isActive,
  });

  if (error) {
    redirect(`/app/super-admin?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/app");
  revalidatePath("/app/super-admin");
  redirect("/app/super-admin");
}

export async function createCustomerAction(formData: FormData) {
  const { user, membership } = await requireTenantContext();
  assertBusinessScope(formData, membership.businessId);
  const branchId = isStaffMembership(membership)
    ? membership.branchId
    : assertUuid(formString(formData, "branchId"), "Şube");
  const input = customerSchema.parse(formObject(formData));
  const admin = createSupabaseAdminClient();
  const { error } = await admin.rpc("rpc_create_customer", {
    target_business_id: membership.businessId,
    target_branch_id: branchId,
    customer_first_name: input.firstName,
    customer_last_name: input.lastName,
    customer_phone: input.phone,
    customer_email: input.email ?? "",
    customer_notes: input.notes ?? "",
    customer_kvkk_consent: input.kvkkConsent,
    customer_whatsapp_consent: input.whatsappConsent,
    actor_profile_id: user.profile.id,
    actor_can_manage: canManageMembership(membership),
  });

  if (error) {
    redirect(`/app/customers?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/app/customers");
  redirect("/app/customers");
}

export async function updateCustomerAction(formData: FormData) {
  const { user, membership } = await requireTenantContext();
  assertBusinessScope(formData, membership.businessId);
  const input = customerUpdateSchema.parse(formObject(formData));
  const dataset = await getTenantDataset(membership);
  const customer = dataset.customers.find((item) => item.id === input.customerId);
  const canUpdateCustomer =
    canManageMembership(membership) ||
    (isStaffMembership(membership) && customer?.createdBy === user.profile.id);

  if (!canUpdateCustomer) {
    redirect("/app/customers?error=yetkisiz-musteri");
  }

  const targetBranchId = isStaffMembership(membership)
    ? membership.branchId
    : input.branchId;
  const admin = createSupabaseAdminClient();
  const { error } = await admin.rpc("rpc_update_customer", {
    target_business_id: membership.businessId,
    target_customer_id: input.customerId,
    target_branch_id: targetBranchId,
    customer_first_name: input.firstName,
    customer_last_name: input.lastName,
    customer_phone: input.phone,
    customer_email: input.email ?? "",
    customer_notes: input.notes ?? "",
    customer_kvkk_consent: input.kvkkConsent,
    customer_whatsapp_consent: input.whatsappConsent,
    actor_profile_id: user.profile.id,
    actor_can_manage: canManageMembership(membership),
  });

  if (error) {
    redirect(`/app/customers?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/app/customers");
  redirect("/app/customers");
}

export async function deleteCustomerAction(formData: FormData) {
  const { user, membership } = await requireTenantContext();
  assertCanManageBusiness(membership, "/app/customers");
  assertBusinessScope(formData, membership.businessId);
  const input = deleteEntitySchema.parse({ id: formString(formData, "customerId") });
  const admin = createSupabaseAdminClient();
  const { error } = await admin.rpc("rpc_delete_customer", {
    target_business_id: membership.businessId,
    target_customer_id: input.id,
    actor_profile_id: user.profile.id,
  });

  if (error) {
    redirect(`/app/customers?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/app/customers");
  redirect("/app/customers");
}

export async function createServiceAction(formData: FormData) {
  const { membership } = await requireTenantContext();
  assertCanManageBusiness(membership, "/app/services");
  assertBusinessScope(formData, membership.businessId);
  const input = serviceSchema.parse(formObject(formData));
  const admin = createSupabaseAdminClient();
  const { error } = await admin.rpc("rpc_create_service", {
    target_business_id: membership.businessId,
    service_name: input.name,
    service_duration_minutes: input.durationMinutes,
    service_default_price_cents: input.defaultPriceCents,
    service_is_active: input.isActive,
  });

  if (error) {
    redirect(`/app/services?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/app/services");
  redirect("/app/services");
}

export async function updateServiceAction(formData: FormData) {
  const { membership } = await requireTenantContext();
  assertCanManageBusiness(membership, "/app/services");
  assertBusinessScope(formData, membership.businessId);
  const input = serviceUpdateSchema.parse(formObject(formData));
  const admin = createSupabaseAdminClient();
  const { error } = await admin.rpc("rpc_update_service", {
    target_business_id: membership.businessId,
    target_service_id: input.serviceId,
    service_name: input.name,
    service_duration_minutes: input.durationMinutes,
    service_default_price_cents: input.defaultPriceCents,
    service_is_active: input.isActive,
  });

  if (error) {
    redirect(`/app/services?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/app/services");
  redirect("/app/services");
}

export async function deleteServiceAction(formData: FormData) {
  const { membership } = await requireTenantContext();
  assertCanManageBusiness(membership, "/app/services");
  assertBusinessScope(formData, membership.businessId);
  const input = deleteEntitySchema.parse({ id: formString(formData, "serviceId") });
  const admin = createSupabaseAdminClient();
  const { error } = await admin.rpc("rpc_delete_service", {
    target_business_id: membership.businessId,
    target_service_id: input.id,
  });

  if (error) {
    redirect(`/app/services?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/app/services");
  redirect("/app/services");
}

export async function createStaffAction(formData: FormData) {
  const { membership } = await requireTenantContext();
  assertCanManageBusiness(membership, "/app/staff");
  assertBusinessScope(formData, membership.businessId);
  const input = staffCreateSchema.parse(formObject(formData));
  const dataset = await getTenantDataset(membership);
  const staffCount =
    dataset.business.staffLimitScope === "branch"
      ? dataset.staffMembers.filter((staff) => staff.branchId === input.branchId)
          .length
      : dataset.staffMembers.length;

  if (staffCount >= dataset.business.staffLimitPerBranch) {
    redirect(
      `/app/staff?error=${encodeURIComponent("Bu paketin personel limiti dolu.")}`,
    );
  }

  const admin = createSupabaseAdminClient();
  const { data: userData, error: userError } =
    await admin.auth.admin.createUser({
      email: input.email,
      password: input.temporaryPassword,
      email_confirm: true,
      phone: input.phone,
      user_metadata: {
        first_name: input.firstName,
        last_name: input.lastName,
        phone: input.phone,
        force_password_change: input.forcePasswordChange,
        onboarding: "staff",
      },
    });

  if (userError || !userData.user) {
    redirect(
      `/app/staff?error=${encodeURIComponent(userError?.message ?? "Personel oluşturulamadı.")}`,
    );
  }

  const { error: profileError } = await admin.rpc("rpc_upsert_profile", {
    profile_id: userData.user.id,
    profile_first_name: input.firstName,
    profile_last_name: input.lastName,
    profile_email: input.email,
    profile_phone: input.phone,
    profile_avatar_url: null,
    profile_theme: "light",
    profile_must_change_password: input.forcePasswordChange,
  });

  if (profileError) {
    redirect(`/app/staff?error=${encodeURIComponent(profileError.message)}`);
  }

  const { error: rpcError } = await admin.rpc("rpc_create_staff_member", {
    target_business_id: membership.businessId,
    target_branch_id: input.branchId,
    staff_profile_id: userData.user.id,
    staff_role: input.role,
  });

  if (rpcError) {
    redirect(`/app/staff?error=${encodeURIComponent(rpcError.message)}`);
  }

  revalidatePath("/app/staff");
  redirect("/app/staff");
}

export async function updateStaffAction(formData: FormData) {
  const { membership } = await requireTenantContext();
  assertCanManageBusiness(membership, "/app/staff");
  assertBusinessScope(formData, membership.businessId);
  const input = staffUpdateSchema.parse(formObject(formData));
  const admin = createSupabaseAdminClient();
  const { error: authError } = await admin.auth.admin.updateUserById(
    input.profileId,
    {
      email: input.email,
      phone: input.phone,
      user_metadata: {
        first_name: input.firstName,
        last_name: input.lastName,
        phone: input.phone,
      },
    },
  );

  if (authError) {
    redirect(`/app/staff?error=${encodeURIComponent(authError.message)}`);
  }

  const { error: profileError } = await admin.rpc("rpc_upsert_profile", {
    profile_id: input.profileId,
    profile_first_name: input.firstName,
    profile_last_name: input.lastName,
    profile_email: input.email,
    profile_phone: input.phone,
    profile_avatar_url: null,
    profile_theme: "light",
    profile_must_change_password: false,
  });

  if (profileError) {
    redirect(`/app/staff?error=${encodeURIComponent(profileError.message)}`);
  }

  const { error } = await admin.rpc("rpc_update_staff_member", {
    target_business_id: membership.businessId,
    target_member_id: input.memberId,
    target_branch_id: input.branchId,
    staff_role: input.role,
  });

  if (error) {
    redirect(`/app/staff?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/app/staff");
  redirect("/app/staff");
}

export async function deleteStaffAction(formData: FormData) {
  const { membership } = await requireTenantContext();
  assertCanManageBusiness(membership, "/app/staff");
  assertBusinessScope(formData, membership.businessId);
  const input = deleteEntitySchema.parse({ id: formString(formData, "memberId") });
  const admin = createSupabaseAdminClient();
  const { error } = await admin.rpc("rpc_delete_staff_member", {
    target_business_id: membership.businessId,
    target_member_id: input.id,
  });

  if (error) {
    redirect(`/app/staff?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/app/staff");
  redirect("/app/staff");
}

export async function createBranchAction(formData: FormData) {
  const { membership } = await requireTenantContext();
  assertCanManageBusiness(membership, "/app/branches");
  assertBusinessScope(formData, membership.businessId);
  const input = branchSchema.parse(formObject(formData));
  const dataset = await getTenantDataset(membership);

  if (dataset.branches.length >= dataset.business.branchLimit) {
    redirect(
      `/app/branches?error=${encodeURIComponent("Bu paketin şube limiti dolu.")}`,
    );
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin.rpc("rpc_create_branch", {
    target_business_id: membership.businessId,
    branch_name: input.name,
    branch_phone: input.phone || "",
    branch_address: input.address || "",
  });

  if (error) {
    redirect(`/app/branches?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/app/branches");
  revalidatePath("/app/staff");
  redirect("/app/branches");
}

export async function updateBranchAction(formData: FormData) {
  const { membership } = await requireTenantContext();
  assertCanManageBusiness(membership, "/app/branches");
  assertBusinessScope(formData, membership.businessId);
  const input = branchUpdateSchema.parse(formObject(formData));
  const admin = createSupabaseAdminClient();
  const { error } = await admin.rpc("rpc_update_branch", {
    target_business_id: membership.businessId,
    target_branch_id: input.branchId,
    branch_name: input.name,
    branch_phone: input.phone || "",
    branch_address: input.address || "",
    target_is_active: input.isActive,
  });

  if (error) {
    redirect(`/app/branches?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/app/branches");
  revalidatePath("/app/staff");
  redirect("/app/branches");
}

export async function deleteBranchAction(formData: FormData) {
  const { membership } = await requireTenantContext();
  assertCanManageBusiness(membership, "/app/branches");
  assertBusinessScope(formData, membership.businessId);
  const input = deleteEntitySchema.parse({ id: formString(formData, "branchId") });
  const dataset = await getTenantDataset(membership);

  if (dataset.branches.length <= 1) {
    redirect(
      `/app/branches?error=${encodeURIComponent("En az bir aktif şube kalmalı.")}`,
    );
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin.rpc("rpc_delete_branch", {
    target_business_id: membership.businessId,
    target_branch_id: input.id,
  });

  if (error) {
    redirect(`/app/branches?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/app/branches");
  revalidatePath("/app/staff");
  redirect("/app/branches");
}

export async function updateStaffScheduleAction(formData: FormData) {
  const { membership } = await requireTenantContext();
  assertCanManageBusiness(membership, "/app/schedule");
  assertBusinessScope(formData, membership.businessId);
  const input = staffScheduleSchema.parse(formObject(formData));
  const admin = createSupabaseAdminClient();
  const { error } = await admin.rpc("rpc_upsert_staff_working_hour", {
    target_business_id: membership.businessId,
    target_member_id: input.memberId,
    schedule_weekday: input.weekday,
    schedule_starts_at: input.startsAt,
    schedule_ends_at: input.endsAt,
    schedule_is_available: input.isAvailable,
  });

  if (error) {
    redirect(`/app/staff/schedule?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/app/staff/schedule");
  redirect("/app/staff/schedule");
}

export async function createProductAction(formData: FormData) {
  const { membership } = await requireTenantContext();
  assertCanManageBusiness(membership, "/app/stock");
  assertBusinessScope(formData, membership.businessId);
  await assertModuleEnabled(membership, "stock", "/app/settings");
  const input = productCreateSchema.parse(formObject(formData));
  const admin = createSupabaseAdminClient();
  const { error } = await admin.rpc("rpc_create_product_with_stock", {
    target_business_id: membership.businessId,
    target_branch_id: input.branchId,
    product_name: input.name,
    product_unit: input.unit,
    product_critical_stock: input.criticalStock,
    product_sale_price_cents: input.salePriceCents,
    movement_quantity: input.openingQuantity,
    movement_reason: input.reason,
  });

  if (error) {
    redirect(`/app/stock?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/app/stock");
  redirect("/app/stock");
}

export async function updateProductAction(formData: FormData) {
  const { membership } = await requireTenantContext();
  assertCanManageBusiness(membership, "/app/stock");
  assertBusinessScope(formData, membership.businessId);
  await assertModuleEnabled(membership, "stock", "/app/settings");
  const input = productUpdateSchema.parse(formObject(formData));
  const admin = createSupabaseAdminClient();
  const { error } = await admin.rpc("rpc_update_product", {
    target_business_id: membership.businessId,
    target_product_id: input.productId,
    product_name: input.name,
    product_unit: input.unit,
    product_critical_stock: input.criticalStock,
    product_sale_price_cents: input.salePriceCents,
  });

  if (error) {
    redirect(`/app/stock?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/app/stock");
  redirect("/app/stock");
}

export async function deleteProductAction(formData: FormData) {
  const { membership } = await requireTenantContext();
  assertCanManageBusiness(membership, "/app/stock");
  assertBusinessScope(formData, membership.businessId);
  await assertModuleEnabled(membership, "stock", "/app/settings");
  const input = deleteEntitySchema.parse({ id: formString(formData, "productId") });
  const admin = createSupabaseAdminClient();
  const { error } = await admin.rpc("rpc_delete_product", {
    target_business_id: membership.businessId,
    target_product_id: input.id,
  });

  if (error) {
    redirect(`/app/stock?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/app/stock");
  redirect("/app/stock");
}

export async function createIncomeExpenseAction(formData: FormData) {
  const { membership } = await requireTenantContext();
  assertCanManageBusiness(membership, "/app/finance");
  assertBusinessScope(formData, membership.businessId);
  await assertModuleEnabled(membership, "finance", "/app/settings");
  const input = incomeExpenseSchema.parse(formObject(formData));
  const admin = createSupabaseAdminClient();
  const { error } = await admin.rpc("rpc_record_income_expense", {
    target_business_id: membership.businessId,
    target_branch_id: input.branchId,
    entry_type: input.type,
    entry_category: input.category,
    entry_amount_cents: input.amountCents,
    entry_source: input.source,
    entry_occurred_at: input.occurredAt,
    entry_note: input.note ?? "",
  });

  if (error) {
    redirect(`/app/finance?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/app/finance");
  redirect("/app/finance");
}

export async function updateIncomeExpenseAction(formData: FormData) {
  const { membership } = await requireTenantContext();
  assertCanManageBusiness(membership, "/app/finance");
  assertBusinessScope(formData, membership.businessId);
  await assertModuleEnabled(membership, "finance", "/app/settings");
  const input = incomeExpenseUpdateSchema.parse(formObject(formData));
  const admin = createSupabaseAdminClient();
  const { error } = await admin.rpc("rpc_update_income_expense", {
    target_business_id: membership.businessId,
    target_entry_id: input.financeId,
    target_branch_id: input.branchId,
    entry_type: input.type,
    entry_category: input.category,
    entry_amount_cents: input.amountCents,
    entry_source: input.source,
    entry_occurred_at: input.occurredAt,
    entry_note: input.note ?? "",
  });

  if (error) {
    redirect(`/app/finance?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/app/finance");
  redirect("/app/finance");
}

export async function deleteIncomeExpenseAction(formData: FormData) {
  const { membership } = await requireTenantContext();
  assertCanManageBusiness(membership, "/app/finance");
  assertBusinessScope(formData, membership.businessId);
  await assertModuleEnabled(membership, "finance", "/app/settings");
  const input = deleteEntitySchema.parse({ id: formString(formData, "financeId") });
  const admin = createSupabaseAdminClient();
  const { error } = await admin.rpc("rpc_delete_income_expense", {
    target_business_id: membership.businessId,
    target_entry_id: input.id,
  });

  if (error) {
    redirect(`/app/finance?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/app/finance");
  redirect("/app/finance");
}

export async function createAppointmentAction(formData: FormData) {
  const { user, membership } = await requireTenantContext();
  assertBusinessScope(formData, membership.businessId);
  const input = appointmentFormSchema.parse(formObject(formData));
  const targetBranchId = isStaffMembership(membership)
    ? membership.branchId
    : input.branchId;
  const targetStaffId = isStaffMembership(membership)
    ? membership.memberId
    : input.staffId;

  if (isStaffMembership(membership)) {
    const dataset = await getTenantDataset(membership);

    if (!dataset.customers.some((item) => item.id === input.customerId)) {
      redirect("/app/calendar?error=yetkisiz-musteri");
    }
  }

  await assertAppointmentAvailability({
    membership,
    startsAt: input.startsAt,
    staffId: targetStaffId,
    serviceId: input.serviceId,
  });
  const admin = createSupabaseAdminClient();
  const { error } = await admin.rpc("rpc_create_appointment", {
    target_business_id: membership.businessId,
    target_branch_id: targetBranchId,
    target_customer_id: input.customerId,
    target_staff_member_id: targetStaffId,
    target_service_id: input.serviceId,
    appointment_starts_at: input.startsAt,
    appointment_status: input.status,
    appointment_note: input.note ?? "",
    actor_profile_id: user.profile.id,
  });

  if (error) {
    redirect(`/app/calendar?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/app");
  revalidatePath("/app/calendar");
  revalidatePath("/app/finance");
  redirect("/app/calendar");
}

export async function updateAppointmentAction(formData: FormData) {
  const { user, membership } = await requireTenantContext();
  assertBusinessScope(formData, membership.businessId);
  assertCanManageBusiness(membership, "/app/calendar");
  const input = appointmentUpdateSchema.parse(formObject(formData));
  const targetBranchId = isStaffMembership(membership)
    ? membership.branchId
    : input.branchId;
  const targetStaffId = isStaffMembership(membership)
    ? membership.memberId
    : input.staffId;

  await assertAppointmentAvailability({
    membership,
    startsAt: input.startsAt,
    staffId: targetStaffId,
    serviceId: input.serviceId,
    ignoredAppointmentId: input.appointmentId,
  });
  const admin = createSupabaseAdminClient();
  const { error } = await admin.rpc("rpc_update_appointment", {
    target_business_id: membership.businessId,
    target_appointment_id: input.appointmentId,
    target_branch_id: targetBranchId,
    target_customer_id: input.customerId,
    target_staff_member_id: targetStaffId,
    target_service_id: input.serviceId,
    appointment_starts_at: input.startsAt,
    appointment_status: input.status,
    appointment_note: input.note ?? "",
    actor_profile_id: user.profile.id,
  });

  if (error) {
    redirect(`/app/calendar?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/app");
  revalidatePath("/app/calendar");
  revalidatePath("/app/finance");
  redirect("/app/calendar");
}

export async function updateAppointmentStatusAction(formData: FormData) {
  const { user, membership } = await requireTenantContext();
  assertBusinessScope(formData, membership.businessId);
  const input = appointmentStatusUpdateSchema.parse(formObject(formData));
  const returnDate = formString(formData, "returnDate");
  const returnPath = /^\d{4}-\d{2}-\d{2}$/.test(returnDate)
    ? `/app/daily?date=${returnDate}`
    : "/app/daily";
  const returnPathWithError = (message: string) =>
    `${returnPath}${returnPath.includes("?") ? "&" : "?"}error=${encodeURIComponent(message)}`;
  const dataset = await getTenantDataset(membership);
  const appointment = dataset.appointments.find(
    (item) => item.id === input.appointmentId,
  );

  if (!appointment) {
    redirect(returnPathWithError("yetkisiz-randevu"));
  }

  if (isStaffMembership(membership) && appointment.staffId !== membership.memberId) {
    redirect(returnPathWithError("yetkisiz-randevu"));
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin.rpc("rpc_update_appointment_status", {
    target_business_id: membership.businessId,
    target_appointment_id: input.appointmentId,
    appointment_status: input.status,
    actor_profile_id: user.profile.id,
  });

  if (error) {
    redirect(returnPathWithError(error.message));
  }

  revalidatePath("/app");
  revalidatePath("/app/calendar");
  revalidatePath("/app/daily");
  revalidatePath("/app/finance");
  redirect(returnPath);
}

export async function deleteAppointmentAction(formData: FormData) {
  const { user, membership } = await requireTenantContext();
  assertCanManageBusiness(membership, "/app/calendar");
  assertBusinessScope(formData, membership.businessId);
  const input = deleteEntitySchema.parse({
    id: formString(formData, "appointmentId"),
  });
  const admin = createSupabaseAdminClient();
  const { error } = await admin.rpc("rpc_delete_appointment", {
    target_business_id: membership.businessId,
    target_appointment_id: input.id,
    actor_profile_id: user.profile.id,
  });

  if (error) {
    redirect(`/app/calendar?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/app");
  revalidatePath("/app/calendar");
  revalidatePath("/app/finance");
  redirect("/app/calendar");
}

export async function updateBusinessSettingsAction(formData: FormData) {
  const { membership } = await requireTenantContext();
  assertCanManageBusiness(membership, "/app/settings");
  assertBusinessScope(formData, membership.businessId);
  const input = businessSettingsSchema.parse(formObject(formData));
  const admin = createSupabaseAdminClient();
  const { error } = await admin.rpc("rpc_update_business_settings", {
    target_business_id: membership.businessId,
    business_name: input.name,
    business_opens_at: input.opensAt,
    business_closes_at: input.closesAt,
  });

  if (error) {
    redirect(`/app/settings?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/app/settings");
  redirect(`/app/settings?success=${encodeURIComponent("İşletme ayarları güncellendi.")}`);
}

export async function toggleModuleAction(formData: FormData) {
  const { membership } = await requireTenantContext();
  assertCanManageBusiness(membership, "/app/settings");
  assertBusinessScope(formData, membership.businessId);
  const input = moduleToggleSchema.parse(formObject(formData));
  const admin = createSupabaseAdminClient();
  const { error } = await admin.rpc("rpc_toggle_business_module", {
    target_business_id: membership.businessId,
    target_module: input.moduleKey,
    target_enabled: input.enabled,
  });

  if (error) {
    redirect(`/app/settings?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/app/settings");
  revalidatePath("/app");
  redirect(`/app/settings?success=${encodeURIComponent("Modül durumu güncellendi.")}`);
}

export async function updateProfileAction(formData: FormData) {
  const { profile, tenantMembership } = await requireUserContext();

  if (tenantMembership && isStaffMembership(tenantMembership)) {
    redirect("/app/calendar");
  }

  assertUuid(formString(formData, "profileId"), "Profil");
  const input = profileSchema.parse(formObject(formData));
  const admin = createSupabaseAdminClient();
  const { error } = await admin.rpc("rpc_upsert_profile", {
    profile_id: profile.id,
    profile_first_name: input.firstName,
    profile_last_name: input.lastName,
    profile_email: input.email,
    profile_phone: input.phone,
    profile_avatar_url: input.avatarUrl || null,
    profile_theme: input.theme,
    profile_must_change_password: false,
  });

  if (error) {
    redirect(`/app/profile?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/app/profile");
  redirect(`/app/profile?success=${encodeURIComponent("Profil güncellendi.")}`);
}
