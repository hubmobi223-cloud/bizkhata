"use client";

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
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
import { INDIAN_STATES } from "@/lib/states";
import { useCompany } from "./company-provider";

export function CreateCompanyDialog({ trigger }: { trigger?: ReactNode }) {
  const { createCompany } = useCompany();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [gstin, setGstin] = useState("");
  const [stateCode, setStateCode] = useState("");

  function reset() {
    setName("");
    setGstin("");
    setStateCode("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Company name is required");
      return;
    }

    setSubmitting(true);
    try {
      const created = await createCompany({
        name: name.trim(),
        gstin: gstin.trim() || undefined,
        state_code: stateCode || undefined,
      });
      if (!created) {
        toast.error("Could not create company");
        return;
      }
      toast.success("Company created", {
        description:
          "Chart of accounts, default ledgers and the current financial year were seeded automatically.",
      });
      setOpen(false);
      reset();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "message" in err
            ? String((err as { message: unknown }).message)
            : "Unknown error";
      toast.error("Could not create company", {
        description: message,
      });
      console.error("Create company error:", err);
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a new company</DialogTitle>
          <DialogDescription>
            BizKhata will automatically set up a financial year, default
            account groups and core ledgers for the company.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company name</Label>
            <Input
              id="company-name"
              placeholder="e.g. Sharma Traders"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company-gstin">GSTIN (optional)</Label>
            <Input
              id="company-gstin"
              placeholder="22AAAAA0000A1Z5"
              value={gstin}
              onChange={(e) => setGstin(e.target.value.toUpperCase())}
              maxLength={15}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company-state">State (optional)</Label>
            <Select value={stateCode} onValueChange={setStateCode}>
              <SelectTrigger id="company-state" className="w-full">
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
              Create company
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}