import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

function loadEnvFile(path) {
  const content = readFileSync(path, "utf8");

  for (const line of content.split("\n")) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...valueParts] = trimmed.split("=");
    const value = valueParts.join("=").replace(/^['"]|['"]$/g, "");
    process.env[key] ??= value;
  }
}

loadEnvFile(".env.local");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;

if (!supabaseUrl || !anonKey || !serviceRoleKey) {
  throw new Error("Supabase environment variables are missing.");
}

if (!superAdminEmail || !superAdminPassword) {
  throw new Error("SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD are required.");
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

function authClient() {
  return createClient(supabaseUrl, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function assertNoError(label, result) {
  if (result.error) {
    throw new Error(`${label}: ${result.error.message}`);
  }

  return result.data;
}

async function createAuthUser(email, password, firstName, lastName, phone) {
  const { data: existing } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  const existingUser = existing?.users.find((user) => user.email === email);

  const result = existingUser
    ? await admin.auth.admin.updateUserById(existingUser.id, {
        email,
        password,
        email_confirm: true,
        phone,
        user_metadata: { first_name: firstName, last_name: lastName, phone },
      })
    : await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        phone,
        user_metadata: { first_name: firstName, last_name: lastName, phone },
      });

  const user = await assertNoError(`auth user ${email}`, result);

  await assertNoError(
    `profile ${email}`,
    await admin.rpc("rpc_upsert_profile", {
      profile_id: user.user.id,
      profile_first_name: firstName,
      profile_last_name: lastName,
      profile_email: email,
      profile_phone: phone,
      profile_avatar_url: null,
      profile_theme: "system",
      profile_must_change_password: false,
    }),
  );

  return user.user;
}

const stamp = Date.now();
const adminEmail = `e2e.admin.${stamp}@justrandevu.test`;
const staffEmail = `e2e.staff.${stamp}@justrandevu.test`;
const adminPassword = "AdminTest12!!";
const staffPassword = "StaffTest12!!";

await assertNoError(
  "super admin login",
  await authClient().auth.signInWithPassword({
    email: superAdminEmail,
    password: superAdminPassword,
  }),
);

const owner = await createAuthUser(
  adminEmail,
  adminPassword,
  "E2E",
  "Admin",
  "+905551112233",
);

const businessId = await assertNoError(
  "create business",
  await admin.rpc("rpc_create_business_with_owner", {
    owner_profile_id: owner.id,
    business_name: `E2E İşletme ${stamp}`,
    business_email: adminEmail,
    business_phone: "+905551112233",
    selected_plan: "premium",
    selected_slot_minutes: 15,
  }),
);

await assertNoError(
  "tenant admin login",
  await authClient().auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword,
  }),
);

let context = await assertNoError(
  "app context",
  await admin.rpc("rpc_get_app_context", { target_business_id: businessId }),
);
const branchId = context.branches[0].id;

const customerId = await assertNoError(
  "create customer",
  await admin.rpc("rpc_create_customer", {
    target_business_id: businessId,
    target_branch_id: branchId,
    customer_first_name: "Ayşe",
    customer_last_name: "Deneme",
    customer_phone: "+905551112244",
    customer_email: "ayse@example.com",
    customer_notes: "İlk kayıt",
    customer_kvkk_consent: true,
    customer_whatsapp_consent: true,
  }),
);

await assertNoError(
  "update customer",
  await admin.rpc("rpc_update_customer", {
    target_business_id: businessId,
    target_customer_id: customerId,
    target_branch_id: branchId,
    customer_first_name: "Ayşe",
    customer_last_name: "Güncel",
    customer_phone: "+905551112244",
    customer_email: "ayse.guncel@example.com",
    customer_notes: "Güncellendi",
    customer_kvkk_consent: true,
    customer_whatsapp_consent: false,
  }),
);

const serviceId = await assertNoError(
  "create service",
  await admin.rpc("rpc_create_service", {
    target_business_id: businessId,
    service_name: `E2E Hizmet ${stamp}`,
    service_category: "Test",
    service_duration_minutes: 30,
    service_default_price_cents: 75000,
    service_is_active: true,
  }),
);

await assertNoError(
  "update service",
  await admin.rpc("rpc_update_service", {
    target_business_id: businessId,
    target_service_id: serviceId,
    service_name: `E2E Hizmet Güncel ${stamp}`,
    service_category: "Test",
    service_duration_minutes: 45,
    service_default_price_cents: 90000,
    service_is_active: true,
  }),
);

const staff = await createAuthUser(
  staffEmail,
  staffPassword,
  "E2E",
  "Personel",
  "+905551112255",
);

const staffMemberId = await assertNoError(
  "create staff",
  await admin.rpc("rpc_create_staff_member", {
    target_business_id: businessId,
    target_branch_id: branchId,
    staff_profile_id: staff.id,
    staff_role: "admin",
  }),
);

await assertNoError(
  "tenant staff login",
  await authClient().auth.signInWithPassword({
    email: staffEmail,
    password: staffPassword,
  }),
);

await assertNoError(
  "update staff",
  await admin.rpc("rpc_update_staff_member", {
    target_business_id: businessId,
    target_member_id: staffMemberId,
    target_branch_id: branchId,
    staff_role: "staff",
  }),
);

