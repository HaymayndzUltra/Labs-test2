import { render, screen } from "@testing-library/react";
import Home from "./page";

test("renders a link or heading to dashboard/home", () => {
  render(<Home />);
  const el =
    screen.queryByRole("link", { name: /dashboard|home/i }) ||
    screen.queryByRole("heading", { name: /dashboard|home/i });
  expect(el).toBeTruthy();
});
