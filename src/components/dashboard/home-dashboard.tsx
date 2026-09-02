"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Banknote,
  BookOpen,
  Boxes,
  CheckCircle2,
  ReceiptText,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompany } from "@/components/company/company-provider";
import { Onboarding } from "@/components/company/onboarding";
import { createClient } from "@/lib/supabase/client";
import { fetchLedgers, fetchTrialBalance } from "@/lib/api/ledgers";
import { fetchDayBook, VOUCHER_TYPE_LABELS } from "@/lib/api/vouchers";
import { formatAmount, formatINR, formatDateShort } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CompanyCounts, DayBookRow, LedgerRow, TrialBalanceRow } from "@/lib/types";

function StatCard({
  icon,
  label,
  value,
  loading,
  hint,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | undefined;
  loading: boolean;
  hint?: string;
  href?: string;
}) {
  const body = (
    <Card className="transition-shadow hover:shadow-sm">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          {loading ? (
            <Skeleton className="mt-1 h-7 w-24" />
          ) : (
            <p className="truncate text-xl font-semibold tabular-nums">
              {value ?? "—"}
            </p>
          )}
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        {href && !loading && (
          <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
        )}
      </CardContent>
    </Card>
  );
  if (href) {
    return (
      <Link href={href} aria-label={`Open ${label}`}>
        {body}
      </Link>
    );
  }
  return body;
}

interface DashboardRows {
  ledgers: LedgerRow[];
  trialBalance: TrialBalanceRow[];
  recent: DayBookRow[];
  counts: CompanyCounts;
  inventoryValue: number;
}

