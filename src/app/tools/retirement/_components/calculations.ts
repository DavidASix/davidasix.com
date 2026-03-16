import { getTaxRate, type Province } from "./taxes";

/**
 * CRA prescribed minimum RRIF withdrawal factors for ages 71–94.
 * Each value represents the fraction of the account balance that must be
 * withdrawn that year (e.g. 0.0528 = 5.28% at age 71).
 *
 * For ages under 71 the formula `1 / (90 - age)` applies.
 * For ages 95 and over the factor is fixed at 20%.
 *
 * Source: CRA T4040 — RRSPs and Other Registered Plans for Retirement.
 */
const PRESCRIBED_RATES: Record<number, number> = {
  71: 0.0528,
  72: 0.054,
  73: 0.0553,
  74: 0.0567,
  75: 0.0582,
  76: 0.0598,
  77: 0.0617,
  78: 0.0636,
  79: 0.0658,
  80: 0.0682,
  81: 0.0708,
  82: 0.0738,
  83: 0.0771,
  84: 0.0808,
  85: 0.0851,
  86: 0.0899,
  87: 0.0955,
  88: 0.1021,
  89: 0.1099,
  90: 0.1192,
  91: 0.1306,
  92: 0.1449,
  93: 0.1634,
  94: 0.1879,
};

/** A single year's row in the RRIF payment schedule. */
export interface RRIFRow {
  /** The account holder's age at the start of this year. */
  age: number;
  /** RRIF balance at the start of the year, before any withdrawal. */
  startValue: number;
  /**
   * Gross annual withdrawal (before tax).
   * Will be 0 in any year where payments are skipped (e.g. first year
   * when `startPaymentsIn` is `"2"`).
   */
  payment: number;
  /**
   * The withdrawal expressed as a fraction of `startValue`.
   * Equals the CRA prescribed rate for minimum payments; equals
   * `payment / startValue` for fixed payment types.
   */
  withdrawalPercent: number;
  /** RRIF balance at the end of the year after withdrawal and growth. */
  endValue: number;
  /**
   * Effective income tax rate applied to this year's payment.
   * 0 when `calculateTax` is false or when no payment was made.
   */
  taxRate: number;
  /**
   * Estimated income tax owing on this year's payment, in dollars.
   * 0 when `calculateTax` is false or when no payment was made.
   */
  taxAmount: number;
  /**
   * Take-home amount after estimated tax (`payment - taxAmount`).
   * Equals `payment` when `calculateTax` is false.
   */
  netPayment: number;
  /**
   * Combined annual OAS + CPP pension income received this year.
   * 0 when neither pension is active or both are disabled.
   */
  pensionIncome: number;
}

