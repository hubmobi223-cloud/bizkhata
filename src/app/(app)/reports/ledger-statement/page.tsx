"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useCompany } from "@/components/company/company-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LedgerPicker } from "@/components/ledger-picker";
import { fetchLedgerStatement } from "@/lib/api/reports";
import { fetchLedgers } from "@/lib/api/ledgers";
import { formatAmount, formatDate, todayISO } from "@/lib/format";
import { VOUCHER_TYPE_LABELS } from "@/lib/api/vouchers";
import type { LedgerStatementRow } from "@/lib/api/reports";
import type { LedgerRow } from "@/lib/types";

export default function LedgerStatementReportPage() {
  const { activeCompany, activeFY } = useCompany();
  const [ledgers, setLedgers] = useState<LedgerRow[]>([]);
  const [ledgerId, setLedgerId] = useState<string | null>(null);
  const [from, setFrom] = useState<string>(() => {
    const fyStart = activeFY?.start_date;
    return fyStart ?? `${new Date().getFullYear()}-04-01`;
  });
  const [to, setTo] = useState<string>(todayISO());
  const [rows, setRows] = useState<LedgerStatementRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!activeCompany) return;
    let cancelled = false;
    fetchLedgers(activeCompany.id)
      .then((res) => {
        if (!cancelled) setLedgers(res);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [activeCompany]);

  function run() {
    if (!activeCompany || !ledgerId) return;
    setLoading(true);
    setError(null);
    setRows(null);
    fetchLedgerStatement(activeCompany.id, ledgerId, from, to)
      .then((data) => setRows(data))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }

  const balance = rows ? (rows[rows.length - 1]?.running_balance ?? 0) : 0;

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Ledger Statement</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {activeCompany?.name} / {activeFY ? `FY ${activeFY.name}` : "current year"}
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-end gap-3 pt-6">
          <div className="min-w-[220px] flex-1 space-y-1.5">
            <Label>Ledger</Label>
            <LedgerPicker ledgers={ledgers} value={ledgerId} onChange={setLedgerId} placeholder="Select a ledger…" />
          </div>
          <div className="space-y-1.5">
            <Label>From</Label>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-40" />
          </div>
          <div className="space-y-1.5">
            <Label>To</Label>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-40" />
          </div>
          <Button onClick={run} disabled={loading || !ledgerId}>
            {loading ? "Loading…" : "Run"}
          </Button>
        </CardContent>
      </Card>

      {rows && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">
                {ledgers.find((l) => l.id === ledgerId)?.name ?? "Ledger"}
              </CardTitle>              <CardDescription>Closing balance</CardDescription>
            </div>
            <Badge variant="secondary" className="text-sm">{formatAmount(balance)}</Badge>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {error ? (
              <p className="py-4 text-center text-sm text-destructive">{error}</p>
            ) : rows.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No transactions in this period.
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="px-3 py-2 font-medium">Date</th>
                    <th className="px-3 py-2 font-medium">Number</th>
                    <th className="px-3 py-2 font-medium">Type</th>
                    <th className="px-3 py-2 font-medium">Narration</th>
                    <th className="px-3 py-2 text-right font-medium">Debit</th>
                    <th className="px-3 py-2 text-right font-medium">Credit</th>
                    <th className="px-3 py-2 text-right font-medium">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="px-3 py-2 whitespace-nowrap tabular-nums">{formatDate(r.voucher_date)}</td>
                      <td className="px-3 py-2 font-medium">{r.voucher_number}</td>
                      <td className="px-3 py-2">
                        <Badge variant="secondary">{VOUCHER_TYPE_LABELS[r.voucher_type]}</Badge>
                      </td>
                      <td className="max-w-48 truncate px-3 py-2 text-muted-foreground">{r.narration ?? "—"}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{formatAmount(r.debit)}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{formatAmount(r.credit)}</td>
                      <td className="px-3 py-2 text-right font-medium tabular-nums">{formatAmount(r.running_balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
