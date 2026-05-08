import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

describe("Runtime data discipline", () => {
  it("does not keep a mock-data module in the app", () => {
    expect(existsSync(join(root, "lib/mock-data.ts"))).toBe(false);
  });

  it("does not import mock data from runtime source files", () => {
    const files = [
      "lib/app-data.ts",
      "components/calendar-board.tsx",
      "components/staff-density-board.tsx",
      "app/app/page.tsx",
    ];

    files.forEach((fileName) => {
      const content = readFileSync(join(root, fileName), "utf8");
      expect(content).not.toContain("mock-data");
      expect(content).not.toContain("Just Demo");
    });
  });
});
