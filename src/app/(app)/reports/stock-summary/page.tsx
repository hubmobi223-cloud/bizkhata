"use client";

import { useEffect, useState } from "react";
import { Boxes } from "lucide-react";
import { useCompany } from "@/components/company/company-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchStockSummary } from "@/lib/api/reports";
import { formatAmount, formatQty } from "@/lib/format";
import type { StockSummaryRow } from "@/lib/api/reports";

function StockSummaryView({ companyId }: { companyId: string }) {
  const [rows, setRows] = useState<StockSummaryRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchStockSummary(companyId)
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
  const totalValue = (rows ?? []).reduce((s, r) => s + r.value, 0);
  const lowStock = (rows ?? []).filter((r) => r.qty > 0 && r.qty <= 5);

  return (
    <>
      {!isLoading && (
        <div className="flex justify-end">
          <Button size="sm" variant="outline" onClick={() => window.print()}>
            Print
          </Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base flex items-center gap-2">
              <Boxes className="size-4 text-primary" /> Total stock value
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">{formatAmount(totalValue)}</CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base flex items-center gap-2">
              <Boxes className="size-4 text-amber-500" /> Low stock items
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">{lowStock.length}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Item quantities &amp; valuation</CardTitle>
          <CardDescription>Current stock position for each item.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : error ? (
            <p className="py-6 text-center text-sm text-destructive">{error}</p>
          ) : (rows ?? []).length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No items in stock.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Item</th>
                  <th className="px-3 py-2 font-medium">HSN</th>
                  <th className="px-3 py-2 font-medium">Category</th>
                  <th className="px-3 py-2 text-right font-medium">Qty</th>
                  <th className="px-3 py-2 text-right font-medium">GST%</th>
                  <th className="px-3 py-2 text-right font-medium">Value</th>
                  <th className="px-3 py-2 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows?.map((r) => (
                  <tr key={r.item_id} className="border-b last:border-0">
                    <td className="px-3 py-2 font-medium">{r.name}</td>
                    <td className="px-3 py-2 font-mono text-xs tabular-nums">{r.hsn_sac ?? "—"}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r.category ?? "—"}</td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {formatQty(r.qty)} {r.unit ?? ""}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">{r.gst_rate}%</td>
                    <td className="px-3 py-2 text-right font-medium tabular-nums">{formatAmount(r.value)}</td>
                    <td className="px-3 py-2 text-right">
                      {r.qty === 0 ? (
                        <Badge variant="secondary">Out of stock</Badge>
                      ) : r.qty <= 5 ? (
                        <Badge variant="destructive">Low stock</Badge>
                      ) : (
                        <Badge className="bg-emerald-600 text-white">In stock</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default function StockSummaryReportPage() {
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
        <h1 className="text-2xl font-semibold tracking-tight">Stock Summary</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {activeCompany.name} / {activeFY ? `FY ${activeFY.name}` : "current year"}
        </p>
      </div>

      <StockSummaryView key={activeCompany.id} companyId={activeCompany.id} />
    </div>
  );
}
