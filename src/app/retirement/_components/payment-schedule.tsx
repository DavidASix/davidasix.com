import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { type RRIFRow, formatCurrency, formatPercent } from "./calculations";

interface PaymentScheduleProps {
  rows: RRIFRow[];
  finalAge: number;
  finalValue: number;
}

export function PaymentSchedule({
  rows,
  finalAge,
  finalValue,
}: PaymentScheduleProps) {
  return (
    <div className="border-border bg-background/40 space-y-4 rounded-xl border p-6">
      <div>
        <h2 className="text-foreground font-jersey-10 text-2xl">
          RRIF Payment Schedule
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          The value of your RRIF at age {finalAge} is projected to be{" "}
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
              <TableHead className="text-right">
                Value at Start of Year
              </TableHead>
              <TableHead className="text-right">Annual Payment</TableHead>
              <TableHead className="text-right">Withdrawal %</TableHead>
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
                  {formatCurrency(row.payment)}
                </TableCell>
                <TableCell className="text-right">
                  {formatPercent(row.withdrawalPercent)}
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
          <strong className="text-foreground">Assumptions:</strong> Annual RRIF
          payments are made at the start of the year. Annual payments are before
          taxes.
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
