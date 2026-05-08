import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.SUPER_ADMIN_EMAIL;
const password = process.env.SUPER_ADMIN_PASSWORD;

if (!supabaseUrl || !serviceRoleKey || !email || !password) {
  throw new Error(
    "SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPER_ADMIN_EMAIL ve SUPER_ADMIN_PASSWORD zorunludur.",
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function findUserByEmail(targetEmail) {
  const perPage = 1000;
  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage,
  });

  if (error) {
    throw error;
  }

  return data.users.find(
    (user) =>
      user.email?.toLocaleLowerCase("tr-TR") ===
      targetEmail.toLocaleLowerCase("tr-TR"),
  );
}

const existingUser = await findUserByEmail(email);
const userResult = existingUser
  ? await supabase.auth.admin.updateUserById(existingUser.id, {
      password,
      email_confirm: true,
      user_metadata: {
        ...(existingUser.user_metadata ?? {}),
        first_name: "Emre",
        last_name: "CB",
        onboarding: "super_admin",
      },
    })
  : await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: "Emre",
        last_name: "CB",
        onboarding: "super_admin",
      },
    });

if (userResult.error || !userResult.data.user) {
  throw (
    userResult.error ??
    new Error("Super admin auth kullanıcısı oluşturulamadı.")
  );
}

const user = userResult.data.user;

const { error: bootstrapError } = await supabase.rpc(
  "rpc_bootstrap_super_admin",
  {
    super_profile_id: user.id,
    super_email: email,
    super_first_name: "Emre",
    super_last_name: "CB",
  },
);

if (bootstrapError) {
  throw bootstrapError;
}

console.log(`Super admin hazır: ${email}`);
