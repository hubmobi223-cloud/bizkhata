"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ShoppingBag, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { formatAmount, formatDateShort } from "@/lib/format";
import type { DayBookRow, VoucherType } from "@/lib/types";

export default function BillingPage() {
  const { companies, activeCompany, activeFY } = useCompany();
  const [rows, setRows] = useState<DayBookRow[] | null>(null);
  const [type, setType] = useState<VoucherType | "">("");

  useEffect(() => {
    let cancelled = false;
    if (!activeCompany) return;
    fetchDayBook({
      companyId: activeCompany.id,
      fyId: activeFY?.id ?? null,
      type: type === "" ? undefined : type,
      limit: 10,
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

  if (companies.length === 0) {
    return <Onboarding />;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Record sales and purchases with GST-aware invoices that post stock
          automatically.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShoppingCart />
              Sales
            </CardTitle>
            <CardDescription>
              Customer invoice with items, GST and optional collection.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-end">
            <Button asChild>
              <Link href="/billing/new?type=sales">
                New sales invoice
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShoppingBag />
              Purchases
            </CardTitle>
            <CardDescription>
              Supplier bill with items, GST input credit and optional payment.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-end">
            <Button asChild variant="outline">
              <Link href="/billing/new?type=purchase">
                New purchase bill
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Recent bills</CardTitle>
            <CardDescription>Latest sales, purchases and credit notes.</CardDescription>
          </div>
          <Select
            value={type}
            onValueChange={(v) => setType(v as VoucherType | "")}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All bills" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All bills</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="purchase">Purchase</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {rows === null ? (
            <div className="space-y-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          ) : rows.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No bills yet.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Date</th>
                  <th className="px-3 py-2 font-medium">Number</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Party</th>
                  <th className="px-3 py-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b last:border-0">
                    <td className="px-3 py-2 whitespace-nowrap tabular-nums">
                      {formatDateShort(row.voucher_date)}
                    </td>
                    <td className="px-3 py-2 font-medium">
                      <Link href={`/vouchers/${row.id}`} className="text-primary hover:underline">
                        {row.voucher_number}
                      </Link>
                    </td>
                    <td className="px-3 py-2">
                      <Badge variant="secondary">
                        {VOUCHER_TYPE_LABELS[row.voucher_type]}
                      </Badge>
                    </td>
                    <td className="px-3 py-2">{row.party_name ?? "—"}</td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {formatAmount(Math.abs(row.debit - row.credit))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}