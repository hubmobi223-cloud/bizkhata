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
import { COMMON_UQCS, createUnit } from "@/lib/api/inventory";

export function CreateUnitDialog({
  companyId,
  trigger,
  onCreated,
}: {
  companyId: string;
  trigger?: React.ReactNode;
  onCreated?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [uqc, setUqc] = useState("");

  function reset() {
    setName("");
    setUqc("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Unit name is required");
      return;
    }
    setSubmitting(true);
    try {
      await createUnit({ company_id: companyId, name: name.trim(), uqc: uqc || undefined });
      toast.success("Unit created");
      onCreated?.();
      setOpen(false);
      reset();
    } catch (err) {
      toast.error("Could not create unit", {
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
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>New unit of measure</DialogTitle>
          <DialogDescription>
            Units are required for every item (e.g. Nos, Kg, Box).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="unit-name">Unit name</Label>
            <Input
              id="unit-name"
              placeholder="e.g. Nos"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit-uqc">UQC code (optional)</Label>
            <Select value={uqc} onValueChange={setUqc}>
              <SelectTrigger id="unit-uqc" className="w-full">
                <SelectValue placeholder="Select or type a UQC" />
              </SelectTrigger>
              <SelectContent>
                {COMMON_UQCS.map((code) => (
                  <SelectItem key={code} value={code}>
                    {code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="animate-spin" />}
              Create unit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}