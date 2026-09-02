"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCompany } from "@/components/company/company-provider";
import { Onboarding } from "@/components/company/onboarding";
import { fetchDayBook, VOUCHER_TYPE_LABELS } from "@/lib/api/vouchers";
import { formatAmount, formatDate } from "@/lib/format";
import type { DayBookRow, VoucherType } from "@/lib/types";

const TYPE_OPTIONS: Array<VoucherType | ""> = [
  "",
  "receipt",
  "payment",
  "journal",
  "contra",
];

export default function VouchersPage() {
  const { companies, activeCompany, activeFY } = useCompany();
  const [rows, setRows] = useState<DayBookRow[] | null>(null);
  const [type, setType] = useState<VoucherType | "">("");

  useEffect(() => {
    let cancelled = false;
    if (!activeCompany) return;
    fetchDayBook({
      companyId: activeCompany.id,
      fyId: activeFY?.id ?? null,
      type,
      limit: 50,
    })
      .then((data) => {
        if (!cancelled) setRows(data);
      })
      .catch(() => {
        if (!cancelled) setRows([]);
      });
    return () => {
      cancelled = true;
    };
  }, [activeCompany, activeFY, type]);

  const loading = rows === null && !!activeCompany;
  const rowsList = rows ?? [];

  if (companies.length === 0) {
    return <Onboarding />;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Vouchers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Day book for {activeCompany?.name}
            {activeFY ? ` · FY ${activeFY.name}` : ""}.
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            value={type}
            onValueChange={(v) => setType(v as VoucherType | "")}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All types</SelectItem>
              {TYPE_OPTIONS.filter(Boolean).map((t) => (
                <SelectItem key={t} value={t}>
                  {VOUCHER_TYPE_LABELS[t as VoucherType]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button asChild>
            <Link href="/vouchers/new">
              <Plus className="size-4" />
              New voucher
            </Link>
          </Button>
        </div>
      </div>

      {!activeCompany ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            Please select or create a company to view vouchers.
          </CardContent>
        </Card>
      ) : loading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                  <th className="px-3 py-2.5 font-medium">Date</th>
                  <th className="px-3 py-2.5 font-medium">Number</th>
                  <th className="px-3 py-2.5 font-medium">Type</th>
                  <th className="px-3 py-2.5 font-medium">Party / narration</th>
                  <th className="px-3 py-2.5 text-right font-medium">Debit</th>
                  <th className="px-3 py-2.5 text-right font-medium">Credit</th>
                  <th className="px-3 py-2.5 font-medium">Status</th>
                  <th className="w-9 px-1 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {rowsList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-3 py-10 text-center text-muted-foreground"
                    >
                      No vouchers yet. Create your first one.
                    </td>
                  </tr>
                ) : (
                  rowsList.map((row) => (
                    <tr key={row.id} className="border-b last:border-0">
                      <td className="px-3 py-2.5 whitespace-nowrap tabular-nums">
                        {formatDate(row.voucher_date)}
                      </td>
                      <td className="px-3 py-2.5 font-medium">
                        {row.voucher_number}
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge variant="secondary">
                          {VOUCHER_TYPE_LABELS[row.voucher_type]}
                        </Badge>
                      </td>
                      <td className="max-w-56 truncate px-3 py-2.5 text-muted-foreground">
                        {row.party_name ?? row.narration ?? "—"}
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums">
                        {formatAmount(row.debit)}
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums">
                        {formatAmount(row.credit)}
                      </td>
                      <td className="px-3 py-2.5">
                        {row.status === "cancelled" ? (
                          <Badge variant="destructive">Cancelled</Badge>
                        ) : (
                          <Badge variant="outline" className="text-emerald-600">
                            Posted
                          </Badge>
                        )}
                      </td>
                      <td className="px-2 py-2.5 text-right">
                        <Button variant="ghost" size="sm" className="size-8 px-0" asChild>
                          <Link href={`/vouchers/${row.id}`} aria-label="Open voucher">
                            <ArrowRight className="size-4" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}