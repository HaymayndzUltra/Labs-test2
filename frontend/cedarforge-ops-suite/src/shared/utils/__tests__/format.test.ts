import { describe, expect, it } from "vitest";
import { formatCurrency, formatPercent, formatDuration } from "../format";

describe("formatters", () => {
  it("formats currency with separators", () => {
    expect(formatCurrency(1234567)).toContain("1,234,567");
  });

  it("formats percent with defaults", () => {
    expect(formatPercent(0.245)).toBe("24.5%");
  });

  it("formats duration", () => {
    expect(formatDuration(5400)).toBe("1:30");
  });
});
