import { describe, expect, it } from "vitest";
import {
  calculateRRIF,
  formatCurrency,
  formatPercent,
  getMinWithdrawalRate,
} from "./calculations";

describe("getMinWithdrawalRate", () => {
  it("age 65 uses pre-71 formula 1/(90-65) = 0.04", () => {
    expect(getMinWithdrawalRate(65)).toBeCloseTo(0.04, 2);
  });

  it("age 70 uses pre-71 formula 1/(90-70) = 0.05", () => {
    expect(getMinWithdrawalRate(70)).toBeCloseTo(0.05, 2);
  });

  it("age 71 returns first prescribed rate 0.0528", () => {
    expect(getMinWithdrawalRate(71)).toBe(0.0528);
  });

  it("age 80 returns mid-table prescribed rate 0.0682", () => {
    expect(getMinWithdrawalRate(80)).toBe(0.0682);
  });

  it("age 94 returns last prescribed rate 0.1879", () => {
    expect(getMinWithdrawalRate(94)).toBe(0.1879);
  });

  it("age 95 returns hardcoded floor 0.2", () => {
    expect(getMinWithdrawalRate(95)).toBe(0.2);
  });

  it("age 100 returns hardcoded floor 0.2", () => {
    expect(getMinWithdrawalRate(100)).toBe(0.2);
  });
});

const baseParams = {
  rrifValue: 500_000,
  startAge: 71,
  endAge: 72,
  useSpouseAge: false,
  spouseAge: 0,
  returnRate: 0.06,
  startPaymentsIn: "1" as const,
  paymentType: "minimum" as const,
  fixedPayment: 0,
  inflationRate: 0,
  calculateTax: false,
  province: "ON" as const,
  taxMode: "manual" as const,
  manualTaxRate: 0,
  includeOas: false,
  oasMonthly: 0,
  includeCpp: false,
  cppMonthly: 0,
  cppStartAge: 65,
};

describe("calculateRRIF — minimum payment, no tax", () => {
  const rows = calculateRRIF(baseParams);

  it("returns two rows (ages 71 and 72)", () => {
    expect(rows).toHaveLength(2);
  });

  describe("age 71", () => {
    it("startValue is 500,000", () => {
      expect(rows[0]!.startValue).toBe(500_000);
    });

    it("payment is 26,400 (500,000 × 0.0528)", () => {
      expect(rows[0]!.payment).toBeCloseTo(26_400, 2);
    });

    it("withdrawalPercent is 0.0528", () => {
      expect(rows[0]!.withdrawalPercent).toBeCloseTo(0.0528, 4);
    });

    it("endValue is 502,016", () => {
      expect(rows[0]!.endValue).toBeCloseTo(502_016, 2);
    });

    it("taxRate is 0", () => {
      expect(rows[0]!.taxRate).toBe(0);
    });

    it("taxAmount is 0", () => {
      expect(rows[0]!.taxAmount).toBe(0);
    });

    it("netPayment equals payment", () => {
      expect(rows[0]!.netPayment).toBeCloseTo(rows[0]!.payment, 2);
    });
  });

  describe("age 72", () => {
    it("startValue is 502,016", () => {
      expect(rows[1]!.startValue).toBeCloseTo(502_016, 2);
    });

    it("payment is 27,108.864 (502,016 × 0.054)", () => {
      expect(rows[1]!.payment).toBeCloseTo(27_108.864, 2);
    });

    it("withdrawalPercent is 0.054", () => {
      expect(rows[1]!.withdrawalPercent).toBeCloseTo(0.054, 4);
    });

    it("endValue is 503,401.564", () => {
      expect(rows[1]!.endValue).toBeCloseTo(503_401.564, 2);
    });

    it("taxRate is 0", () => {
      expect(rows[1]!.taxRate).toBe(0);
    });

    it("taxAmount is 0", () => {
      expect(rows[1]!.taxAmount).toBe(0);
    });

    it("netPayment equals payment", () => {
      expect(rows[1]!.netPayment).toBeCloseTo(rows[1]!.payment, 2);
    });
  });
});

