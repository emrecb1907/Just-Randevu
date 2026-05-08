import { describe, expect, it } from "vitest";

import { navigation, systemNavigation } from "@/lib/product-model";

describe("Role navigation boundaries", () => {
  it("keeps super admin away from tenant operation modules", () => {
    const systemHrefs = systemNavigation.map((item) => item.href);

    expect(systemHrefs).toEqual(["/app", "/app/super-admin"]);
    expect(systemHrefs).not.toContain("/app/stock");
    expect(systemHrefs).not.toContain("/app/finance");
    expect(systemHrefs).not.toContain("/app/customers");
  });

  it("keeps tenant navigation focused on business operations", () => {
    const tenantHrefs = navigation.map((item) => item.href);

    expect(tenantHrefs).toContain("/app/calendar");
    expect(tenantHrefs).toContain("/app/customers");
    expect(tenantHrefs).toContain("/app/staff");
    expect(tenantHrefs).not.toContain("/app/super-admin");
  });
});
