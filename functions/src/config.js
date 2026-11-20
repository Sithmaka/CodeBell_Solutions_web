export const BRAND_ID = "codebell_development";
export const BRAND_DOMAIN = "codebell.online";
export const PRIVACY_NOTICE_VERSION = "2026-10-10";

export const SERVICE_IDS = new Set([
  "custom_software",
  "erp_crm_hrms",
  "ai_automation",
  "website_ecommerce",
  "mobile_app",
  "integrations_maintenance",
  "other",
]);

export const LEAD_STATUSES = new Set([
  "new",
  "contacted",
  "qualified",
  "meeting_scheduled",
  "proposal_required",
  "proposal_sent",
  "won",
  "lost",
]);

export const CRM_ROLES = new Set([
  "super_admin",
  "admin",
  "sales_manager",
  "sales_agent",
  "viewer",
]);

export const MANAGER_ROLES = new Set(["super_admin", "admin", "sales_manager"]);
export const MAX_BODY_BYTES = 16 * 1024;
export const RATE_LIMIT_MAX = 5;
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
export const AUTOMATION_MAX_ATTEMPTS = 5;
