import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import FAQs from "./FAQs";

describe("FAQ disclosures", () => {
  it("uses accessible buttons and exposes one answer at a time", async () => {
    const user = userEvent.setup();
    render(<HelmetProvider><MemoryRouter><FAQs /></MemoryRouter></HelmetProvider>);

    const services = screen.getByRole("button", { name: /what services/i });
    const existingSystem = screen.getByRole("button", { name: /existing system/i });
    expect(services).toHaveAttribute("aria-expanded", "false");

    await user.click(services);
    expect(services).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("region", { name: /what services/i })).toBeVisible();

    await user.click(existingSystem);
    expect(existingSystem).toHaveAttribute("aria-expanded", "true");
    expect(services).toHaveAttribute("aria-expanded", "false");
  });
});
