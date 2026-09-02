import { describe, expect, it } from "vitest";

import { round2, taxableValue, splitTax, taxTotal } from "../../src/lib/gst";

describe("round2", () => {
  it("rounds to two decimals with floating-point safety", () => {
    expect(round2(1.004999)).toBe(1.0);
    expect(round2(1.005)).toBe(1.01);
    expect(round2(512.3456)).toBe(512.35);
  });

  it("handles integers", () => {
    expect(round2(100)).toBe(100);
  });
});

describe("taxableValue", () => {
  it("computes qty * rate minus discount", () => {
    expect(taxableValue(2, 100, 0)).toBe(200);
    expect(taxableValue(2, 100, 10)).toBe(190);
    expect(taxableValue(3, 1.25, 0)).toBe(3.75);
    expect(taxableValue(10, 0.33, 0.01)).toBe(3.29);
  });
});

describe("splitTax", () => {
  it("splits intra-state supply into CGST and SGST", () => {
    const split = splitTax(1000, 18, true);
    expect(split.cgst).toBe(90);
    expect(split.sgst).toBe(90);
    expect(split.igst).toBe(0);
  });

  it("halves round-trip to the full effective tax rate", () => {
    for (const rate of [0.25, 3, 5, 12, 18, 28]) {
      const split = splitTax(7777.77, rate, true);
      expect(split.cgst + split.sgst).toBeCloseTo(
        round2((7777.77 * rate) / 100),
        2,
      );
    }
  });

  it("routes inter-state supply to IGST only", () => {
    const split = splitTax(1000, 18, false);
    expect(split.igst).toBe(180);
    expect(split.cgst).toBe(0);
    expect(split.sgst).toBe(0);
  });

  it("returns zero when taxable value or rate is zero", () => {
    expect(splitTax(0, 18, true).cgst).toBe(0);
    expect(splitTax(100, 0, true).igst).toBe(0);
  });
});

describe("taxTotal", () => {
  it("sums tax components", () => {
    expect(taxTotal({ cgst: 1.11, sgst: 2.22, igst: 3.33 })).toBe(6.66);
  });
});