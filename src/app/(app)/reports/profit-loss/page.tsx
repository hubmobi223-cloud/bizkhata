"use client";

import { useEffect, useState } from "react";
import { useCompany } from "@/components/company/company-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProfitLoss } from "@/lib/api/reports";
import { formatAmount, todayISO } from "@/lib/format";
import type { ProfitLossRow } from "@/lib/api/reports";

function ProfitLossView({
  companyId,
  from,
  to,
}: {
  companyId: string;
  from: string | null;
  to: string | null;
}) {
  const [rows, setRows] = useState<ProfitLossRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchProfitLoss(companyId, from, to)
      .then((data) => {
        if (!cancelled) setRows(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      });
    return () => {
      cancelled = true;
    };
  }, [companyId, from, to]);

  const isLoading = !rows && !error;

  const income = (rows ?? []).filter((r) => r.amount !== null);
  const totalIncome = income.filter((r) => r.amount > 0).reduce((s, r) => s + r.amount, 0);
  const totalExpense = income.filter((r) => r.amount < 0).reduce((s, r) => s + Math.abs(r.amount), 0);
  const net = totalIncome - totalExpense;

  return (
    <>
      {!isLoading && (
        <div className="flex justify-end">
          <Button size="sm" variant="outline" onClick={() => window.print()}>
            Print
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Income &amp; Expenses</CardTitle>
          <CardDescription>
            Amounts shown as positive for income and negative for expenses.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : error ? (
            <p className="py-4 text-center text-sm text-destructive">{error}</p>
          ) : (
            <>
              <div>
                <h3 className="mb-2 text-sm font-semibold text-emerald-700">Income</h3>
                <div className="overflow-x-auto rounded-lg border">
                  <table className="w-full text-sm">
                    <tbody>
                      {income.filter((r) => r.amount > 0).length === 0 ? (
                        <tr><td className="px-3 py-3 text-center text-muted-foreground">No income recorded.</td></tr>
                      ) : (
                        income.filter((r) => r.amount > 0).map((r) => (
                          <tr key={r.ledger_name} className="border-b last:border-0">
                            <td className="px-3 py-2">{r.ledger_name}</td>
                            <td className="px-3 py-2 text-muted-foreground">{r.group_name}</td>
                            <td className="px-3 py-2 text-right font-medium tabular-nums">{formatAmount(r.amount)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold text-rose-700">Expenses</h3>
                <div className="overflow-x-auto rounded-lg border">
                  <table className="w-full text-sm">
                    <tbody>
                      {income.filter((r) => r.amount < 0).length === 0 ? (
                        <tr><td className="px-3 py-3 text-center text-muted-foreground">No expenses recorded.</td></tr>
                      ) : (
                        income.filter((r) => r.amount < 0).map((r) => (
                          <tr key={r.ledger_name} className="border-b last:border-0">
                            <td className="px-3 py-2">{r.ledger_name}</td>
                            <td className="px-3 py-2 text-muted-foreground">{r.group_name}</td>
                            <td className="px-3 py-2 text-right font-medium tabular-nums">{formatAmount(Math.abs(r.amount))}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-2 border-t pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total income</span>
                  <span className="font-semibold tabular-nums">{formatAmount(totalIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total expenses</span>
                  <span className="font-semibold tabular-nums">{formatAmount(totalExpense)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-base font-bold">
                  <span>{net >= 0 ? "Net profit" : "Net loss"}</span>
                  <span className={net >= 0 ? "text-emerald-600" : "text-rose-600"}>{formatAmount(net)}</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default function ProfitLossReportPage() {
  const { activeCompany, activeFY } = useCompany();
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(todayISO());
  const [draftFrom, setDraftFrom] = useState("");
  const [draftTo, setDraftTo] = useState(todayISO());

  function apply() {
    setFrom(draftFrom || null);
    setTo(draftTo || null);
  }

  if (!activeCompany) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Please select a company to view this report.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Profit &amp; Loss</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {activeCompany.name} / {activeFY ? `FY ${activeFY.name}` : "current year"}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-end gap-3 pt-6">
          <div className="space-y-1.5">
            <Label htmlFor="from">From</Label>
            <Input id="from" type="date" value={draftFrom} onChange={(e) => setDraftFrom(e.target.value)} className="w-40" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="to">To</Label>
            <Input id="to" type="date" value={draftTo} onChange={(e) => setDraftTo(e.target.value)} className="w-40" />
          </div>
          <Button onClick={apply}>Apply</Button>
        </CardContent>
      </Card>

      <ProfitLossView
        key={`${activeCompany.id}-${from}-${to}`}
        companyId={activeCompany.id}
        from={from}
        to={to}
      />
    </div>
  );
}
