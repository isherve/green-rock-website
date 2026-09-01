"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export function MortgageCalculator({ defaultPrice = 50000000 }: { defaultPrice?: number }) {
  const [price, setPrice] = useState(String(defaultPrice));
  const [downPayment, setDownPayment] = useState("20");
  const [rate, setRate] = useState("16");
  const [years, setYears] = useState("15");

  const propertyPrice = Number(price) || 0;
  const downPct = Number(downPayment) || 0;
  const annualRate = Number(rate) || 0;
  const termYears = Number(years) || 0;

  const loanAmount = propertyPrice * (1 - downPct / 100);
  const monthlyRate = annualRate / 100 / 12;
  const months = termYears * 12;
  const monthlyPayment =
    monthlyRate > 0 && months > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1)
      : loanAmount / (months || 1);

  return (
    <div className="clean-card p-6 rounded-2xl space-y-4">
      <h3 className="text-lg font-semibold">Mortgage Estimator</h3>
      <p className="text-sm text-muted-foreground">
        Estimate monthly payments for property financing in Rwanda (indicative only).
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Property price (RWF)</label>
          <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Down payment (%)</label>
          <Input type="number" min={0} max={100} value={downPayment} onChange={(e) => setDownPayment(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Interest rate (% p.a.)</label>
          <Input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Loan term (years)</label>
          <Input type="number" min={1} max={30} value={years} onChange={(e) => setYears(e.target.value)} />
        </div>
      </div>
      <div className="rounded-xl bg-primary/5 border border-primary/10 p-4">
        <p className="text-sm text-muted-foreground">Estimated monthly payment</p>
        <p className="text-2xl font-bold text-primary">{formatPrice(Math.round(monthlyPayment), "RWF")}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Loan amount: {formatPrice(Math.round(loanAmount), "RWF")} over {termYears} years
        </p>
      </div>
      <Button variant="outline" className="w-full" asChild>
        <a href="/contact">Get pre-approval advice</a>
      </Button>
    </div>
  );
}