describe("calculateRRIF — fixed-pre-tax, no inflation, no tax", () => {
  const rows = calculateRRIF({
    ...baseParams,
    rrifValue: 300_000,
    startAge: 71,
    endAge: 73,
    returnRate: 0.05,
    paymentType: "fixed-pre-tax",
    fixedPayment: 20_000,
    inflationRate: 0,
  });

  it("returns three rows (ages 71–73)", () => {
    expect(rows).toHaveLength(3);
  });

  it("age 71: payment is 20,000", () => {
    expect(rows[0]!.payment).toBeCloseTo(20_000, 2);
  });

  it("age 71: endValue is 294,000", () => {
    expect(rows[0]!.endValue).toBeCloseTo(294_000, 2);
  });

  it("age 71: withdrawalPercent ≈ 0.06667", () => {
    expect(rows[0]!.withdrawalPercent).toBeCloseTo(0.06667, 2);
  });

  it("age 72: payment is 20,000", () => {
    expect(rows[1]!.payment).toBeCloseTo(20_000, 2);
  });

  it("age 72: endValue is 287,700", () => {
    expect(rows[1]!.endValue).toBeCloseTo(287_700, 2);
  });

  it("age 73: payment is 20,000", () => {
    expect(rows[2]!.payment).toBeCloseTo(20_000, 2);
  });

  it("age 73: endValue is 281,085", () => {
    expect(rows[2]!.endValue).toBeCloseTo(281_085, 2);
  });
});

describe("calculateRRIF — fixed-pre-tax with 2% inflation", () => {
  const rows = calculateRRIF({
    ...baseParams,
    rrifValue: 300_000,
    startAge: 71,
    endAge: 73,
    returnRate: 0.05,
    paymentType: "fixed-pre-tax",
    fixedPayment: 20_000,
    inflationRate: 0.02,
  });

  it("age 71: payment is 20,000 (year 0, no inflation yet)", () => {
    expect(rows[0]!.payment).toBeCloseTo(20_000, 2);
  });

  it("age 71: endValue is 294,000", () => {
    expect(rows[0]!.endValue).toBeCloseTo(294_000, 2);
  });

  it("age 72: payment is 20,400 (20,000 × 1.02)", () => {
    expect(rows[1]!.payment).toBeCloseTo(20_400, 2);
  });

  it("age 72: endValue is 287,280", () => {
    expect(rows[1]!.endValue).toBeCloseTo(287_280, 2);
  });

  it("age 73: payment is 20,808 (20,000 × 1.02²)", () => {
    expect(rows[2]!.payment).toBeCloseTo(20_808, 2);
  });

  it("age 73: endValue is 279,795.6", () => {
    expect(rows[2]!.endValue).toBeCloseTo(279_795.6, 2);
  });
});

describe("calculateRRIF — minimum enforced over fixed payment", () => {
  it("at age 94, minimum (37,580) overrides fixed payment of 20,000", () => {
    const rows = calculateRRIF({
      ...baseParams,
      rrifValue: 200_000,
      startAge: 94,
      endAge: 94,
      paymentType: "fixed-pre-tax",
      fixedPayment: 20_000,
    });
    expect(rows[0]!.payment).toBeCloseTo(37_580, 2);
  });
});

describe("calculateRRIF — manual tax applied to minimum payment", () => {
  const rows = calculateRRIF({
    ...baseParams,
    paymentType: "minimum",
    calculateTax: true,
    taxMode: "manual",
    manualTaxRate: 0.3,
  });

  it("payment is 26,400", () => {
    expect(rows[0]!.payment).toBeCloseTo(26_400, 2);
  });

  it("taxRate is 0.30", () => {
    expect(rows[0]!.taxRate).toBeCloseTo(0.3, 2);
  });

  it("taxAmount is 7,920", () => {
    expect(rows[0]!.taxAmount).toBeCloseTo(7_920, 2);
  });

  it("netPayment is 18,480", () => {
    expect(rows[0]!.netPayment).toBeCloseTo(18_480, 2);
  });

  it("endValue is 502,016 (tax does not affect end balance)", () => {
    expect(rows[0]!.endValue).toBeCloseTo(502_016, 2);
  });
});

describe("calculateRRIF — fixed-after-tax with manual tax", () => {
  const rows = calculateRRIF({
    ...baseParams,
    rrifValue: 300_000,
    endAge: 71,
    returnRate: 0.05,
    paymentType: "fixed-after-tax",
    fixedPayment: 20_000,
    calculateTax: true,
    taxMode: "manual",
    manualTaxRate: 0.25,
  });

  it("gross payment is ~26,666.67 (20,000 / 0.75)", () => {
    expect(rows[0]!.payment).toBeCloseTo(26_666.67, 2);
  });

  it("taxAmount is ~6,666.67", () => {
    expect(rows[0]!.taxAmount).toBeCloseTo(6_666.67, 2);
  });

  it("netPayment is exactly 20,000", () => {
    expect(rows[0]!.netPayment).toBeCloseTo(20_000, 2);
  });

  it("endValue is 287,000", () => {
    expect(rows[0]!.endValue).toBeCloseTo(287_000, 2);
  });
});

