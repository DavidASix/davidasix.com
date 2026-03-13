export interface LumpSum {
  age: number;
  amount: number;
}

export interface InvestmentParams {
  startingValue: number;
  currentAge: number;
  endAge: number;
  returnRate: number;
  contribution: number;
  contributionFrequency:
    | "none"
    | "monthly"
    | "quarterly"
    | "semiannually"
    | "annually";
  lumpSums: LumpSum[];
}

export interface InvestmentRow {
  age: number;
  startValue: number;
  annualContributions: number;
  lumpSum: number;
  growth: number;
  endValue: number;
}

const PERIODS_PER_YEAR: Record<InvestmentParams["contributionFrequency"], number> = {
  monthly: 12,
  quarterly: 4,
  semiannually: 2,
  annually: 1,
  none: 0,
};

export function calculateInvestment(params: InvestmentParams): InvestmentRow[] {
  const rows: InvestmentRow[] = [];
  let balance = params.startingValue;

  const n = PERIODS_PER_YEAR[params.contributionFrequency];
  const rPeriod = n > 0 ? Math.pow(1 + params.returnRate, 1 / n) - 1 : 0;

  for (let age = params.currentAge; age <= params.endAge; age++) {
    const lumpSum = params.lumpSums
      .filter((ls) => ls.age === age)
      .reduce((sum, ls) => sum + ls.amount, 0);

    const startValue = balance;
    const combinedStart = startValue + lumpSum;
    const annualContributions = params.contribution * n;

    // FV of annuity-due: C * ((1+r)^n - 1) / r * (1+r)
    const contributionFV =
      n > 0
        ? params.contribution *
          ((Math.pow(1 + rPeriod, n) - 1) / rPeriod) *
          (1 + rPeriod)
        : 0;

    const endValue = combinedStart * (1 + params.returnRate) + contributionFV;
    const growth = endValue - startValue - annualContributions - lumpSum;

    rows.push({
      age,
      startValue,
      annualContributions,
      lumpSum,
      growth,
      endValue,
    });

    balance = endValue;
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
