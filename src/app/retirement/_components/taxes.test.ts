import { describe, expect, it } from "vitest";
import { getTaxDetails, getTaxRate } from "./taxes";

describe("getTaxRate", () => {
  it("returns the total effective rate as a single number", () => {
    expect(getTaxRate("ON", 110_000)).toBeCloseTo(0.242, 2);
  });
});

describe("getTaxDetails", () => {
  describe("Ontario", () => {
    it("returns zero tax on zero income", () => {
      const result = getTaxDetails("ON", 0);
      expect(result.totalTax).toBe(0);
      expect(result.totalRate).toBe(0);
    });

    it("$110,000 — 17.0% federal + 7.2% provincial = 24.2% total", () => {
      const result = getTaxDetails("ON", 110_000);

      // Federal: $18,746 (17.0%)
      expect(result.federalTax).toBeCloseTo(18_746, 0);
      expect(result.federalRate).toBeCloseTo(0.17, 2);

      // Ontario: $7,900 (7.2%)
      expect(result.provincialTax).toBeCloseTo(7_900, 0);
      expect(result.provincialRate).toBeCloseTo(0.072, 2);

      // Total: $26,645 (24.2%)
      expect(result.totalTax).toBeCloseTo(26_646, 0);
      expect(result.totalRate).toBeCloseTo(0.242, 2);
    });

    it("$50,000 — stays in first federal and provincial brackets", () => {
      const result = getTaxDetails("ON", 50_000);

      // Federal: 14% × $50,000 = $7,000
      expect(result.federalTax).toBeCloseTo(7_000, 0);

      // Ontario: 5.05% × $50,000 = $2,525
      expect(result.provincialTax).toBeCloseTo(2_525, 0);

      expect(result.totalRate).toBeCloseTo(0.1905, 2);
    });

    it("$200,000 — spans multiple brackets for both federal and provincial", () => {
      const result = getTaxDetails("ON", 200_000);

      // Federal: 14% × 58,523 + 20.5% × 58,522 + 26% × 64,395 + 29% × 18,560
      // = 8,193.22 + 11,996.51 + 16,742.70 + 5,382.40 = 42,314.83
      expect(result.federalTax).toBeCloseTo(42_315, 0);

      // Ontario: 5.05% × 53,891 + 9.15% × 53,894 + 11.16% × 42,215 + 12.16% × 50,000
      // = 2,721.50 + 4,931.30 + 4,711.19 + 6,080.00 = 18,443.99
      expect(result.provincialTax).toBeCloseTo(18_444, 0);

      expect(result.totalRate).toBeCloseTo(0.3038, 2);
    });
  });

  describe("Alberta", () => {
    it("$100,000 — spans first two brackets", () => {
      const result = getTaxDetails("AB", 100_000);

      // Federal: 14% × 58,523 + 20.5% × 41,477 = 8,193.22 + 8,502.79 = 16,696.01
      expect(result.federalTax).toBeCloseTo(16_696, 0);

      // Alberta: 8% × 61,200 + 10% × 38,800 = 4,896 + 3,880 = 8,776
      expect(result.provincialTax).toBeCloseTo(8_776, 0);

      expect(result.totalRate).toBeCloseTo(0.2547, 2);
    });
  });

  describe("British Columbia", () => {
    it("$80,000 — spans first two provincial brackets", () => {
      const result = getTaxDetails("BC", 80_000);

      // Federal: 14% × 58,523 + 20.5% × 21,477 = 8,193.22 + 4,402.79 = 12,596.01
      expect(result.federalTax).toBeCloseTo(12_596, 0);

      // BC: 5.06% × 50,363 + 7.7% × 29,637 = 2,548.37 + 2,282.05 = 4,830.42
      expect(result.provincialTax).toBeCloseTo(4_830, 0);

      expect(result.totalRate).toBeCloseTo(0.2183, 2);
    });
  });
});