describe("calculateRRIF — fixed-after-tax with automatic tax (binary search)", () => {
  const rows = calculateRRIF({
    ...baseParams,
    rrifValue: 300_000,
    endAge: 71,
    returnRate: 0.05,
    paymentType: "fixed-after-tax",
    fixedPayment: 20_000,
    calculateTax: true,
    taxMode: "automatic",
    province: "ON",
  });

  it("netPayment equals 20,000 within 1 cent", () => {
    expect(rows[0]!.netPayment).toBeCloseTo(20_000, 2);
  });

  it("gross payment is approximately 24,706.61", () => {
    expect(rows[0]!.payment).toBeCloseTo(24_706.61, 0);
  });
});

describe("calculateRRIF — skip first year (startPaymentsIn: '2')", () => {
  const rows = calculateRRIF({
    ...baseParams,
    rrifValue: 300_000,
    startAge: 71,
    endAge: 73,
    returnRate: 0.06,
    paymentType: "fixed-pre-tax",
    fixedPayment: 20_000,
    inflationRate: 0,
    startPaymentsIn: "2",
  });

  it("returns three rows", () => {
    expect(rows).toHaveLength(3);
  });

  it("age 71: payment is 0 (skipped)", () => {
    expect(rows[0]!.payment).toBe(0);
  });

  it("age 71: taxRate is 0", () => {
    expect(rows[0]!.taxRate).toBe(0);
  });

  it("age 71: netPayment is 0", () => {
    expect(rows[0]!.netPayment).toBe(0);
  });

  it("age 71: endValue is 318,000 (full balance grows)", () => {
    expect(rows[0]!.endValue).toBeCloseTo(318_000, 2);
  });

  it("age 72: payment is 20,000 (inflation counter not incremented on skip year)", () => {
    expect(rows[1]!.payment).toBeCloseTo(20_000, 2);
  });

  it("age 72: endValue is 315,880", () => {
    expect(rows[1]!.endValue).toBeCloseTo(315_880, 2);
  });

  it("age 73: payment is 20,000", () => {
    expect(rows[2]!.payment).toBeCloseTo(20_000, 2);
  });

  it("age 73: endValue is 313,632.8", () => {
    expect(rows[2]!.endValue).toBeCloseTo(313_632.8, 2);
  });
});

describe("calculateRRIF — spouse age used for withdrawal rates", () => {
  const rows = calculateRRIF({
    ...baseParams,
    rrifValue: 300_000,
    startAge: 71,
    endAge: 73,
    returnRate: 0.05,
    paymentType: "minimum",
    useSpouseAge: true,
    spouseAge: 65,
  });

  it("age 71: uses spouse calcAge 65, rate 0.04, payment 12,000", () => {
    expect(rows[0]!.payment).toBeCloseTo(12_000, 2);
  });

  it("age 71: endValue is 302,400", () => {
    expect(rows[0]!.endValue).toBeCloseTo(302_400, 2);
  });

  it("age 72: uses spouse calcAge 66, rate 1/24, payment 12,600", () => {
    expect(rows[1]!.payment).toBeCloseTo(12_600, 2);
  });

  it("age 72: endValue is 304,290", () => {
    expect(rows[1]!.endValue).toBeCloseTo(304_290, 2);
  });

  it("age 73: uses spouse calcAge 67, rate 1/23, payment ~13,230", () => {
    expect(rows[2]!.payment).toBeCloseTo(13_230, 2);
  });

  it("age 73: endValue is 305,613", () => {
    expect(rows[2]!.endValue).toBeCloseTo(305_613, 2);
  });
});

describe("calculateRRIF — account exhaustion stops early", () => {
  const rows = calculateRRIF({
    ...baseParams,
    rrifValue: 50_000,
    startAge: 71,
    endAge: 73,
    returnRate: 0.05,
    paymentType: "fixed-pre-tax",
    fixedPayment: 60_000,
  });

  it("returns only 1 row (balance hits zero after year 1)", () => {
    expect(rows).toHaveLength(1);
  });

  it("year 1: payment is 60,000 (fixed wins over minimum)", () => {
    expect(rows[0]!.payment).toBeCloseTo(60_000, 2);
  });

  it("year 1: endValue is 0", () => {
    expect(rows[0]!.endValue).toBe(0);
  });
});

describe("formatCurrency", () => {
  it("formats 26,400 as $26,400 (CAD, no decimals)", () => {
    expect(formatCurrency(26_400)).toBe("$26,400");
  });
});

describe("formatPercent", () => {
  it("formats 0.0528 as '5.28%'", () => {
    expect(formatPercent(0.0528)).toBe("5.28%");
  });

  it("formats 0.2 as '20.00%'", () => {
    expect(formatPercent(0.2)).toBe("20.00%");
  });
});
