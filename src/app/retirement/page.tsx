"use client";

import { useState, useMemo } from "react";
import { TooltipProvider } from "~/components/ui/tooltip";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { calculateRRIF } from "./_components/calculations";
import { Divider } from "./_components/divider";
import { SliderField } from "./_components/slider-field";
import { SelectField } from "./_components/select-field";
import { PaymentSchedule } from "./_components/payment-schedule";

export default function RetirementPage() {
  const [rrifValue, setRrifValue] = useState(200000);
  const [startAge, setStartAge] = useState(71);
  const [endAge, setEndAge] = useState(90);
  const [useSpouseAge, setUseSpouseAge] = useState("0");
  const [spouseAge, setSpouseAge] = useState(65);
  const [returnRate, setReturnRate] = useState(6.0);
  const [startPaymentsIn, setStartPaymentsIn] = useState<"1" | "2">("2");
  const [paymentType, setPaymentType] = useState<"minimum" | "fixed">(
    "minimum",
  );
  const [fixedPayment, setFixedPayment] = useState(12000);
  const [inflationRate, setInflationRate] = useState(1.5);
  const [calculateTax, setCalculateTax] = useState(false);
  const [taxMode, setTaxMode] = useState<"automatic" | "manual">("automatic");
  const [manualTaxRate, setManualTaxRate] = useState(30.0);

  function handleStartAge(v: number) {
    setStartAge(v);
    if (endAge < v) setEndAge(v);
  }

  function handleEndAge(v: number) {
    setEndAge(Math.max(v, startAge));
  }

  const rows = useMemo(
    () =>
      calculateRRIF({
        rrifValue,
        startAge,
        endAge,
        useSpouseAge: useSpouseAge === "1",
        spouseAge,
        returnRate: returnRate / 100,
        startPaymentsIn,
        paymentType,
        fixedPayment,
        inflationRate: inflationRate / 100,
        calculateTax,
        taxMode,
        manualTaxRate: manualTaxRate / 100,
      }),
    [
      rrifValue,
      startAge,
      endAge,
      useSpouseAge,
      spouseAge,
      returnRate,
      startPaymentsIn,
      paymentType,
      fixedPayment,
      inflationRate,
      calculateTax,
      taxMode,
      manualTaxRate,
    ],
  );

  const lastRow = rows[rows.length - 1];
  const finalValue = lastRow?.endValue ?? 0;
  const finalAge = lastRow?.age ?? endAge;

  return (
    <TooltipProvider delayDuration={200}>
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="mb-12 text-center">
            <h1 className="text-foreground font-jersey-10 mb-4 text-6xl leading-none md:text-7xl lg:text-[7rem]">
              RRIF Calculator
            </h1>
            <p className="text-muted-foreground text-xl">
              Registered Retirement Income Fund payment planner
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
            {/* Inputs panel */}
            <div className="border-border bg-background/40 min-w-0 space-y-5 rounded-xl border p-6">
              <h2 className="text-foreground font-jersey-10 text-2xl">
                Inputs
              </h2>

              <SliderField
                label="RRIF value"
                value={rrifValue}
                min={0}
                max={5000000}
                step={1000}
                onChange={setRrifValue}
                format="currency"
              />

              <Divider />

              <SliderField
                label="Start RRIF at age"
                value={startAge}
                min={50}
                max={71}
                step={1}
                onChange={handleStartAge}
                format="age"
                tooltip="You can start making withdrawals from a RRIF at any age but this calculator assumes age 50 is the earliest. You must start making withdrawals by age 71."
              />

              <Divider />

              <SliderField
                label="End RRIF at age"
                value={endAge}
                min={startAge}
                max={100}
                step={1}
                onChange={handleEndAge}
                format="age"
              />

              <Divider />

              <SelectField
                label="Use spouse's age?"
                value={useSpouseAge}
                options={[
                  { value: "0", label: "No" },
                  { value: "1", label: "Yes" },
                ]}
                onChange={setUseSpouseAge}
                tooltip={`If your spouse is younger than you, you can use their age to calculate your minimum amount. Enter the age your spouse will be when you are age ${startAge}.`}
              />

              {useSpouseAge === "1" && (
                <>
                  <Divider />
                  <SliderField
                    label="Younger spouse's age"
                    value={spouseAge}
                    min={0}
                    max={startAge - 1}
                    step={1}
                    onChange={setSpouseAge}
                    format="age"
                    tooltip={`Enter the age your spouse will be when you are age ${startAge}.`}
                  />
                </>
              )}

              <Divider />

              <SliderField
                label="Rate of return (max 16%)"
                value={returnRate}
                min={0}
                max={16}
                step={0.25}
                onChange={setReturnRate}
                format="percent"
              />

              <Divider />

              <SelectField
                label="Start payments in"
                value={startPaymentsIn}
                options={[
                  { value: "1", label: "1st Year" },
                  { value: "2", label: "2nd Year" },
                ]}
                onChange={(v) => setStartPaymentsIn(v as "1" | "2")}
                tooltip="You can start withdrawals in the first or second year of your RRIF. Skipping the first year allows more of your RRIF to grow. The latest you can take your first payment is December 31 of the year you turn 72."
              />

              <Divider />

              <SelectField
                label="Type of payment"
                value={paymentType}
                options={[
                  { value: "minimum", label: "Minimum" },
                  { value: "fixed", label: "Fixed" },
                ]}
                onChange={(v) => setPaymentType(v as "minimum" | "fixed")}
              />

              {paymentType === "fixed" && (
                <>
                  <Divider />
                  <SliderField
                    label="Fixed annual payment (max $200,000)"
                    value={fixedPayment}
                    min={0}
                    max={200000}
                    step={500}
                    onChange={setFixedPayment}
                    format="currency"
                  />
                  <Divider />
                  <SliderField
                    label="Inflation rate (max 10%)"
                    value={inflationRate}
                    min={0}
                    max={10}
                    step={0.25}
                    onChange={setInflationRate}
                    format="percent"
                    tooltip="This inflation rate is used to index the annual fixed payment each year."
                  />
                </>
              )}

              <Divider />

              <div className="flex items-center justify-between gap-4">
                <Label
                  htmlFor="calculate-tax"
                  className="text-foreground text-sm font-medium"
                >
                  Estimate income tax
                </Label>
                <Switch
                  id="calculate-tax"
                  checked={calculateTax}
                  onCheckedChange={setCalculateTax}
                />
              </div>

              {calculateTax && (
                <>
                  <Divider />
                  <SelectField
                    label="Tax assumption"
                    value={taxMode}
                    options={[
                      { value: "automatic", label: "Automatic" },
                      { value: "manual", label: "Manual" },
                    ]}
                    onChange={(v) => setTaxMode(v as "automatic" | "manual")}
                    tooltip="Automatic uses Ontario combined federal + provincial marginal rates based on the withdrawal amount. Manual lets you enter a flat rate."
                  />
                  {taxMode === "manual" && (
                    <>
                      <Divider />
                      <SliderField
                        label="Tax rate (max 60%)"
                        value={manualTaxRate}
                        min={0}
                        max={60}
                        step={0.5}
                        onChange={setManualTaxRate}
                        format="percent"
                      />
                    </>
                  )}
                </>
              )}
            </div>

            {/* Results panel */}
            <PaymentSchedule
              rows={rows}
              finalAge={finalAge}
              finalValue={finalValue}
              calculateTax={calculateTax}
            />
          </div>
        </div>
      </main>
    </TooltipProvider>
  );
}
