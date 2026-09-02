"use client";

import { useEffect, useState } from "react";
import { useCompany } from "@/components/company/company-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchTrialBalanceReport } from "@/lib/api/reports";
import { formatAmount } from "@/lib/format";
import type { TrialBalanceRow } from "@/lib/types";

function TrialBalanceView({ companyId }: { companyId: string }) {
  const [rows, setRows] = useState<TrialBalanceRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchTrialBalanceReport(companyId)
      .then((data) => {
        if (!cancelled) setRows(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      });
    return () => {
      cancelled = true;
    };
  }, [companyId]);

  const isLoading = !rows && !error;

  const totals = (rows ?? []).reduce(
    (acc, r) => {
      acc.openingDebit += r.opening_debit;
      acc.openingCredit += r.opening_credit;
      acc.periodDebit += r.period_debit;
      acc.periodCredit += r.period_credit;
      acc.net += r.net_balance;
      return acc;
    },
    { openingDebit: 0, openingCredit: 0, periodDebit: 0, periodCredit: 0, net: 0 }
  );

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
          <CardTitle className="text-base">All ledgers</CardTitle>
          <CardDescription>
            Net balance = opening + period debit − period credit.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : error ? (
            <p className="py-6 text-center text-sm text-destructive">{error}</p>
          ) : (rows ?? []).length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No ledgers found.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Ledger</th>
                  <th className="px-3 py-2 font-medium">Group</th>
                  <th className="px-3 py-2 text-right font-medium">Opening Debt</th>
                  <th className="px-3 py-2 text-right font-medium">Opening Crdt</th>
                  <th className="px-3 py-2 text-right font-medium">Period Debt</th>
                  <th className="px-3 py-2 text-right font-medium">Period Crdt</th>
                  <th className="px-3 py-2 text-right font-medium">Net Balance</th>
                </tr>
              </thead>
              <tbody>
                {rows?.map((r) => (
                  <tr key={r.ledger_id} className="border-b last:border-0">
                    <td className="px-3 py-2 font-medium">{r.ledger_name}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r.group_name}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{formatAmount(r.opening_debit)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{formatAmount(r.opening_credit)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{formatAmount(r.period_debit)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{formatAmount(r.period_credit)}</td>
                    <td className="px-3 py-2 text-right font-medium tabular-nums">{formatAmount(r.net_balance)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t font-semibold">
                  <td className="px-3 py-2" colSpan={2}>Total</td>
                  <td className="px-3 py-2 text-right tabular-nums">{formatAmount(totals.openingDebit)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{formatAmount(totals.openingCredit)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{formatAmount(totals.periodDebit)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{formatAmount(totals.periodCredit)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{formatAmount(totals.net)}</td>
                </tr>
              </tfoot>
            </table>
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default function TrialBalanceReportPage() {
  const { activeCompany, activeFY } = useCompany();
  if (!activeCompany) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Please select a company to view this report.
      </p>
    );
  }
  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Trial Balance</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {activeCompany.name} / {activeFY ? `FY ${activeFY.name}` : "current year"}
        </p>
      </div>
      <TrialBalanceView key={activeCompany.id} companyId={activeCompany.id} />
    </div>
  );
}
