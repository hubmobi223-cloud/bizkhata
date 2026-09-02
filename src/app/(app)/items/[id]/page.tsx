"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Boxes } from "lucide-react";
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
import { useCompany } from "@/components/company/company-provider";
import { Onboarding } from "@/components/company/onboarding";
import {
  fetchBatches,
  fetchItems,
  fetchStockBalance,
  fetchStockBook,
} from "@/lib/api/inventory";
import { VOUCHER_TYPE_LABELS } from "@/lib/api/vouchers";
import { formatAmount, formatDate, formatQty } from "@/lib/format";
import type { BatchRow, ItemRow, StockBalanceRow, StockBookRow } from "@/lib/types";

interface DetailData {
  item: ItemRow | null;
  balances: StockBalanceRow[];
  book: StockBookRow[];
  batches: BatchRow[];
}

export default function ItemDetailPage() {
  const params = useParams<{ id: string }>();
  const { companies, activeCompany } = useCompany();
  const [data, setData] = useState<DetailData | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!activeCompany || !params.id) return;
    Promise.all([
      fetchItems(activeCompany.id),
      fetchStockBalance(activeCompany.id, params.id),
      fetchStockBook(activeCompany.id, params.id),
      fetchBatches(activeCompany.id, params.id),
    ])
      .then(([items, balances, book, batches]) => {
        if (!cancelled) {
          setData({
            item: items.find((i) => i.id === params.id) ?? null,
            balances,
            book,
            batches,
          });
        }
      })
      .catch(() => {
        if (!cancelled) setData({ item: null, balances: [], book: [], batches: [] });
      });
    return () => {
      cancelled = true;
    };
  }, [activeCompany, params.id]);

  if (companies.length === 0) {
    return <Onboarding />;
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-40" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  const { item, balances, book, batches } = data;

  if (!item) {
    return (
      <div className="mx-auto max-w-5xl">
        <Card>
          <CardContent className="p-10 text-center text-sm text-muted-foreground">
            Item not found.
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQty = balances.reduce((s, b) => s + (b.qty ?? 0), 0);
  const currentValue = balances.reduce((s, b) => s + (b.value ?? 0), 0);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/items">
              <ArrowLeft className="size-4" />
              Items
            </Link>
          </Button>
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
              {item.name}
              {item.code && (
                <span className="text-muted-foreground">{item.code}</span>
              )}
            </h1>
            <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {item.hsn_sac && <span>HSN/SAC {item.hsn_sac}</span>}
              <span>· {item.unit?.name ?? "—"}</span>
              {item.item_type === "service" && <Badge variant="secondary">service</Badge>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-emerald-600">
            {item.gst_rate}% GST
          </Badge>
          {!item.is_active && <Badge variant="secondary">inactive</Badge>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Boxes className="size-4" />
              Stock in hand
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums">
              {formatQty(currentQty)}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                {item.unit?.name ?? ""}
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Stock value</p>
            <p className="mt-1 text-xl font-semibold tabular-nums">
              {formatAmount(currentValue)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Valuation method</p>
            <p className="mt-1 text-xl font-semibold capitalize">
              {item.valuation_method.replace("_", " ")}
            </p>
          </CardContent>
        </Card>
      </div>

      {balances.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Stock summary</CardTitle>
            <CardDescription>Per-batch quantities and value.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Batch</th>
                  <th className="px-3 py-2 text-right font-medium">Qty</th>
                  <th className="px-3 py-2 text-right font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                {balances.map((b) => (
                  <tr key={b.id} className="border-b last:border-0">
                    <td className="px-3 py-2 font-medium">
                      {b.batch?.batch_no ?? "No batch"}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {formatQty(b.qty)}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {formatAmount(b.value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {item.batch_tracking && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Batches</CardTitle>
            <CardDescription>Created when purchasing a batch-tracked item.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {batches.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">No batches yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="px-3 py-2 font-medium">Batch no</th>
                    <th className="px-3 py-2 font-medium">Manufactured</th>
                    <th className="px-3 py-2 font-medium">Expiry</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {batches.map((b) => (
                    <tr key={b.id} className="border-b last:border-0">
                      <td className="px-3 py-2 font-medium">{b.batch_no}</td>
                      <td className="px-3 py-2">{b.mfg_date ? formatDate(b.mfg_date) : "—"}</td>
                      <td className="px-3 py-2">{b.expiry_date ? formatDate(b.expiry_date) : "—"}</td>
                      <td className="px-3 py-2">
                        <Badge variant={b.status === "open" ? "outline" : "secondary"}>
                          {b.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Stock book</CardTitle>
          <CardDescription>Every movement of this item, oldest first.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {book.length === 0 ? (
            <p className="py-4 text-sm text-muted-foreground">
              No movements yet. Purchase to add stock, sell to consume it.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Date</th>
                  <th className="px-3 py-2 font-medium">Voucher</th>
                  <th className="px-3 py-2 font-medium">In / Out</th>
                  <th className="px-3 py-2 text-right font-medium">Qty</th>
                  <th className="px-3 py-2 text-right font-medium">Rate</th>
                  <th className="px-3 py-2 text-right font-medium">Value</th>
                  <th className="px-3 py-2 text-right font-medium">Balance</th>
                </tr>
              </thead>
              <tbody>
                {book.map((row) => (
                  <tr key={row.id} className="border-b last:border-0">
                    <td className="px-3 py-2 whitespace-nowrap tabular-nums">
                      {formatDate(row.stock_date)}
                    </td>
                    <td className="px-3 py-2">
                      {row.voucher_id ? (
                        <Link
                          href={`/vouchers/${row.voucher_id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {row.voucher_type ? VOUCHER_TYPE_LABELS[row.voucher_type] : "—"}
                        </Link>
                      ) : (
                        "—"
                      )}
                      {row.batch_no && (
                        <span className="ml-1 text-xs text-muted-foreground">
                          · {row.batch_no}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <Badge variant={row.movement === "in" ? "outline" : "secondary"}>
                        {row.movement === "in" ? "In" : "Out"}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {formatQty(row.inward_qty || row.outward_qty)}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {formatAmount(row.rate)}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {formatAmount(row.value)}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {formatQty(row.balance_qty)}
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