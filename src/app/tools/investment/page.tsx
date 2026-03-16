"use client";

import { useState, useMemo } from "react";
import { TooltipProvider } from "~/components/ui/tooltip";
import { calculateInvestment, type LumpSum } from "./_components/calculations";
import { Divider } from "~/app/tools/retirement/_components/divider";
import { SliderField } from "~/app/tools/retirement/_components/slider-field";
import { SelectField } from "~/app/tools/retirement/_components/select-field";
import { InvestmentSchedule } from "./_components/investment-schedule";

export default function InvestmentPage() {
  const [currentAge, setCurrentAge] = useState(30);
  const [endAge, setEndAge] = useState(65);
  const [startingValue, setStartingValue] = useState(50_000);
  const [returnRate, setReturnRate] = useState(7);
  const [contribution, setContribution] = useState(500);
  const [contributionFrequency, setContributionFrequency] = useState<
    "none" | "monthly" | "quarterly" | "semiannually" | "annually"
  >("monthly");
  const [lumpSums, setLumpSums] = useState<LumpSum[]>([]);

  function handleCurrentAge(v: number) {
    setCurrentAge(v);
    if (endAge <= v) setEndAge(v + 1);
  }

  function handleEndAge(v: number) {
    setEndAge(Math.max(v, currentAge + 1));
  }

  function addLumpSum() {
    setLumpSums((prev) => [
      ...prev,
      { age: Math.min(currentAge + 1, endAge), amount: 0 },
    ]);
  }

  function updateLumpSum(index: number, field: keyof LumpSum, value: number) {
    setLumpSums((prev) =>
      prev.map((ls, i) => (i === index ? { ...ls, [field]: value } : ls)),
    );
  }

  function removeLumpSum(index: number) {
    setLumpSums((prev) => prev.filter((_, i) => i !== index));
  }

  const rows = useMemo(
    () =>
      calculateInvestment({
        startingValue,
        currentAge,
        endAge,
        returnRate: returnRate / 100,
        contribution,
        contributionFrequency,
        lumpSums,
      }),
    [
      startingValue,
      currentAge,
      endAge,
      returnRate,
      contribution,
      contributionFrequency,
      lumpSums,
    ],
  );

  const contributionMax: Record<typeof contributionFrequency, number> = {
    none: 10_000,
    monthly: 10_000,
    quarterly: 25_000,
    semiannually: 50_000,
    annually: 100_000,
  };

  const lastRow = rows[rows.length - 1];
  const finalValue = lastRow?.endValue ?? 0;
  const finalAge = lastRow?.age ?? endAge;
  const hasLumpSums = lumpSums.length > 0;

  return (
    <TooltipProvider delayDuration={200}>
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="mb-12 text-center">
            <h1 className="text-foreground font-jersey-10 mb-4 text-6xl leading-none md:text-7xl lg:text-[7rem]">
              Investment Calculator
            </h1>
            <p className="text-muted-foreground text-xl">
              Tax-free compound growth planner
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
            {/* Inputs panel */}
            <div className="border-border bg-background/40 min-w-0 space-y-5 rounded-xl border p-6">
              <h2 className="text-foreground font-jersey-10 text-2xl">
                Inputs
              </h2>

              <SliderField
                label="Current age"
                value={currentAge}
                min={18}
                max={80}
                step={1}
                onChange={handleCurrentAge}
                format="age"
              />

              <Divider />

              <SliderField
                label="End age"
                value={endAge}
                min={currentAge + 1}
                max={100}
                step={1}
                onChange={handleEndAge}
                format="age"
              />

              <Divider />

              <SliderField
                label="Starting investment value"
                value={startingValue}
                min={0}
                max={5_000_000}
                step={1000}
                onChange={setStartingValue}
                format="currency"
              />

              <Divider />

              <SliderField
                label="Rate of return (max 20%)"
                value={returnRate}
                min={0}
                max={20}
                step={0.25}
                onChange={setReturnRate}
                format="percent"
              />

              <Divider />

              <SliderField
                label="Regular contribution"
                value={contribution}
                min={0}
                max={contributionMax[contributionFrequency]}
                step={100}
                onChange={setContribution}
                format="currency"
              />

              <Divider />

              <SelectField
                label="Contribution frequency"
                value={contributionFrequency}
                options={[
                  { value: "none", label: "None" },
                  { value: "monthly", label: "Monthly" },
                  { value: "quarterly", label: "Quarterly" },
                  { value: "semiannually", label: "Semi-annually" },
                  { value: "annually", label: "Annually" },
                ]}
                onChange={(v) =>
                  setContributionFrequency(
                    v as
                      | "none"
                      | "monthly"
                      | "quarterly"
                      | "semiannually"
                      | "annually",
                  )
                }
              />

              <Divider />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-foreground text-sm font-medium">
                    Lump sums
                  </span>
                  <button
                    onClick={addLumpSum}
                    className="text-primary hover:text-primary/80 text-sm transition-colors"
                  >
                    + Add lump sum
                  </button>
                </div>

                {lumpSums.map((ls, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-muted-foreground text-xs">
                        Age
                      </label>
                      <input
                        type="number"
                        min={currentAge + 1}
                        max={endAge}
                        value={ls.age}
                        onChange={(e) =>
                          updateLumpSum(
                            index,
                            "age",
                            Math.min(
                              endAge,
                              Math.max(
                                currentAge + 1,
                                parseInt(e.target.value) || currentAge + 1,
                              ),
                            ),
                          )
                        }
                        className="border-border bg-background text-foreground w-16 rounded border px-2 py-1 text-sm"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <label className="text-muted-foreground text-xs">
                        Amount
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={ls.amount}
                        onChange={(e) =>
                          updateLumpSum(
                            index,
                            "amount",
                            Math.max(0, parseInt(e.target.value) || 0),
                          )
                        }
                        className="border-border bg-background text-foreground w-full rounded border px-2 py-1 text-sm"
                      />
                    </div>
                    <button
                      onClick={() => removeLumpSum(index)}
                      className="text-muted-foreground hover:text-foreground mt-4 transition-colors"
                      aria-label="Remove lump sum"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Results panel */}
            <InvestmentSchedule
              rows={rows}
              finalAge={finalAge}
              finalValue={finalValue}
              hasLumpSums={hasLumpSums}
            />
          </div>
        </div>
      </main>
    </TooltipProvider>
  );
}
