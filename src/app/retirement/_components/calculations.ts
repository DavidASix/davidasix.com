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

// Ontario combined federal + provincial marginal rate brackets (simplified)
const ONTARIO_BRACKETS: [number, number][] = [
  [55_000, 0.22],
  [110_000, 0.3],
  [173_000, 0.4],
  [Infinity, 0.5],
];

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
  paymentType: "minimum" | "fixed";
  fixedPayment: number;
  /** Already divided by 100 (e.g. 0.015 for 1.5%) */
  inflationRate: number;
  calculateTax: boolean;
  taxMode: "automatic" | "manual";
  /** Already divided by 100 (e.g. 0.30 for 30%) */
  manualTaxRate: number;
}

export function getMinWithdrawalRate(age: number): number {
  if (age < 71) return 1 / (90 - age);
  if (age >= 95) return 0.2;
  return PRESCRIBED_RATES[age] ?? 0.2;
}

export function getOntarioMarginalRate(income: number): number {
  for (const [threshold, rate] of ONTARIO_BRACKETS) {
    if (income <= threshold) return rate;
  }
  return 0.5;
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
        const inflated =
          params.fixedPayment * Math.pow(1 + params.inflationRate, paymentYear);
        payment = Math.max(minPayment, inflated);
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
          ? getOntarioMarginalRate(payment)
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
