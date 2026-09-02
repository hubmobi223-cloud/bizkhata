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
import { createLedger, GROUP_TYPE_LABELS } from "@/lib/api/ledgers";
import { INDIAN_STATES } from "@/lib/states";
import type { AccountGroup } from "@/lib/types";

type OpeningMode = "none" | "debit" | "credit";

export function CreateLedgerDialog({
  companyId,
  groups,
  trigger,
  onCreated,
}: {
  companyId: string;
  groups: AccountGroup[];
  trigger?: React.ReactNode;
  onCreated?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [groupId, setGroupId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [openingMode, setOpeningMode] = useState<OpeningMode>("none");
  const [openingAmount, setOpeningAmount] = useState("");
  const [isParty, setIsParty] = useState(false);
  const [gstin, setGstin] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [isCashBank, setIsCashBank] = useState(false);
  const [isTaxLedger, setIsTaxLedger] = useState(false);
  const [taxRate, setTaxRate] = useState("");

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
      await createLedger({
        company_id: companyId,
        account_group_id: groupId,
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
      });
      toast.success("Ledger created");
      onCreated?.();
      setOpen(false);
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
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New ledger</DialogTitle>
          <DialogDescription>
            Create a ledger under an existing account group. Mark parties to
            capture GSTIN and track debtors/creditors.
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
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="animate-spin" />}
              Create ledger
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}