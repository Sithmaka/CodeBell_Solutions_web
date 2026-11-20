// Client for CodeBell's support automations (n8n webhooks behind hooks.codebell.online).
// Every endpoint is optional: when its env var is unset the UI falls back to email / WhatsApp,
// so the site keeps working before the automation backend is live.

const env = import.meta.env;

export const SUPPORT_ENDPOINTS = {
  chat: env.VITE_CB_CHAT_URL || "",
  ticket: env.VITE_CB_TICKET_URL || "",
  ticketStatus: env.VITE_CB_TICKET_STATUS_URL || "",
};

export const SUPPORT_EMAIL = "info@codebell.online";
export const WHATSAPP_NUMBER = "94704416217";

export const TICKET_CATEGORIES = [
  "Bug or error",
  "Website or app down",
  "Change request",
  "Billing or invoice",
  "Account or access",
  "General question",
];

export const TICKET_PRIORITIES = [
  { value: "low", label: "Low — cosmetic or minor" },
  { value: "normal", label: "Normal — something isn't working right" },
  { value: "high", label: "High — a key feature is broken" },
  { value: "critical", label: "Critical — site or system is down" },
];

async function postJson(url, body, timeoutMs = 20000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
    return data;
  } finally {
    clearTimeout(timer);
  }
}

export function getChatSessionId() {
  const key = "cb-chat-session";
  try {
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const id = crypto.randomUUID ? crypto.randomUUID() : `s-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(key, id);
    return id;
  } catch {
    return `s-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

// Request/response shape of n8n's Chat Trigger (embedded mode): { action, sessionId, chatInput, metadata } → { output }.
export async function sendChatMessage(text, sessionId) {
  const data = await postJson(
    SUPPORT_ENDPOINTS.chat,
    {
      action: "sendMessage",
      sessionId,
      chatInput: text,
      metadata: { page: window.location.pathname, source: "codebell.online" },
    },
    45000
  );
  return data.output ?? data.text ?? "";
}

export async function createTicket(ticket) {
  const data = await postJson(SUPPORT_ENDPOINTS.ticket, { ...ticket, source: "codebell.online/support" });
  return { ticketNumber: data.ticketNumber || data.ticket_number || data.id || "" };
}

// Ticket number and email travel in the POST body, never in the URL.
export async function getTicketStatus({ ticketNumber, email }) {
  return postJson(SUPPORT_ENDPOINTS.ticketStatus, { ticketNumber, email });
}

export function ticketEmailLink(ticket) {
  const subject = `[Support] ${ticket.subject || ticket.category}`;
  const body = [
    `Name: ${ticket.name}`,
    `Email: ${ticket.email}`,
    `Phone: ${ticket.phone || "-"}`,
    `Company: ${ticket.company || "-"}`,
    `Project / website: ${ticket.project || "-"}`,
    `Category: ${ticket.category}`,
    `Priority: ${ticket.priority}`,
    "",
    ticket.description,
  ].join("\n");
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function whatsappLink(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
