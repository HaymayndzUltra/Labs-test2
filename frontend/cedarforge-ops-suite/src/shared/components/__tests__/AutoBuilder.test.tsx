import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, expect } from "vitest";
import { AutoBuilder } from "../AutoBuilder";

describe("AutoBuilder", () => {
  it("walks through steps and submits", async () => {
    const onSubmit = vi.fn();
    render(<AutoBuilder onSubmit={onSubmit} />);

    fireEvent.click(screen.getByText(/continue/i));
    fireEvent.click(screen.getByText(/continue/i));
    fireEvent.click(screen.getByText(/continue/i));
    fireEvent.click(screen.getByText(/launch automation/i));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
  });
});
