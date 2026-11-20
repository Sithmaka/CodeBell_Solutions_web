import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";

const mocks = vi.hoisted(() => ({ submitLead: vi.fn(), trackEvent: vi.fn() }));

vi.mock("../lib/leadApi", () => ({
  createIdempotencyKey: () => "12345678-1234-1234-1234-123456789012",
  submitLead: mocks.submitLead,
}));
vi.mock("../lib/analytics", () => ({ trackEvent: mocks.trackEvent }));
vi.mock("../lib/attribution", () => ({ getLeadAttribution: () => ({ landingPage: "/", submissionPage: "/contact", ctaId: "test_cta" }) }));

import Contact from "./Contact";

function renderContact(url = "/contact") {
  return render(<HelmetProvider><MemoryRouter initialEntries={[url]}><Contact /></MemoryRouter></HelmetProvider>);
}

async function fillRequired(user) {
  fireEvent.change(screen.getByLabelText(/Full name/), { target: { value: "Test Contact" } });
  fireEvent.change(screen.getByLabelText(/Email address/), { target: { value: "test@example.com" } });
  fireEvent.change(screen.getByLabelText(/Country/), { target: { value: "Sri Lanka" } });
  fireEvent.change(screen.getByLabelText(/Required service/), { target: { value: "custom_software" } });
  fireEvent.change(screen.getByLabelText(/Project description/), { target: { value: "A non-production test requirement with enough useful detail." } });
  await user.click(screen.getByLabelText(/I acknowledge that CodeBell/));
}

describe("Contact lead form", () => {
  beforeEach(() => {
    mocks.submitLead.mockReset();
  });

  it("shows accessible validation errors and privacy notice", async () => {
    const user = userEvent.setup();
    renderContact();
    expect(screen.getByText(/use these details to review and respond/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /send project enquiry/i }));
    expect(await screen.findByText(/Enter your full name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Full name/)).toHaveAttribute("aria-invalid", "true");
    expect(mocks.submitLead).not.toHaveBeenCalled();
  });

  it("prevents duplicate submits and offers WhatsApp only after persistence", async () => {
    let resolveRequest;
    mocks.submitLead.mockImplementation(() => new Promise((resolve) => { resolveRequest = resolve; }));
    const user = userEvent.setup();
    renderContact("/contact?service=custom_software");
    await fillRequired(user);
    const submit = screen.getByRole("button", { name: /send project enquiry/i });
    fireEvent.click(submit);
    fireEvent.click(submit);
    expect(mocks.submitLead).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: /submitting/i })).toBeDisabled();
    resolveRequest({ success: true, leadReference: "CB-2026-000001" });
    expect(await screen.findByText("CB-2026-000001")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /continue on whatsapp/i })).toHaveAttribute("href", expect.stringContaining("wa.me"));
  });

  it("preserves entered data after a backend failure", async () => {
    mocks.submitLead.mockRejectedValue(Object.assign(new Error("Temporary backend failure."), { code: "temporary_failure", fields: {} }));
    const user = userEvent.setup();
    renderContact();
    await fillRequired(user);
    await user.click(screen.getByRole("button", { name: /send project enquiry/i }));
    expect(await screen.findByText(/Temporary backend failure/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Full name/)).toHaveValue("Test Contact");
    await waitFor(() => expect(screen.getByRole("button", { name: /try again/i })).toBeEnabled());
  });
});
