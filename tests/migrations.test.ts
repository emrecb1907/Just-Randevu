import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

function readSchemaDir(dirName: string) {
  const dir = join(root, "supabase/schemas", dirName);
  return readdirSync(dir)
    .filter((fileName) => fileName.endsWith(".sql"))
    .map((fileName) => readFileSync(join(dir, fileName), "utf8"))
    .join("\n");
}

function listSqlFiles(dir: string): string[] {
  return readdirSync(dir)
    .flatMap((fileName) => {
      const filePath = join(dir, fileName);

      return statSync(filePath).isDirectory()
        ? listSqlFiles(filePath)
        : filePath.endsWith(".sql")
          ? [filePath]
          : [];
    })
    .sort();
}

describe("Supabase declarative schema", () => {
  it("keeps RPC lifecycle functions in their own schema files", () => {
    const sql = `${readSchemaDir("functions")}\n${readSchemaDir("grants")}`;

    [
      "rpc_get_app_context",
      "rpc_get_user_context",
      "rpc_get_system_context",
      "rpc_upsert_profile",
      "rpc_bootstrap_super_admin",
      "rpc_create_business_with_owner",
      "rpc_create_branch",
      "rpc_create_staff_member",
      "rpc_create_customer",
      "rpc_create_service",
      "rpc_record_income_expense",
      "rpc_create_product_with_stock",
      "rpc_update_business_settings",
      "rpc_toggle_business_module",
      "rpc_create_appointment",
      "rpc_update_appointment",
      "rpc_delete_appointment",
      "rpc_delete_branch",
      "rpc_update_customer",
      "rpc_delete_customer",
      "rpc_update_service",
      "rpc_delete_service",
      "rpc_update_staff_member",
      "rpc_delete_staff_member",
      "rpc_update_product",
      "rpc_delete_product",
      "rpc_update_income_expense",
      "rpc_delete_income_expense",
      "rpc_super_admin_update_business",
      "rpc_super_admin_delete_business",
      "rpc_super_admin_update_plan",
      "rpc_update_branch",
      "rpc_upsert_staff_working_hour",
    ].forEach((functionName) => {
      expect(sql).toContain(`function public.${functionName}`);
    });

    expect(sql).toContain("revoke execute on function");
    expect(sql).toContain("grant execute on function");
  });

  it("includes every schema SQL file in the ordered Supabase schema list", () => {
    const config = readFileSync(join(root, "supabase/config.toml"), "utf8");
    const listedFiles = Array.from(
      config.matchAll(/"\.\/schemas\/([^"]+)"/g),
      (match) => join(root, "supabase/schemas", match[1] ?? ""),
    ).sort();
    const schemaFiles = listSqlFiles(join(root, "supabase/schemas"));

    expect(listedFiles.filter((filePath) => !existsSync(filePath))).toEqual([]);
    expect(schemaFiles.filter((filePath) => !listedFiles.includes(filePath))).toEqual([]);
  });

  it("keeps tenant RLS policies and tenant keys in declarative schema files", () => {
    const tableSql = readSchemaDir("tables");
    const policies = readSchemaDir("policies");

    expect(tableSql).toContain("business_id uuid not null");
    expect(tableSql).toContain("enable row level security");
    expect(policies).toContain("app_private.is_business_member");
    expect(policies).toContain("app_private.is_super_admin");
  });

  it("keeps super admin platform context separate from tenant operation data", () => {
    const sql = readFileSync(
      join(root, "supabase/schemas/functions/rpc_get_system_context.sql"),
      "utf8",
    );

    expect(sql).toContain("bm.role <> 'super_admin'");
    expect(sql).toContain("where b.name <> 'Just Randevu Sistem'");
    expect(sql).toContain("'businesses'");
    expect(sql).toContain("'subscriptions'");
    expect(sql).toContain("'payments'");
    expect(sql).toContain("'price_snapshot_cents'");
  });

  it("keeps subscription prices fixed at the subscription creation amount", () => {
    const tableSql = readSchemaDir("tables");
    const functionSql = readSchemaDir("functions");

    expect(tableSql).toContain("price_snapshot_cents integer not null");
    expect(functionSql).toContain("price_snapshot_cents");
    expect(functionSql).toContain("p.monthly_price_cents");
  });

  it("keeps appointment prices fixed when the same service is edited later", () => {
    const sql = readFileSync(
      join(root, "supabase/schemas/functions/rpc_update_appointment.sql"),
      "utf8",
    );

    expect(sql).toContain("old_price_cents");
    expect(sql).toContain("effective_price_cents := coalesce(old_price_cents");
    expect(sql).toContain("total_price_cents = effective_price_cents");
  });

  it("enforces staff limits in the staff creation RPC", () => {
    const sql = readFileSync(
      join(root, "supabase/schemas/functions/rpc_create_staff_member.sql"),
      "utf8",
    );

    expect(sql).toContain("p.staff_limit");
    expect(sql).toContain("p.staff_limit_scope");
    expect(sql).toContain("Bu paketin personel limiti dolu.");
  });
});
