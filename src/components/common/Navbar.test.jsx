import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Navbar from "./Navbar";

describe("mobile navigation", () => {
  it("keeps the closed drawer inert and returns focus after Escape", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Navbar /></MemoryRouter>);
    const toggle = screen.getByRole("button", { name: /toggle navigation/i });
    const drawer = screen.getByRole("dialog", { hidden: true });
    expect(drawer).toHaveAttribute("inert");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(drawer).not.toHaveAttribute("inert");
    await waitFor(() => expect(screen.getByRole("button", { name: /close navigation/i })).toHaveFocus());

    await user.keyboard("{Escape}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => expect(toggle).toHaveFocus());
  });
});