/** All inputs required to run the RRIF payment schedule calculation. */
export interface RRIFParams {
  /** Opening RRIF balance in dollars. */
  rrifValue: number;
  /** Age at which RRIF payments begin. Minimum 50, maximum 71 per CRA rules. */
  startAge: number;
  /** Age at which the schedule ends (inclusive). */
  endAge: number;
  /**
   * When true, `spouseAge` is used instead of the account holder's own age
   * to determine the CRA minimum withdrawal rate. Useful when the spouse is
   * younger, which lowers the mandatory minimum each year.
   */
  useSpouseAge: boolean;
  /**
   * The spouse's age at the time the RRIF starts (i.e. when the account
   * holder is `startAge`). Only used when `useSpouseAge` is true.
   */
  spouseAge: number;
  /**
   * Expected annual rate of return on the RRIF, as a decimal.
   * e.g. pass `0.06` for 6%. Applied to the balance remaining after
   * each year's withdrawal.
   */
  returnRate: number;
  /**
   * Whether withdrawals begin in the first or second year of the RRIF.
   * `"2"` defers the first payment by one year, allowing the full balance
   * to grow. The latest allowable first payment is December 31 of the year
   * the account holder turns 72.
   */
  startPaymentsIn: "1" | "2";
  /**
   * How annual payments are determined:
   * - `"minimum"` — take exactly the CRA prescribed minimum each year.
   * - `"fixed-pre-tax"` — take a fixed gross amount (before tax), indexed
   *   annually by `inflationRate`. The minimum is used if it exceeds this.
   * - `"fixed-after-tax"` — target a fixed net (after-tax) amount. The
   *   gross withdrawal is grossed up to cover the estimated tax so the
   *   take-home matches the target. Requires `calculateTax` to be true;
   *   falls back to pre-tax behaviour otherwise.
   */
  paymentType: "minimum" | "fixed-pre-tax" | "fixed-after-tax";
  /**
   * The base annual payment amount in dollars, used when `paymentType` is
   * `"fixed-pre-tax"` or `"fixed-after-tax"`. Represents the gross amount
   * for pre-tax mode and the desired net amount for after-tax mode.
   * Indexed each year by `inflationRate`.
   */
  fixedPayment: number;
  /**
   * Annual inflation rate used to index `fixedPayment`, as a decimal.
   * e.g. pass `0.015` for 1.5%. Has no effect when `paymentType` is
   * `"minimum"`.
   */
  inflationRate: number;
  /** When true, estimated income tax is calculated and added to each row. */
  calculateTax: boolean;
  /**
   * Province of residence, used to look up combined federal + provincial
   * marginal tax brackets. Only used when `calculateTax` is true.
   */
  province: Province;
  /**
   * How the tax rate is determined when `calculateTax` is true:
   * - `"automatic"` — derives the effective rate from the 2026 federal and
   *   provincial brackets via `getTaxRate`, treating the withdrawal as the
   *   sole taxable income (a simplification).
   * - `"manual"` — applies a flat rate supplied by `manualTaxRate`.
   */
  taxMode: "automatic" | "manual";
  /**
   * Flat tax rate to apply when `taxMode` is `"manual"`, as a decimal.
   * e.g. pass `0.30` for 30%.
   */
  manualTaxRate: number;
  /** When true, OAS payments are factored in starting at age 65. */
  includeOas: boolean;
  /** Monthly OAS payment in dollars. Only used when `includeOas` is true. */
  oasMonthly: number;
  /** When true, CPP payments are factored in starting at `cppStartAge`. */
  includeCpp: boolean;
  /** Monthly CPP payment in dollars. Only used when `includeCpp` is true. */
  cppMonthly: number;
  /**
   * Age at which CPP payments begin (60–70).
   * Only used when `includeCpp` is true.
   */
  cppStartAge: number;
}

/**
 * Returns the CRA prescribed minimum RRIF withdrawal rate for a given age.
 *
 * - Ages under 71: `1 / (90 - age)` (the pre-71 formula).
 * - Ages 71–94: looked up from the CRA prescribed factors table.
 * - Ages 95 and over: fixed at 20%.
 *
 * @param age - The account holder's (or qualifying spouse's) age.
 * @returns The minimum withdrawal rate as a decimal (e.g. `0.0528` for 5.28%).
 */
export function getMinWithdrawalRate(age: number): number {
  if (age < 71) return 1 / (90 - age);
  if (age >= 95) return 0.2;
  return PRESCRIBED_RATES[age] ?? 0.2;
}

/**
 * Given a desired after-tax (net) annual amount, finds the gross RRIF
 * withdrawal needed so that the take-home equals `netDesired` after tax.
 *
 * - **Manual mode**: solves analytically as `gross = netDesired / (1 - rate)`.
 * - **Automatic mode**: uses binary search (50 iterations) to find the gross
 *   amount whose effective combined federal + provincial rate — computed via
 *   `getTaxRate` — yields `netDesired` after deduction. Binary search
 *   converges because after-tax income is monotonically increasing in gross
 *   income for any realistic combined rate below 100%.
 *
 * @param netDesired - Target after-tax payment in dollars.
 * @param taxMode - Whether to use bracket-based or flat-rate tax.
 * @param manualTaxRate - Flat rate as a decimal; only used when `taxMode` is `"manual"`.
 * @param province - Province for bracket lookup; only used when `taxMode` is `"automatic"`.
 * @returns The required gross withdrawal and the effective tax rate that applies to it.
 */
function grossUpPayment(
  netDesiredTotal: number,
  otherIncome: number,
  taxMode: "automatic" | "manual",
  manualTaxRate: number,
  province: Province,
): { gross: number; taxRate: number } {
  // Solve for the RRIF gross amount such that total after-tax income equals netDesiredTotal.
  // Total gross = rrif_gross + otherIncome; net = totalGross * (1 - taxRate(totalGross)).
  if (taxMode === "manual") {
    const totalGross = netDesiredTotal / (1 - manualTaxRate);
    return {
      gross: Math.max(0, totalGross - otherIncome),
      taxRate: manualTaxRate,
    };
  }

  // Binary search: totalGross * (1 - getTaxRate(province, totalGross)) = netDesiredTotal
  let lo = netDesiredTotal;
  let hi = netDesiredTotal * 3;
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    const afterTax = mid * (1 - getTaxRate(province, mid));
    if (afterTax < netDesiredTotal) lo = mid;
    else hi = mid;
  }
  const totalGross = (lo + hi) / 2;
  return {
    gross: Math.max(0, totalGross - otherIncome),
    taxRate: getTaxRate(province, totalGross),
  };
}

