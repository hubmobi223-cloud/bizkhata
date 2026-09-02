"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCompany } from "@/components/company/company-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchBalanceSheet } from "@/lib/api/reports";
import { formatAmount, todayISO } from "@/lib/format";
import type { BalanceSheetRow } from "@/lib/api/reports";

function BalanceSheetView({ companyId, asOn }: { companyId: string; asOn: string | null }) {
  const [assets, setAssets] = useState<BalanceSheetRow[] | null>(null);
  const [liabilities, setLiabilities] = useState<BalanceSheetRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchBalanceSheet(companyId, asOn)
      .then((data) => {
        if (!cancelled) {
          setAssets(data.filter((r) => r.section === "ASSETS"));
          setLiabilities(data.filter((r) => r.section === "LIABILITIES"));
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      });
    return () => {
      cancelled = true;
    };
  }, [companyId, asOn]);

  const isLoading = !assets && !error;
  const totalAssets = (assets ?? []).reduce((s, r) => s + r.amount, 0);
  const totalLiabilities = (liabilities ?? []).reduce((s, r) => s + r.amount, 0);

  return (
    <>
      {!isLoading && (
        <div className="flex justify-end">
          <Button size="sm" variant="outline" onClick={() => window.print()}>
            Print
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      ) : error ? (
        <p className="py-6 text-center text-sm text-destructive">{error}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-emerald-700">Assets</CardTitle>
              <CardDescription>Total: {formatAmount(totalAssets)}</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <StatementTable rows={assets ?? []} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-rose-700">Liabilities</CardTitle>
              <CardDescription>Total: {formatAmount(totalLiabilities)}</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <StatementTable rows={liabilities ?? []} />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

function StatementTable({ rows }: { rows: BalanceSheetRow[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left text-xs text-muted-foreground">
          <th className="px-3 py-2 font-medium">Ledger</th>
          <th className="px-3 py-2 text-right font-medium">Amount</th>
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr><td className="px-3 py-3 text-center text-muted-foreground" colSpan={2}>No items.</td></tr>
        ) : (
          rows.map((r, i) => (
            <tr key={i} className="border-b last:border-0">
              <td className="px-3 py-2">
                <div>{r.ledger_name}</div>
                <div className="text-xs text-muted-foreground">{r.group_name}</div>
              </td>
              <td className="px-3 py-2 text-right font-medium tabular-nums">{formatAmount(r.amount)}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default function BalanceSheetReportPage() {
  const { activeCompany, activeFY } = useCompany();
  const [draft, setDraft] = useState(todayISO());
  const [asOn, setAsOn] = useState<string | null>(todayISO());

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
          <h1 className="text-2xl font-semibold tracking-tight">Balance Sheet</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {activeCompany.name} / {activeFY ? `FY ${activeFY.name}` : "current year"}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-end gap-3 pt-6">
          <div className="space-y-1.5">
            <Label htmlFor="asOn">As on</Label>
            <Input id="asOn" type="date" value={draft} onChange={(e) => setDraft(e.target.value)} className="w-40" />
          </div>
          <Button onClick={() => setAsOn(draft || null)}>Apply</Button>
        </CardContent>
      </Card>

      <BalanceSheetView
        key={`${activeCompany.id}-${asOn}`}
        companyId={activeCompany.id}
        asOn={asOn}
      />
    </div>
  );
}
