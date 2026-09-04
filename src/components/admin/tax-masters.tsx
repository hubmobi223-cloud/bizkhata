"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Pencil, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  createTaxMaster,
  fetchTaxLedgers,
  listTaxMasters,
  updateTaxMaster,
} from "@/lib/api/admin";
import type { LedgerRow, TaxMaster } from "@/lib/types";

export function TaxMastersTab({ companyId }: { companyId: string }) {
  const [masters, setMasters] = useState<TaxMaster[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await listTaxMasters(companyId);
      setMasters(data);
    } catch (err) {
      toast.error("Could not load tax masters", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    void Promise.resolve().then(async () => {
      try {
        const data = await listTaxMasters(companyId);
        setMasters(data);
      } catch (err) {
        console.error("[TaxMastersTab] load failed:", err);
        toast.error("Could not load tax masters", {
          description: err instanceof Error ? err.message : "Unknown error",
        });
      } finally {
        setLoading(false);
      }
    });
  }, [companyId]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="text-base">Tax masters</CardTitle>
          <CardDescription>
            Define GST rates and which output / input GST ledgers they post to on
            invoices.
          </CardDescription>
        </div>
        <TaxMasterDialog companyId={companyId} onSaved={load} label="New tax master" />
      </CardHeader>
      <CardContent className="space-y-2">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : masters.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No tax masters defined yet.
          </p>
        ) : (
          masters.map((m) => (
            <div key={m.id} className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{m.name}</p>
                  <Badge variant="secondary" className="tabular-nums">
                    {m.rate_pct}%
                  </Badge>
                  {!m.is_active && <Badge variant="outline">Inactive</Badge>}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Output: {m.output_ledger?.name ?? "not set"} &middot; Input:{" "}
                  {m.input_ledger?.name ?? "not set"}
                </p>
              </div>
              <TaxMasterDialog companyId={companyId} onSaved={load} master={m} label="Edit" />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

function TaxMasterDialog({
  companyId,
  onSaved,
  master,
  label,
}: {
  companyId: string;
  onSaved: () => void;
  master?: TaxMaster;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [ledgers, setLedgers] = useState<LedgerRow[]>([]);
  const [name, setName] = useState(master?.name ?? "");
  const [rate, setRate] = useState(master?.rate_pct?.toString() ?? "");
  const [output, setOutput] = useState(master?.output_ledger_id ?? "");
  const [input, setInput] = useState(master?.input_ledger_id ?? "");
  const [active, setActive] = useState(master?.is_active ?? true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    fetchTaxLedgers(companyId)
      .then(setLedgers)
      .catch(() => toast.error("Could not load tax ledgers"));
  }, [open, companyId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const numericRate = Number(rate);
      if (master) {
        await updateTaxMaster(master.id, {
          name: name.trim(),
          rate_pct: numericRate,
          output_ledger_id: output || null,
          input_ledger_id: input || null,
          is_active: active,
        });
      } else {
        await createTaxMaster({
          company_id: companyId,
          name: name.trim(),
          rate_pct: numericRate,
          output_ledger_id: output || undefined,
          input_ledger_id: input || undefined,
        });
      }
      setOpen(false);
      onSaved();
      toast.success(master ? "Tax master updated" : "Tax master created");
    } catch (err) {
      toast.error("Could not save tax master", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={master ? "outline" : "default"} size="sm">
          {master ? <Pencil className="mr-1.5 size-4" /> : <Plus className="mr-1.5 size-4" />}
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{master ? "Edit tax master" : "New tax master"}</DialogTitle>
          <DialogDescription>
            Map a GST rate to its output and input ledger accounts used in billing.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="tm-name">Name</Label>
              <Input id="tm-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="GST 18%" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tm-rate">Rate (%)</Label>
              <Input id="tm-rate" type="number" step="0.01" min="0" value={rate} onChange={(e) => setRate(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Output GST ledger (charged on sales)</Label>
            <Select value={output} onValueChange={setOutput}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select output ledger" />
              </SelectTrigger>
              <SelectContent>
                {ledgers.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Input GST ledger (paid on purchases)</Label>
            <Select value={input} onValueChange={setInput}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select input ledger" />
              </SelectTrigger>
              <SelectContent>
                {ledgers.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {master && (
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={active} onCheckedChange={(v) => setActive(v === true)} />
              Active
            </label>
          )}
          <DialogFooter>
            <Button type="submit" disabled={saving || !name.trim() || rate === ""}>
              {saving && <Loader2 className="mr-1.5 size-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
