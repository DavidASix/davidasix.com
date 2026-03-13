import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { type InvestmentRow, formatCurrency } from "./calculations";

interface InvestmentScheduleProps {
  rows: InvestmentRow[];
  finalAge: number;
  finalValue: number;
  hasLumpSums: boolean;
}

export function InvestmentSchedule({
  rows,
  finalAge,
  finalValue,
  hasLumpSums,
}: InvestmentScheduleProps) {
  return (
    <div className="border-border bg-background/40 min-w-0 space-y-4 rounded-xl border p-6">
      <div>
        <h2 className="text-foreground font-jersey-10 text-2xl">
          Investment Schedule
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          At age {finalAge} your investment is projected to be{" "}
          <span className="text-foreground font-semibold">
            {formatCurrency(finalValue)}
          </span>
          .
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Age</TableHead>
              <TableHead className="text-right">Value at Start of Year</TableHead>
              <TableHead className="text-right">Contributions</TableHead>
              {hasLumpSums && (
                <TableHead className="text-right">Lump Sum</TableHead>
              )}
              <TableHead className="text-right">Growth</TableHead>
              <TableHead className="text-right">Value at End of Year</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.age}>
                <TableCell className="text-center font-medium">
                  {row.age}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(row.startValue)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(row.annualContributions)}
                </TableCell>
                {hasLumpSums && (
                  <TableCell className="text-right">
                    {formatCurrency(row.lumpSum)}
                  </TableCell>
                )}
                <TableCell className="text-right">
                  {formatCurrency(row.growth)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(row.endValue)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="border-border text-muted-foreground mt-4 space-y-2 border-t pt-4 text-xs">
        <p>
          <strong className="text-foreground">Assumptions:</strong> Contributions
          are made at the start of each period using an annuity-due formula.
          Lump sums are added at the start of the year. Returns are compounded
          annually. All values are in nominal (non-inflation-adjusted) dollars.
        </p>
        <p>
          <strong className="text-foreground">Disclaimer:</strong> Information
          and interactive calculators are made available to you only as
          self-help tools for your independent use and are not intended to
          provide investment or tax advice. We cannot and do not guarantee their
          applicability or accuracy in regards to your individual circumstances.
          All examples are hypothetical and are for illustrative purposes. We
          encourage you to seek personalized advice from qualified professionals
          regarding all personal finance issues.
        </p>
      </div>
    </div>
  );
}
