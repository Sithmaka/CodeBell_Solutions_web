export const BRAND_ID = "codebell_development";

export const SERVICES = Object.freeze([
  { id: "custom_software", label: "Custom Software Development", legacyLabels: ["Web App Development", "Web Applications"] },
  { id: "erp_crm_hrms", label: "ERP, CRM & HRMS Systems", legacyLabels: ["Business Systems", "Business Management"] },
  { id: "ai_automation", label: "AI Agents & Business Automation", legacyLabels: ["AI & Automation"] },
  { id: "website_ecommerce", label: "Website & E-commerce Development", legacyLabels: ["Website Development", "Website Dev", "E-commerce"] },
  { id: "mobile_app", label: "Mobile Application Development", legacyLabels: ["Mobile App Development", "Mobile App Dev", "Mobile Apps"] },
  { id: "integrations_maintenance", label: "Integrations, Analytics & Maintenance", legacyLabels: ["Data Analytics", "Software Maintenance"] },
  { id: "other", label: "Other / Not sure yet", legacyLabels: ["UI/UX Design", "UI/UX"] },
]);

export const SERVICE_IDS = Object.freeze(SERVICES.map((service) => service.id));

// Existing chatbot branches remain distinct for useful qualification, while
// every option maps to the canonical CRM taxonomy.
export const CHATBOT_SERVICE_OPTIONS = Object.freeze([
  "Website Development",
  "Web App Development",
  "Mobile App Development",
  "Business Systems",
  "AI & Automation",
  "UI/UX Design",
  "E-commerce",
]);

const serviceById = new Map(SERVICES.map((service) => [service.id, service]));
const idByLabel = new Map();
for (const service of SERVICES) {
  idByLabel.set(service.label.toLowerCase(), service.id);
  for (const label of service.legacyLabels) idByLabel.set(label.toLowerCase(), service.id);
}

export function getService(id) {
  return serviceById.get(id) || serviceById.get("other");
}

export function canonicalServiceId(value) {
  if (serviceById.has(value)) return value;
  return idByLabel.get(String(value || "").trim().toLowerCase()) || "other";
}