export function HomeDashboard() {
  const { companies, activeCompany, activeFY } = useCompany();
  const [data, setData] = useState<DashboardRows | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!activeCompany) return;
      const supabase = createClient();
      const companyId = activeCompany.id;
      const [ledgers, trialBalance, recent, inventoryRows, ledgersCount, itemsCount, vouchersCount] =
        await Promise.all([
          fetchLedgers(companyId),
          fetchTrialBalance(companyId),
          fetchDayBook({
            companyId,
            fyId: activeFY?.id ?? null,
            limit: 5,
          }),
          supabase
            .from("stock_balances")
            .select("value")
            .eq("company_id", companyId),
          supabase
            .from("ledgers")
            .select("id", { count: "exact", head: true })
            .eq("company_id", companyId),
          supabase
            .from("items")
            .select("id", { count: "exact", head: true })
            .eq("company_id", companyId)
            .eq("is_active", true),
          supabase
            .from("vouchers")
            .select("id", { count: "exact", head: true })
            .eq("company_id", companyId)
            .eq("status", "posted")
            .eq("fy_id", activeFY?.id ?? ""),
        ]);
      if (!cancelled) {
        setData({
          ledgers,
          trialBalance,
          recent,
          inventoryValue: (inventoryRows.data ?? []).reduce(
            (sum: number, row: { value: number }) => sum + (row.value ?? 0),
            0
          ),
          counts: {
            ledgers: ledgersCount.count ?? 0,
            items: itemsCount.count ?? 0,
            vouchers: vouchersCount.count ?? 0,
          },
        });
      }
    }

    load().catch(() => {
      if (!cancelled) {
        setData({ ledgers: [], trialBalance: [], recent: [], counts: { ledgers: 0, items: 0, vouchers: 0 }, inventoryValue: 0 });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [activeCompany, activeFY]);

  const loading = data === null && !!activeCompany;

  if (companies.length === 0) {
    return <Onboarding />;
  }

  const netByLedger = new Map<string, number>();
  (data?.trialBalance ?? []).forEach((row) =>
    netByLedger.set(row.ledger_id, row.net_balance ?? 0)
  );

  const cashBank = (data?.ledgers ?? [])
    .filter((l) => l.is_cash_bank)
    .reduce((sum, l) => sum + (netByLedger.get(l.id) ?? 0), 0);

  const debtors = data?.trialBalance
    .filter((row) => row.group_name === "Sundry Debtors")
    .reduce((sum, row) => sum + (row.net_balance ?? 0), 0);

  const creditors = data?.trialBalance
    .filter((row) => row.group_name === "Sundry Creditors")
    .reduce((sum, row) => sum + (row.net_balance ?? 0), 0);

  const income = data?.trialBalance
    .filter((row) => row.group_type === "income")
    .reduce((sum, row) => sum + (row.net_balance ?? 0), 0);
  const expenses = data?.trialBalance
    .filter((row) => row.group_type === "expense")
    .reduce((sum, row) => sum + (row.net_balance ?? 0), 0);
  const netProfit = -(income ?? 0) - (expenses ?? 0);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {activeCompany?.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Financial overview for {activeFY ? `FY ${activeFY.name}` : "current year"}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {activeCompany?.gstin && (
            <Badge variant="outline" className="font-mono">
              GSTIN: {activeCompany.gstin}
            </Badge>
          )}
          {activeCompany?.state_code && (
            <Badge variant="outline">
              State code: {activeCompany.state_code}
            </Badge>
          )}
          <Button asChild size="sm" variant="outline">
            <Link href="/vouchers/new">New voucher</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Wallet />}
          label="Cash & Bank"
          value={formatINR(cashBank)}
          loading={loading}
          href="/ledgers"
        />
        <StatCard
          icon={<Users />}
          label="Debtors (receivable)"
          value={formatINR(debtors)}
          loading={loading}
          href="/ledgers"
        />
        <StatCard
          icon={<Banknote />}
          label="Creditors (payable)"
          value={formatINR(creditors !== undefined ? -creditors : undefined)}
          loading={loading}
          href="/ledgers"
        />
        <StatCard
          icon={
            netProfit >= 0 ? (
              <TrendingUp className="text-emerald-600" />
            ) : (
              <TrendingDown className="text-destructive" />
            )
          }
          label="Net profit (YTD)"
          value={formatINR(netProfit)}
          loading={loading}
          hint={netProfit >= 0 ? "Profit" : "Loss"}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Boxes />}
          label="Inventory value"
          value={formatINR(data?.inventoryValue)}
          loading={loading}
          href="/items"
        />
        <StatCard
          icon={<BookOpen />}
          label="Ledgers"
          value={String(data?.counts.ledgers ?? 0)}
          loading={loading}
          href="/ledgers"
        />
        <StatCard
          icon={<Boxes />}
          label="Active items"
          value={String(data?.counts.items ?? 0)}
          loading={loading}
        />
        <StatCard
          icon={<ReceiptText />}
          label="Vouchers posted"
          value={String(data?.counts.vouchers ?? 0)}
          loading={loading}
          href="/vouchers"
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Recent vouchers</CardTitle>
            <CardDescription>Latest day book entries for this year.</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/vouchers">View all</Link>
          </Button>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {loading || !data ? (
            <div className="space-y-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          ) : data.recent.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No vouchers yet. Post your first voucher to see it here.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Date</th>
                  <th className="px-3 py-2 font-medium">Number</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Narration</th>
                  <th className="px-3 py-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.recent.map((row) => (
                  <tr key={row.id} className="border-b last:border-0">
                    <td className="px-3 py-2 whitespace-nowrap tabular-nums">
                      {formatDateShort(row.voucher_date)}
                    </td>
                    <td className="px-3 py-2 font-medium">
                      <Link
                        href={`/vouchers/${row.id}`}
                        className="text-primary hover:underline"
                      >
                        {row.voucher_number}
                      </Link>
                    </td>
                    <td className="px-3 py-2">
                      <Badge variant="secondary">
                        {VOUCHER_TYPE_LABELS[row.voucher_type]}
                      </Badge>
                    </td>
                    <td className="max-w-64 truncate px-3 py-2 text-muted-foreground">
                      {row.party_name ?? row.narration ?? "—"}
                    </td>
                    <td
                      className={cn(
                        "px-3 py-2 text-right tabular-nums",
                        row.debit - row.credit > 0
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {formatAmount(Math.abs(row.debit - row.credit))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Company setup</CardTitle>
          <CardDescription>
            Everything BizKhata seeded automatically for this company.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="size-4 text-emerald-600" />
            Company created
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="size-4 text-emerald-600" />
            Financial year {activeFY ? `(${activeFY.name})` : "created"}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="size-4 text-emerald-600" />
            Default account groups and ledgers seeded
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="size-4 text-emerald-600" />
            GST tax ledgers (CGST / SGST / IGST) ready
          </div>
        </CardContent>
      </Card>
    </div>
  );
}