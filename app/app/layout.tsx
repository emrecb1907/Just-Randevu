import type { ReactNode } from "react";

import { AppShell } from "@/components/app-shell";
import { getTenantDataset, requireUserContext } from "@/lib/app-data";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const context = await requireUserContext();
  const currentUserName =
    `${context.profile.firstName} ${context.profile.lastName}`.trim() ||
    "Just Randevu";
  const activeModules =
    context.tenantMembership && !context.isSuperAdmin
      ? (await getTenantDataset(context.tenantMembership)).activeModules
      : [];

  return (
    <AppShell
      businessName={context.tenantMembership?.businessName ?? "Just Randevu"}
      currentUserName={currentUserName}
      currentUserEmail={context.profile.email}
      isSuperAdmin={context.isSuperAdmin}
      activeModules={activeModules}
    >
      {children}
    </AppShell>
  );
}
