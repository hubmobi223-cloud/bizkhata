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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Picker } from "@/components/ledger-picker";
import { createLedger, updateLedger, GROUP_TYPE_LABELS } from "@/lib/api/ledgers";
import { INDIAN_STATES } from "@/lib/states";
import type { AccountGroup, LedgerRow } from "@/lib/types";

type OpeningMode = "none" | "debit" | "credit";

export function CreateLedgerDialog({
  companyId,
  groups,
  trigger,
  onCreated,
  ledger,
  open: controlledOpen,
  onOpenChange,
}: {
  companyId: string;
  groups: AccountGroup[];
  trigger?: React.ReactNode;
  onCreated?: () => void;
  ledger?: LedgerRow | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const editing = !!ledger;
  const [open, setOpen] = useState(false);
  const isOpen = controlledOpen ?? open;
  const setOpenSafe = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState(ledger?.name ?? "");
  const [groupId, setGroupId] = useState<string | null>(ledger?.account_group_id ?? null);
  const [code, setCode] = useState(ledger?.code ?? "");
  const [openingMode, setOpeningMode] = useState<OpeningMode>(
    ledger
      ? ledger.opening_debit > 0
        ? "debit"
        : ledger.opening_credit > 0
          ? "credit"
          : "none"
      : "none"
  );
  const [openingAmount, setOpeningAmount] = useState(
    ledger
      ? String(Math.max(ledger.opening_debit, ledger.opening_credit) || "")
      : ""
  );
  const [isParty, setIsParty] = useState(ledger?.is_party ?? false);
  const [gstin, setGstin] = useState(ledger?.gstin ?? "");
  const [stateCode, setStateCode] = useState(ledger?.state_code ?? "");
  const [isCashBank, setIsCashBank] = useState(ledger?.is_cash_bank ?? false);
  const [isTaxLedger, setIsTaxLedger] = useState(ledger?.is_tax_ledger ?? false);
  const [taxRate, setTaxRate] = useState(ledger?.tax_rate ? String(ledger.tax_rate) : "");

  const groupOptions = groups.map((g) => ({
    id: g.id,
    name: g.is_summary ? `${g.name} (summary)` : g.name,
    code: GROUP_TYPE_LABELS[g.group_type],
  }));

  function reset() {
    setName("");
    setGroupId(null);
    setCode("");
    setOpeningMode("none");
    setOpeningAmount("");
    setIsParty(false);
    setGstin("");
    setStateCode("");
    setIsCashBank(false);
    setIsTaxLedger(false);
    setTaxRate("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Ledger name is required");
      return;
    }
    if (!groupId) {
      toast.error("Please choose an account group");
      return;
    }
    const amount = parseFloat(openingAmount || "0") || 0;
    if (openingMode !== "none" && amount <= 0) {
      toast.error("Opening balance must be greater than zero");
      return;
    }
    if (isCashBank && isTaxLedger) {
      toast.error("A ledger cannot be both cash/bank and a tax ledger");
      return;
    }
    if (isTaxLedger) {
      const rate = parseFloat(taxRate);
      if (isNaN(rate) || rate < 0) {
        toast.error("Enter a valid tax rate");
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        company_id: companyId,
        account_group_id: groupId!,
        name: name.trim(),
        code: code.trim() || undefined,
        opening_debit: openingMode === "debit" ? amount : 0,
        opening_credit: openingMode === "credit" ? amount : 0,
        is_party: isParty,
        is_cash_bank: isCashBank,
        is_tax_ledger: isTaxLedger,
        tax_rate: isTaxLedger ? parseFloat(taxRate) : 0,
        gstin: isParty ? gstin : undefined,
        state_code: isParty ? stateCode : undefined,
      };
      if (ledger) {
        await updateLedger(ledger.id, payload);
        toast.success("Ledger updated");
      } else {
        await createLedger(payload);
        toast.success("Ledger created");
      }
      onCreated?.();
      setOpenSafe(false);
      reset();
    } catch (err) {
      toast.error("Could not create ledger", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setSubmitting(false);
    }
  }

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
          <DialogTitle>{editing ? "Edit ledger" : "New ledger"}</DialogTitle>
          <DialogDescription>
            {editing
              ? "Update ledger details. Opening balance changes for this ledger will only apply as period adjustments."
              : "Create a ledger under an existing account group. Mark parties to capture GSTIN and track debtors/creditors."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ledger-name">Ledger name</Label>
            <Input
              id="ledger-name"
              placeholder="e.g. Ramesh Auto Spares"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Account group</Label>
              <Picker
                options={groupOptions}
                value={groupId}
                onChange={setGroupId}
                placeholder="Choose a group"
                searchPlaceholder="Search groups…"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ledger-code">Code (optional)</Label>
              <Input
                id="ledger-code"
                placeholder="e.g. 1101"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Opening balance</Label>
            <div className="flex flex-wrap items-center gap-3">
              <RadioGroup
                value={openingMode}
                onValueChange={(v) => setOpeningMode(v as OpeningMode)}
                className="flex items-center gap-3"
              >
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="none" />
                  None
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="debit" />
                  Debit
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="credit" />
                  Credit
                </label>
              </RadioGroup>
              <Input
                type="number"
                min="0"
                step="0.01"
                className="ml-auto w-36"
                placeholder="Amount"
                value={openingAmount}
                onChange={(e) => setOpeningAmount(e.target.value)}
                disabled={openingMode === "none"}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={isParty}
                onCheckedChange={(v) => setIsParty(!!v)}
              />
              Party
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={isCashBank}
                onCheckedChange={(v) => setIsCashBank(!!v)}
              />
              Cash / Bank
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={isTaxLedger}
                onCheckedChange={(v) => setIsTaxLedger(!!v)}
              />
              Tax ledger
            </label>
          </div>

          {isTaxLedger && (
            <div className="space-y-2">
              <Label htmlFor="tax-rate">Tax rate (%)</Label>
              <Input
                id="tax-rate"
                type="number"
                min="0"
                step="0.25"
                className="w-36"
                placeholder="e.g. 18"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
              />
            </div>
          )}

          {isParty && (
            <div className="grid gap-4 rounded-lg border p-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ledger-gstin">GSTIN (optional)</Label>
                <Input
                  id="ledger-gstin"
                  placeholder="22AAAAA0000A1Z5"
                  maxLength={15}
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ledger-state">State (optional)</Label>
                <Select value={stateCode} onValueChange={setStateCode}>
                  <SelectTrigger id="ledger-state" className="w-full">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_STATES.map((s) => (
                      <SelectItem key={s.code} value={s.code}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpenSafe(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="animate-spin" />}
              {editing ? "Save ledger" : "Create ledger"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}