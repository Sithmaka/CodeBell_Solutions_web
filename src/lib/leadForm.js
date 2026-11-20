export const INITIAL_LEAD_FORM = Object.freeze({
  name: "",
  email: "",
  phone: "",
  companyName: "",
  country: "",
  service: "",
  projectDescription: "",
  preferredContactMethod: "email",
  budgetRange: "",
  budgetCurrency: "USD",
  timeline: "",
  existingSystemUrl: "",
  privacyAcknowledged: false,
  marketingOptIn: false,
  website: "",
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateLeadForm(form) {
  const errors = {};
  if (!form.name.trim() || form.name.trim().length < 2) errors.name = "Enter your full name.";
  if (!EMAIL_RE.test(form.email.trim())) errors.email = "Enter a valid email address.";
  if (!form.country.trim()) errors.country = "Enter your country.";
  if (!form.service) errors.service = "Select the service you need.";
  if (form.projectDescription.trim().length < 30) {
    errors.projectDescription = "Describe the requirement in at least 30 characters.";
  }
  if (!["email", "phone", "whatsapp"].includes(form.preferredContactMethod)) {
    errors.preferredContactMethod = "Choose a contact method.";
  }
  if (["phone", "whatsapp"].includes(form.preferredContactMethod) && !form.phone.trim()) {
    errors.phone = "A phone number is required for this contact method.";
  }
  if (form.existingSystemUrl) {
    try {
      const url = new URL(form.existingSystemUrl);
      if (!["http:", "https:"].includes(url.protocol)) throw new Error("protocol");
    } catch {
      errors.existingSystemUrl = "Enter a complete URL beginning with https://.";
    }
  }
  if (!form.privacyAcknowledged) errors.privacyAcknowledged = "Please acknowledge the privacy notice.";
  return errors;
}
