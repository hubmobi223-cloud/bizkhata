"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Picker } from "@/components/ledger-picker";
import { createItem, updateItem, ITEM_TYPE_LABELS } from "@/lib/api/inventory";
import type { ItemCategory, ItemRow, ItemType, Unit, ValuationMethod } from "@/lib/types";

const GST_RATES = [0, 0.25, 3, 5, 12, 18, 28];

export function CreateItemDialog({
  companyId,
  units,
  categories,
  trigger,
  onCreated,
  item,
  open: controlledOpen,
  onOpenChange,
}: {
  companyId: string;
  units: Unit[];
  categories: ItemCategory[];
  trigger?: React.ReactNode;
  onCreated?: () => void;
  item?: ItemRow | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const editing = !!item;
  const [open, setOpen] = useState(false);
  const isOpen = controlledOpen ?? open;
  const setOpenSafe = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState(item?.name ?? "");
  const [code, setCode] = useState(item?.code ?? "");
  const [hsnSac, setHsnSac] = useState(item?.hsn_sac ?? "");
  const [itemType, setItemType] = useState<ItemType>(item?.item_type ?? "goods");
  const [categoryId, setCategoryId] = useState<string | null>(item?.category_id ?? null);
  const [unitId, setUnitId] = useState<string | null>(item?.unit_id ?? units[0]?.id ?? null);
  const [gstRate, setGstRate] = useState(item?.gst_rate != null ? String(item.gst_rate) : "18");
  const [valuationMethod, setValuationMethod] =
    useState<ValuationMethod>(item?.valuation_method ?? "weighted_average");
  const [isSellable, setIsSellable] = useState(item?.is_sellable ?? true);
  const [isPurchasable, setIsPurchasable] = useState(item?.is_purchasable ?? true);
  const [batchTracking, setBatchTracking] = useState(item?.batch_tracking ?? false);
  const [expiryTracking, setExpiryTracking] = useState(item?.expiry_tracking ?? false);

  function reset() {
    setName("");
    setCode("");
    setHsnSac("");
    setItemType("goods");
    setCategoryId(null);
    setUnitId(units[0]?.id ?? null);
    setGstRate("18");
    setValuationMethod("weighted_average");
    setIsSellable(true);
    setIsPurchasable(true);
    setBatchTracking(false);
    setExpiryTracking(false);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Item name is required");
      return;
    }
    if (!unitId) {
      toast.error("Please choose a unit of measure");
      return;
    }
    const rate = parseFloat(gstRate);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      toast.error("Please enter a valid GST rate");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        company_id: companyId,
        category_id: categoryId ?? undefined,
        unit_id: unitId!,
        name: name.trim(),
        code: code.trim() || undefined,
        hsn_sac: hsnSac.trim() || undefined,
        gst_rate: rate,
        item_type: itemType,
        batch_tracking: batchTracking,
        expiry_tracking: expiryTracking,
        valuation_method: valuationMethod,
        is_sellable: isSellable,
        is_purchasable: isPurchasable,
      };
      if (item) {
        await updateItem(item.id, payload);
        toast.success("Item updated");
      } else {
        await createItem(payload);
        toast.success("Item created");
      }
      onCreated?.();
      setOpenSafe(false);
      reset();
    } catch (err) {
      toast.error("Could not save item", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const showCreateUnitHint = units.length === 0;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(next) => {
        setOpenSafe(next);
        if (!next) reset();
      }}
    >
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit item" : "New item"}</DialogTitle>
          <DialogDescription>
            {editing
              ? "Update the product or service in your item master."
              : "Add a product or service to your inventory master."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {showCreateUnitHint && (
            <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              You need at least one unit of measure before creating an item.
              Create one on the Items page.
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="item-name">Item name</Label>
            <Input
              id="item-name"
              placeholder="e.g. A4 Paper Ream"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="item-code">Code (optional)</Label>
              <Input
                id="item-code"
                placeholder="e.g. ITM-001"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-hsn">HSN / SAC</Label>
              <Input
                id="item-hsn"
                placeholder="e.g. 4802"
                value={hsnSac}
                onChange={(e) => setHsnSac(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Item type</Label>
              <Select
                value={itemType}
                onValueChange={(v) => setItemType(v as ItemType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(ITEM_TYPE_LABELS) as ItemType[]).map((t) => (
                    <SelectItem key={t} value={t}>
                      {ITEM_TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>GST rate (%)</Label>
              <Select value={gstRate} onValueChange={setGstRate}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GST_RATES.map((r) => (
                    <SelectItem key={r} value={String(r)}>
                      {r === 0 ? "Exempt (0%)" : `${r}%`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Category (optional)</Label>
              <Picker
                options={categories.map((c) => ({ id: c.id, name: c.name }))}
                value={categoryId}
                onChange={setCategoryId}
                placeholder="Choose a category"
                searchPlaceholder="Search categories…"
              />
            </div>
            <div className="space-y-2">
              <Label>Unit (required)</Label>
              <Picker
                options={units.map((u) => ({ id: u.id, name: u.name, code: u.uqc ?? undefined }))}
                value={unitId}
                onChange={setUnitId}
                placeholder="Choose a unit"
                searchPlaceholder="Search units…"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Valuation method</Label>
              <Select
                value={valuationMethod}
                onValueChange={(v) => setValuationMethod(v as ValuationMethod)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weighted_average">Weighted average</SelectItem>
                  <SelectItem value="fifo">FIFO (batch based)</SelectItem>
                </SelectContent>
              </Select>
              {valuationMethod === "fifo" && (
                <Badge variant="secondary" className="mt-1">
                  Batches must be used on outward stock
                </Badge>
              )}
            </div>
            <div className="space-y-2">
              <Label className="block">Flags</Label>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={isSellable}
                    onCheckedChange={(v) => setIsSellable(!!v)}
                  />
                  Sellable
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={isPurchasable}
                    onCheckedChange={(v) => setIsPurchasable(!!v)}
                  />
                  Purchasable
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={batchTracking}
                    onCheckedChange={(v) => {
                      setBatchTracking(!!v);
                      if (v) setExpiryTracking(true);
                    }}
                  />
                  Batch tracking
                </label>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setOpenSafe(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || showCreateUnitHint}>
              {submitting && <Loader2 className="animate-spin" />}
              {editing ? "Save item" : "Create item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}