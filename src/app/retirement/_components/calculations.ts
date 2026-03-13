import { getTaxRate, type Province } from "./taxes";

// CRA prescribed RRIF minimum withdrawal factors (ages 71–94)
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

export interface RRIFRow {
  age: number;
  startValue: number;
  payment: number;
  withdrawalPercent: number;
  endValue: number;
  taxRate: number;
  taxAmount: number;
  netPayment: number;
}

export interface RRIFParams {
  rrifValue: number;
  startAge: number;
  endAge: number;
  useSpouseAge: boolean;
  spouseAge: number;
  /** Already divided by 100 (e.g. 0.06 for 6%) */
  returnRate: number;
  startPaymentsIn: "1" | "2";
  paymentType: "minimum" | "fixed-pre-tax" | "fixed-after-tax";
  fixedPayment: number;
  /** Already divided by 100 (e.g. 0.015 for 1.5%) */
  inflationRate: number;
  calculateTax: boolean;
  taxMode: "automatic" | "manual";
  /** Already divided by 100 (e.g. 0.30 for 30%) */
  manualTaxRate: number;
  province: Province;
}

export function getMinWithdrawalRate(age: number): number {
  if (age < 71) return 1 / (90 - age);
  if (age >= 95) return 0.2;
  return PRESCRIBED_RATES[age] ?? 0.2;
}

/**
 * Given a desired after-tax (net) amount, find the gross RRIF withdrawal
 * needed to produce it after applying the appropriate tax rate.
 *
 * For automatic mode, binary search finds the gross amount whose effective
 * provincial+federal rate produces the desired net.
 */
function grossUpPayment(
  netDesired: number,
  taxMode: "automatic" | "manual",
  manualTaxRate: number,
  province: Province,
): { gross: number; taxRate: number } {
  if (taxMode === "manual") {
    return {
      gross: netDesired / (1 - manualTaxRate),
      taxRate: manualTaxRate,
    };
  }

  // Binary search: gross * (1 - getTaxRate(province, gross)) = netDesired
  let lo = netDesired;
  let hi = netDesired * 3;
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    const afterTax = mid * (1 - getTaxRate(province, mid));
    if (afterTax < netDesired) lo = mid;
    else hi = mid;
  }
  const gross = (lo + hi) / 2;
  return { gross, taxRate: getTaxRate(province, gross) };
}

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
          // Gross up the target net amount to find the required RRIF withdrawal
          const { gross } = grossUpPayment(
            inflatedTarget,
            params.taxMode,
            params.manualTaxRate,
            params.province,
          );
          payment = Math.max(minPayment, gross);
        } else {
          payment = Math.max(minPayment, inflatedTarget);
        }

        withdrawalPercent = balance > 0 ? payment / balance : 0;
      }
      paymentYear++;
    }

    let taxRate = 0;
    let taxAmount = 0;
    let netPayment = payment;

    if (params.calculateTax && payment > 0) {
      taxRate =
        params.taxMode === "automatic"
          ? getTaxRate(params.province, payment)
          : params.manualTaxRate;
      taxAmount = payment * taxRate;
      netPayment = payment - taxAmount;
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
    });

    balance = endValue;
    if (balance <= 0) break;
  }

  return rows;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  return (value * 100).toFixed(2) + "%";
}
