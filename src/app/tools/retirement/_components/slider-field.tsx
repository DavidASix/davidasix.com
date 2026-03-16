"use client";

import { useState } from "react";
import { Slider } from "~/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Info } from "lucide-react";
import { cn } from "~/lib/utils";

export interface SliderFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: "currency" | "percent" | "age";
  tooltip?: string;
}

export function SliderField({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
  tooltip,
}: SliderFieldProps) {
  const [inputStr, setInputStr] = useState<string | null>(null);

  const formatted =
    format === "currency"
      ? value.toLocaleString("en-CA")
      : format === "percent"
        ? value.toFixed(2) + "%"
        : String(value);
  const display = inputStr ?? formatted;

  function commitInput(raw: string) {
    const cleaned = raw.replace(/[^0-9.]/g, "");
    const parsed = parseFloat(cleaned);
    if (!isNaN(parsed)) {
      onChange(Math.min(max, Math.max(min, parsed)));
    }
    setInputStr(null);
  }

  return (
    <div className="min-w-0 space-y-2">
      <div className="flex items-center gap-1">
        <span className="text-foreground text-sm font-medium">{label}</span>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <Info className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <div className="flex min-w-0 items-center gap-3">
        <Slider
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={([v]) => {
            if (v !== undefined) onChange(v);
          }}
          className="min-w-0 flex-1"
        />
        <input
          type="text"
          value={display}
          onChange={(e) => setInputStr(e.target.value)}
          onBlur={(e) => commitInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter")
              commitInput((e.target as HTMLInputElement).value);
          }}
          className={cn(
            "border-border bg-background text-foreground w-24 shrink-0 rounded-md border px-2 py-1 text-right text-sm",
            "focus:ring-primary focus:ring-1 focus:outline-none",
          )}
        />
      </div>
    </div>
  );
}
