"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Boxes, FolderPlus, Layers, Scale, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompany } from "@/components/company/company-provider";
import { Onboarding } from "@/components/company/onboarding";
import { CreateUnitDialog } from "@/components/items/unit-dialog";
import { CreateCategoryDialog } from "@/components/items/category-dialog";
import { CreateItemDialog } from "@/components/items/item-dialog";
import {
  fetchAllStock,
  fetchCategories,
  fetchItems,
  fetchUnits,
} from "@/lib/api/inventory";
import { formatAmount, formatQty } from "@/lib/format";
import type {
  ItemCategory,
  ItemRow,
  Unit,
} from "@/lib/types";

interface ItemsData {
  units: Unit[];
  categories: ItemCategory[];
  items: ItemRow[];
  stock: Map<string, { qty: number; value: number }>;
}

export default function ItemsPage() {
  const { companies, activeCompany } = useCompany();
  const [data, setData] = useState<ItemsData | null>(null);
  const [query, setQuery] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    if (!activeCompany) return;
    Promise.all([
      fetchUnits(activeCompany.id),
      fetchCategories(activeCompany.id),
      fetchItems(activeCompany.id),
      fetchAllStock(activeCompany.id),
    ])
      .then(([units, categories, items, stock]) => {
        if (!cancelled) setData({ units, categories, items, stock });
      })
      .catch(() => {
        if (!cancelled) {
          setData({ units: [], categories: [], items: [], stock: new Map() });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [activeCompany, reloadKey]);

  const loading = data === null && !!activeCompany;
  const units = useMemo(() => data?.units ?? [], [data]);
  const categories = useMemo(() => data?.categories ?? [], [data]);
  const items = useMemo(() => data?.items ?? [], [data]);
  const stock = useMemo(() => data?.stock ?? new Map(), [data]);

  const totalStockValue = useMemo(
    () =>
      Array.from(stock.values()).reduce((sum, s) => sum + s.value, 0),
    [stock]
  );

  const visibleItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        (i.code ?? "").toLowerCase().includes(q) ||
        (i.hsn_sac ?? "").toLowerCase().includes(q)
    );
  }, [items, query]);

  if (companies.length === 0) {
    return <Onboarding />;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Items &amp; Inventory
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {items.length} items across {categories.length} categories · stock
            value {formatAmount(totalStockValue)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <CreateUnitDialog
            companyId={activeCompany?.id ?? ""}
            onCreated={() => setReloadKey((k) => k + 1)}
            trigger={
              <Button variant="outline">
                <Scale className="size-4" />
                New unit
              </Button>
            }
          />
          <CreateCategoryDialog
            companyId={activeCompany?.id ?? ""}
            onCreated={() => setReloadKey((k) => k + 1)}
            trigger={
              <Button variant="outline">
                <FolderPlus className="size-4" />
                New category
              </Button>
            }
          />
          <CreateItemDialog
            companyId={activeCompany?.id ?? ""}
            units={units}
            categories={categories}
            onCreated={() => setReloadKey((k) => k + 1)}
            trigger={
              <Button>
                <Layers className="size-4" />
                New item
              </Button>
            }
          />
        </div>
      </div>

      {units.length === 0 && (
        <Card className="border-amber-300 bg-amber-50">
          <CardContent className="flex items-center justify-between gap-4 p-4 text-sm text-amber-800">
            <div className="flex items-center gap-2">
              <Boxes className="size-4" />
              No units of measure yet. Create one before adding items.
            </div>
            <CreateUnitDialog
              companyId={activeCompany?.id ?? ""}
              onCreated={() => setReloadKey((k) => k + 1)}
              trigger={<Button variant="outline" size="sm" className="border-amber-300">Create unit</Button>}
            />
          </CardContent>
        </Card>
      )}

      <div className="relative">
        <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-8"
          placeholder="Search items…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading ? (
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
                  <th className="px-3 py-2.5 font-medium">Item</th>
                  <th className="px-3 py-2.5 font-medium">Category</th>
                  <th className="px-3 py-2.5 font-medium">HSN/SAC</th>
                  <th className="px-3 py-2.5 font-medium">Unit</th>
                  <th className="px-3 py-2.5 text-right font-medium">GST</th>
                  <th className="px-3 py-2.5 text-right font-medium">Stock</th>
                  <th className="px-3 py-2.5 text-right font-medium">Stock value</th>
                  <th className="w-9 px-1 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {visibleItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-3 py-10 text-center text-muted-foreground">
                      No items found.
                    </td>
                  </tr>
                ) : (
                  visibleItems.map((item) => {
                    const stockRow = stock.get(item.id);
                    return (
                      <tr key={item.id} className="border-b last:border-0">
                        <td className="px-3 py-2.5">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-medium">{item.name}</span>
                            {item.code && (
                              <span className="text-xs text-muted-foreground">{item.code}</span>
                            )}
                            {item.item_type === "service" && (
                              <Badge variant="secondary">service</Badge>
                            )}
                            {!item.is_active && <Badge variant="secondary">inactive</Badge>}
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-muted-foreground">
                          {item.category?.name ?? "—"}
                        </td>
                        <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">
                          {item.hsn_sac ?? "—"}
                        </td>
                        <td className="px-3 py-2.5">{item.unit?.name ?? "—"}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums">
                          {item.gst_rate}%
                        </td>
                        <td className="px-3 py-2.5 text-right tabular-nums">
                          {formatQty(stockRow?.qty ?? 0)}
                        </td>
                        <td className="px-3 py-2.5 text-right tabular-nums">
                          {formatAmount(stockRow?.value ?? 0)}
                        </td>
                        <td className="px-2 py-2.5 text-right">
                          <Button variant="ghost" size="sm" className="size-8 px-0" asChild>
                            <Link href={`/items/${item.id}`} aria-label="Open item">
                              <ArrowRight className="size-4" />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}