const productId = await assertNoError(
  "create product",
  await admin.rpc("rpc_create_product_with_stock", {
    target_business_id: businessId,
    target_branch_id: branchId,
    product_name: `E2E Ürün ${stamp}`,
    product_unit: "adet",
    product_critical_stock: 3,
    product_sale_price_cents: 25000,
    movement_quantity: 10,
    movement_reason: "E2E açılış",
  }),
);

await assertNoError(
  "update product",
  await admin.rpc("rpc_update_product", {
    target_business_id: businessId,
    target_product_id: productId,
    product_name: `E2E Ürün Güncel ${stamp}`,
    product_unit: "adet",
    product_critical_stock: 4,
    product_sale_price_cents: 27500,
  }),
);

const financeId = await assertNoError(
  "create finance",
  await admin.rpc("rpc_record_income_expense", {
    target_business_id: businessId,
    target_branch_id: branchId,
    entry_type: "gelir",
    entry_category: "E2E Manuel",
    entry_amount_cents: 120000,
    entry_source: "manual",
    entry_occurred_at: new Date().toISOString(),
    entry_note: "E2E kayıt",
  }),
);

await assertNoError(
  "update finance",
  await admin.rpc("rpc_update_income_expense", {
    target_business_id: businessId,
    target_entry_id: financeId,
    target_branch_id: branchId,
    entry_type: "gider",
    entry_category: "E2E Güncel",
    entry_amount_cents: 30000,
    entry_source: "manual",
    entry_occurred_at: new Date().toISOString(),
    entry_note: "Güncel",
  }),
);

const startsAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
const appointmentId = await assertNoError(
  "create appointment",
  await admin.rpc("rpc_create_appointment", {
    target_business_id: businessId,
    target_branch_id: branchId,
    target_customer_id: customerId,
    target_staff_member_id: staffMemberId,
    target_service_id: serviceId,
    appointment_starts_at: startsAt,
    appointment_status: "bekliyor",
    appointment_note: "E2E randevu",
    actor_profile_id: owner.id,
  }),
);

await assertNoError(
  "complete appointment",
  await admin.rpc("rpc_update_appointment", {
    target_business_id: businessId,
    target_appointment_id: appointmentId,
    target_branch_id: branchId,
    target_customer_id: customerId,
    target_staff_member_id: staffMemberId,
    target_service_id: serviceId,
    appointment_starts_at: startsAt,
    appointment_status: "tamamlandı",
    appointment_note: "E2E tamamlandı",
    actor_profile_id: owner.id,
  }),
);

context = await assertNoError(
  "appointment finance sync",
  await admin.rpc("rpc_get_app_context", { target_business_id: businessId }),
);
const financeRows = context.income_expenses.filter(
  (entry) => entry.appointment_id === appointmentId,
);

if (financeRows.length !== 1 || financeRows[0].source !== "appointment") {
  throw new Error("appointment finance sync did not create exactly one row");
}

context = await assertNoError(
  "app context after appointment",
  await admin.rpc("rpc_get_app_context", { target_business_id: businessId }),
);

if (context.appointments[0]?.service_id !== serviceId) {
  throw new Error("app context does not expose appointment service_id");
}

await assertNoError(
  "delete appointment",
  await admin.rpc("rpc_delete_appointment", {
    target_business_id: businessId,
    target_appointment_id: appointmentId,
  }),
);
await assertNoError(
  "delete finance",
  await admin.rpc("rpc_delete_income_expense", {
    target_business_id: businessId,
    target_entry_id: financeId,
  }),
);
await assertNoError(
  "delete product",
  await admin.rpc("rpc_delete_product", {
    target_business_id: businessId,
    target_product_id: productId,
  }),
);
await assertNoError(
  "delete service",
  await admin.rpc("rpc_delete_service", {
    target_business_id: businessId,
    target_service_id: serviceId,
  }),
);
await assertNoError(
  "delete staff",
  await admin.rpc("rpc_delete_staff_member", {
    target_business_id: businessId,
    target_member_id: staffMemberId,
  }),
);
await assertNoError(
  "delete customer",
  await admin.rpc("rpc_delete_customer", {
    target_business_id: businessId,
    target_customer_id: customerId,
  }),
);
await assertNoError(
  "super admin update business",
  await admin.rpc("rpc_super_admin_update_business", {
    target_business_id: businessId,
    business_name: `E2E İşletme Güncel ${stamp}`,
    business_email: adminEmail,
    business_phone: "+905551112233",
    selected_plan: "premium",
    selected_slot_minutes: 10,
    target_is_active: true,
  }),
);
await assertNoError(
  "super admin delete business",
  await admin.rpc("rpc_super_admin_delete_business", {
    target_business_id: businessId,
  }),
);

console.log(
  JSON.stringify(
    {
      ok: true,
      businessId,
      adminEmail,
      staffEmail,
      checked: [
        "super_admin_login",
        "tenant_admin_login",
        "staff_login",
        "customer_crud",
        "service_crud",
        "staff_crud",
        "product_crud",
        "finance_crud",
        "appointment_crud",
        "appointment_finance_sync",
        "super_admin_business_crud",
      ],
    },
    null,
    2,
  ),
);
