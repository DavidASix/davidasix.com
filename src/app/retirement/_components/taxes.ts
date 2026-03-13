// 2026 Canadian federal and provincial income tax brackets
// Source: CRA — Canadian income tax rates for individuals

interface Bracket {
  upTo: number; // upper bound of this bracket (Infinity for the last)
  rate: number; // marginal rate for income within this bracket
}

export type Province =
  | "AB"
  | "BC"
  | "MB"
  | "NB"
  | "NL"
  | "NS"
  | "NT"
  | "NU"
  | "ON"
  | "PE"
  | "SK"
  | "YT";

export interface TaxResult {
  federalTax: number;
  provincialTax: number;
  totalTax: number;
  federalRate: number;
  provincialRate: number;
  totalRate: number;
}

function calcTax(income: number, brackets: Bracket[]): number {
  let tax = 0;
  let prev = 0;
  for (const { upTo, rate } of brackets) {
    if (income <= prev) break;
    tax += (Math.min(income, upTo) - prev) * rate;
    prev = upTo;
  }
  return tax;
}

const FEDERAL_BRACKETS: Bracket[] = [
  { upTo: 58_523, rate: 0.14 },
  { upTo: 117_045, rate: 0.205 },
  { upTo: 181_440, rate: 0.26 },
  { upTo: 258_482, rate: 0.29 },
  { upTo: Infinity, rate: 0.33 },
];

const PROVINCIAL_BRACKETS: Record<Province, Bracket[]> = {
  NL: [
    { upTo: 44_678, rate: 0.087 },
    { upTo: 89_354, rate: 0.145 },
    { upTo: 159_528, rate: 0.158 },
    { upTo: 223_340, rate: 0.178 },
    { upTo: 285_319, rate: 0.198 },
    { upTo: 570_638, rate: 0.208 },
    { upTo: 1_141_275, rate: 0.213 },
    { upTo: Infinity, rate: 0.218 },
  ],
  PE: [
    { upTo: 33_928, rate: 0.095 },
    { upTo: 65_820, rate: 0.1347 },
    { upTo: 106_890, rate: 0.166 },
    { upTo: 142_250, rate: 0.1762 },
    { upTo: Infinity, rate: 0.19 },
  ],
  NS: [
    { upTo: 30_995, rate: 0.0879 },
    { upTo: 61_991, rate: 0.1495 },
    { upTo: 97_417, rate: 0.1667 },
    { upTo: 157_124, rate: 0.175 },
    { upTo: Infinity, rate: 0.21 },
  ],
  NB: [
    { upTo: 52_333, rate: 0.094 },
    { upTo: 104_666, rate: 0.14 },
    { upTo: 193_861, rate: 0.16 },
    { upTo: Infinity, rate: 0.195 },
  ],
  ON: [
    { upTo: 53_891, rate: 0.0505 },
    { upTo: 107_785, rate: 0.0915 },
    { upTo: 150_000, rate: 0.1116 },
    { upTo: 220_000, rate: 0.1216 },
    { upTo: Infinity, rate: 0.1316 },
  ],
  MB: [
    { upTo: 47_000, rate: 0.108 },
    { upTo: 100_000, rate: 0.1275 },
    { upTo: Infinity, rate: 0.174 },
  ],
  SK: [
    { upTo: 54_532, rate: 0.105 },
    { upTo: 155_805, rate: 0.125 },
    { upTo: Infinity, rate: 0.145 },
  ],
  AB: [
    { upTo: 61_200, rate: 0.08 },
    { upTo: 154_259, rate: 0.1 },
    { upTo: 185_111, rate: 0.12 },
    { upTo: 246_813, rate: 0.13 },
    { upTo: 370_220, rate: 0.14 },
    { upTo: Infinity, rate: 0.15 },
  ],
  BC: [
    { upTo: 50_363, rate: 0.0506 },
    { upTo: 100_728, rate: 0.077 },
    { upTo: 115_648, rate: 0.105 },
    { upTo: 140_430, rate: 0.1229 },
    { upTo: 190_405, rate: 0.147 },
    { upTo: 265_545, rate: 0.168 },
    { upTo: Infinity, rate: 0.205 },
  ],
  YT: [
    { upTo: 58_523, rate: 0.064 },
    { upTo: 117_045, rate: 0.09 },
    { upTo: 181_440, rate: 0.109 },
    { upTo: 500_000, rate: 0.128 },
    { upTo: Infinity, rate: 0.15 },
  ],
  NT: [
    { upTo: 53_003, rate: 0.059 },
    { upTo: 106_009, rate: 0.086 },
    { upTo: 172_346, rate: 0.122 },
    { upTo: Infinity, rate: 0.1405 },
  ],
  NU: [
    { upTo: 55_801, rate: 0.04 },
    { upTo: 111_602, rate: 0.07 },
    { upTo: 181_439, rate: 0.09 },
    { upTo: Infinity, rate: 0.115 },
  ],
};

/**
 * Calculates the effective federal and provincial income tax rates for a given
 * province and annual income using 2026 progressive brackets.
 *
 * Note: does not include the basic personal amount, surtaxes, or other credits.
 * Results represent the effective (average) rate, not the marginal rate.
 */
export function getTaxDetails(province: Province, income: number): TaxResult {
  if (income <= 0) {
    return {
      federalTax: 0,
      provincialTax: 0,
      totalTax: 0,
      federalRate: 0,
      provincialRate: 0,
      totalRate: 0,
    };
  }

  const federalTax = calcTax(income, FEDERAL_BRACKETS);
  const provincialTax = calcTax(income, PROVINCIAL_BRACKETS[province]);
  const totalTax = federalTax + provincialTax;

  return {
    federalTax,
    provincialTax,
    totalTax,
    federalRate: federalTax / income,
    provincialRate: provincialTax / income,
    totalRate: totalTax / income,
  };
}

export function getTaxRate(province: Province, income: number): number {
  return getTaxDetails(province, income).totalRate;
}
