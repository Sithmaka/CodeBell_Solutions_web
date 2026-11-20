import { describe, expect, it } from "vitest";
import { INITIAL_LEAD_FORM, validateLeadForm } from "./leadForm";

function valid(overrides = {}) {
  return {
    ...INITIAL_LEAD_FORM,
    name: "Test Contact",
    email: "test@example.com",
    country: "Sri Lanka",
    service: "custom_software",
    projectDescription: "A non-production test requirement with enough detail.",
    privacyAcknowledged: true,
    ...overrides,
  };
}

describe("lead form validation", () => {
  it("accepts a minimal email enquiry", () => expect(validateLeadForm(valid())).toEqual({}));
  it("requires phone for WhatsApp", () => expect(validateLeadForm(valid({ preferredContactMethod: "whatsapp" })).phone).toBeTruthy());
  it("rejects missing consent and short descriptions", () => {
    const errors = validateLeadForm(valid({ privacyAcknowledged: false, projectDescription: "Too short" }));
    expect(errors.privacyAcknowledged).toBeTruthy();
    expect(errors.projectDescription).toBeTruthy();
  });
});
