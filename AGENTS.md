# Just Randevu Agent Notes

This repo uses a schema-file Supabase structure, not a migration-file workflow.

## Supabase Rules

- Do not create ad hoc local migration folders or migration files such as `supabase/migrations/*` or `supabase/schemas/migrations/*`.
- Local database changes must be distributed into the existing structure:
  - Tables: `supabase/schemas/tables/*.sql`
  - Functions/RPCs: `supabase/schemas/functions/*.sql`
  - Triggers: `supabase/schemas/triggers/*.sql`
  - Policies: `supabase/schemas/policies/*.sql`
  - Indexes: `supabase/schemas/indexes/*.sql`
  - Grants: `supabase/schemas/grants/*.sql`
- If a new schema file is added, also update `supabase/config.toml` so it is included in the ordered schema list.
- For live Supabase changes, update the local schema files first, then apply the equivalent SQL through Supabase MCP.
- After creating or replacing `security definer` RPC functions, make sure execute privileges remain restricted according to `supabase/schemas/grants/rpc_execute.sql`.
- Run Supabase advisors after DDL or privilege changes and report remaining warnings.

## Product Rules

- Prices copied into appointments or subscriptions are snapshots. Later service/package price changes must not rewrite historical appointment or subscription amounts.
- Avoid technical wording in user-facing UI. Do not show implementation terms such as "snapshot" to customers or business users.
- Turkish UI text should be consistent across pages. Prefer clear business language such as "Hizmet", "Paket", "İşletme", "Randevu", and "Personel".

## Verification

- Before handing off UI/database work, run:
  - `npm run typecheck`
  - `npm run lint`
  - `npm run test`
- Do not use the in-app Browser plugin or Google/Chrome DevTools MCP unless the user explicitly asks for it.
- When the user explicitly asks for browser-based verification, use the requested browser tool at the affected viewport sizes.
- Clean up test data created during verification unless the user explicitly asks to keep it.
