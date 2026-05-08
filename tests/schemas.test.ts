import { describe, expect, it } from "vitest";

import {
  businessRegistrationSchema,
  customerSchema,
  moneyCentsSchema,
  serviceSchema,
  turkishPhoneSchema,
} from "@/lib/schemas";

describe("Zod validation rules", () => {
  it("normalizes Turkish phone numbers to +90", () => {
    expect(turkishPhoneSchema.parse("0534 343 54 32")).toBe("+905343435432");
    expect(turkishPhoneSchema.parse("5343435432")).toBe("+905343435432");
    expect(turkishPhoneSchema.parse("+90 534 343 54 32")).toBe("+905343435432");
  });

  it("stores money as integer cents", () => {
    expect(moneyCentsSchema.parse("1.199")).toBe(119900);
    expect(moneyCentsSchema.parse("2499,50")).toBe(249950);
  });

  it("requires KVKK consent for customer and business onboarding", () => {
    expect(() =>
      customerSchema.parse({
        firstName: "Müşteri",
        lastName: "Kaydı",
        phone: "05343435432",
        whatsappConsent: false,
      }),
    ).toThrow();

    expect(
      businessRegistrationSchema.parse({
        businessName: "Test İşletmesi",
        ownerName: "Yetkili Kullanıcı",
        email: "yetkili@example.com",
        phone: "05343435432",
        password: "12Tz1993!!",
        plan: "premium",
        kvkkConsent: "on",
      }).phone,
    ).toBe("+905343435432");
  });

  it("coerces service form values from browser payloads", () => {
    const parsed = serviceSchema.parse({
      name: "Hizmet Kaydı",
      category: "Kategori",
      durationMinutes: "40",
      defaultPriceCents: "650",
      isActive: "true",
    });

    expect(parsed.durationMinutes).toBe(40);
    expect(parsed.defaultPriceCents).toBe(65000);
    expect(parsed.isActive).toBe(true);
  });
});