/**
 * Computes a year-by-year RRIF payment schedule from the provided parameters.
 *
 * Each row covers one calendar year from `startAge` to `endAge` (inclusive),
 * stopping early if the account balance reaches zero. The schedule models:
 *
 * 1. **Minimum payments** — the CRA prescribed rate applied to the opening
 *    balance each year.
 * 2. **Fixed pre-tax payments** — a user-specified gross amount, inflated
 *    annually, floored at the CRA minimum.
 * 3. **Fixed after-tax payments** — a user-specified net (take-home) target,
 *    grossed up to cover estimated tax, floored at the CRA minimum.
 *
 * Payments are assumed to occur at the **start** of each year. Growth is then
 * applied to the remaining balance: `endValue = (balance - payment) × (1 + returnRate)`.
 * Tax figures are estimates only and do not account for credits, deductions,
 * or other income sources.
 *
 * @param params - All inputs governing the schedule. See {@link RRIFParams}.
 * @returns An array of {@link RRIFRow} objects, one per year.
 */
export function calculateRRIF(params: RRIFParams): RRIFRow[] {
  const rows: RRIFRow[] = [];
  let balance = params.rrifValue;
  let paymentYear = 0;

  for (let age = params.startAge; age <= params.endAge; age++) {
    const yearIndex = age - params.startAge;
    const isFirstYear = yearIndex === 0;
    const skipYear = isFirstYear && params.startPaymentsIn === "2";

    const calcAge = params.useSpouseAge ? params.spouseAge + yearIndex : age;

    const minRate = getMinWithdrawalRate(calcAge);
    const minPayment = balance * minRate;

    // Pension income received this year
    const oasYearly =
      params.includeOas && age >= 65 ? params.oasMonthly * 12 : 0;
    const cppYearly =
      params.includeCpp && age >= params.cppStartAge
        ? params.cppMonthly * 12
        : 0;
    const pensionIncome = oasYearly + cppYearly;

    let payment = 0;
    let withdrawalPercent = 0;

    if (!skipYear) {
      if (params.paymentType === "minimum") {
        payment = minPayment;
        withdrawalPercent = minRate;
      } else {
        const inflatedTarget =
          params.fixedPayment * Math.pow(1 + params.inflationRate, paymentYear);

        if (params.paymentType === "fixed-after-tax" && params.calculateTax) {
          // Gross up so that total after-tax income (RRIF + pension) equals inflatedTarget.
          const { gross } = grossUpPayment(
            inflatedTarget,
            pensionIncome,
            params.taxMode,
            params.manualTaxRate,
            params.province,
          );
          payment = Math.max(minPayment, gross);
        } else {
          // Reduce the gross target by pension income, floored at minimum
          const grossTarget = Math.max(0, inflatedTarget - pensionIncome);
          payment = Math.max(minPayment, grossTarget);
        }

        withdrawalPercent = balance > 0 ? payment / balance : 0;
      }
      paymentYear++;
    }

    let taxRate = 0;
    let taxAmount = 0;
    let netPayment = payment;

    if (params.calculateTax && (payment > 0 || pensionIncome > 0)) {
      const totalIncome = payment + pensionIncome;
      taxRate =
        params.taxMode === "automatic"
          ? getTaxRate(params.province, totalIncome)
          : params.manualTaxRate;
      taxAmount = totalIncome * taxRate;
      netPayment = payment * (1 - taxRate);
    }

    const endValue = Math.max(0, (balance - payment) * (1 + params.returnRate));

    rows.push({
      age,
      startValue: balance,
      payment,
      withdrawalPercent,
      endValue,
      taxRate,
      taxAmount,
      netPayment,
      pensionIncome,
    });

    balance = endValue;
    if (balance <= 0) break;
  }

  return rows;
}

/**
 * Formats a dollar amount as a Canadian currency string with no decimal places.
 * e.g. `1234.5` → `"$1,235"`.
 *
 * @param value - Amount in dollars.
 * @returns Formatted string, e.g. `"$12,345"`.
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Formats a decimal rate as a percentage string with two decimal places.
 * e.g. `0.0528` → `"5.28%"`.
 *
 * @param value - Rate as a decimal (e.g. `0.0528` for 5.28%).
 * @returns Formatted string, e.g. `"5.28%"`.
 */
export function formatPercent(value: number): string {
  return (value * 100).toFixed(2) + "%";
}
