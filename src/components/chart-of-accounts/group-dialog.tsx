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
import { createAccountGroup, GROUP_TYPE_LABELS } from "@/lib/api/ledgers";
import type { AccountGroup, GroupType } from "@/lib/types";

const GROUP_TYPES: GroupType[] = ["assets", "liabilities", "income", "expense"];

function flattenGroups(
  groups: AccountGroup[],
  parentId: string | null = null,
  depth = 0
): Array<{ id: string; name: string; depth: number }> {
  return groups
    .filter((g) => g.parent_id === parentId)
    .flatMap((g) => [
      { id: g.id, name: g.name, depth },
      ...flattenGroups(groups, g.id, depth + 1),
    ]);
}

export function CreateGroupDialog({
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
  const [groupType, setGroupType] = useState<GroupType>("expense");
  const [parentId, setParentId] = useState("");
  const [isSummary, setIsSummary] = useState(false);

  function reset() {
    setName("");
    setGroupType("expense");
    setParentId("");
    setIsSummary(false);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Group name is required");
      return;
    }
    setSubmitting(true);
    try {
      await createAccountGroup({
        company_id: companyId,
        name: name.trim(),
        group_type: groupType,
        parent_id: parentId || undefined,
        is_summary: isSummary,
      });
      toast.success("Account group created");
      onCreated?.();
      setOpen(false);
      reset();
    } catch (err) {
      toast.error("Could not create group", {
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New account group</DialogTitle>
          <DialogDescription>
            Groups organise ledgers into your chart of accounts.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group-name">Group name</Label>
            <Input
              id="group-name"
              placeholder="e.g. Furniture and Fixtures"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="group-type">Type</Label>
            <Select value={groupType} onValueChange={(v) => setGroupType(v as GroupType)}>
              <SelectTrigger id="group-type" className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {GROUP_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {GROUP_TYPE_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="group-parent">Parent group (optional)</Label>
            <Select value={parentId} onValueChange={setParentId}>
              <SelectTrigger id="group-parent" className="w-full">
                <SelectValue placeholder="None (top level)" />
              </SelectTrigger>
              <SelectContent>
                {flattenGroups(groups).map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {"\u00A0".repeat(g.depth * 2)}
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={isSummary}
              onCheckedChange={(v) => setIsSummary(!!v)}
            />
            Summary group (cannot hold ledgers directly, used for reporting)
          </label>
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
              Create group
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}