"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { CalendarPlus, Check, Loader2, Lock, LockOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  createFinancialYear,
  listFinancialYears,
  setFinancialYearActive,
  toggleFinancialYearLock,
} from "@/lib/api/admin";
import type { FinancialYear } from "@/lib/types";

export function FinancialYearsTab({ companyId }: { companyId: string }) {
  const [fys, setFys] = useState<FinancialYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await listFinancialYears(companyId);
      setFys(data);
    } catch (err) {
      toast.error("Could not load financial years", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    void Promise.resolve().then(async () => {
      try {
        const data = await listFinancialYears(companyId);
        setFys(data);
      } catch (err) {
        console.error("[FinancialYearsTab] load failed:", err);
        toast.error("Could not load financial years", {
          description: err instanceof Error ? err.message : "Unknown error",
        });
      } finally {
        setLoading(false);
      }
    });
  }, [companyId]);

  async function handleSetActive(fy: FinancialYear) {
    setBusy(true);
    try {
      await setFinancialYearActive(companyId, fy);
      await load();
      toast.success(`${fy.name} is now the active financial year`);
    } catch (err) {
      toast.error("Could not set active year", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setBusy(false);
    }
  }

  async function handleToggleLock(fy: FinancialYear) {
    setBusy(true);
    try {
      await toggleFinancialYearLock(fy);
      await load();
      toast.success(fy.is_locked ? "Financial year unlocked" : "Financial year locked");
    } catch (err) {
      toast.error("Could not update financial year", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="text-base">Financial years</CardTitle>
          <CardDescription>
            Each company keeps records in financial years. Vouchers are posted to the
            active year. Lock a year to prevent further changes.
          </CardDescription>
        </div>
        <CreateFyDialog companyId={companyId} onCreated={load} />
      </CardHeader>
      <CardContent className="space-y-2">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : fys.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No financial years yet.
          </p>
        ) : (
          fys.map((fy) => (
            <div key={fy.id} className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{fy.name}</p>
                  {fy.is_active ? (
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                  {fy.is_locked && <Badge variant="outline">Locked</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(fy.start_date).toLocaleDateString()} &mdash;{" "}
                  {new Date(fy.end_date).toLocaleDateString()}
                </p>
              </div>

              {!fy.is_active && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void handleSetActive(fy)}
                  disabled={busy}
                >
                  {busy ? <Loader2 className="mr-1.5 size-4 animate-spin" /> : <Check className="mr-1.5 size-4" />}
                  Make active
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => void handleToggleLock(fy)}
                disabled={busy}
              >
                {fy.is_locked ? (
                  <>
                    <LockOpen className="mr-1.5 size-4" /> Unlock
                  </>
                ) : (
                  <>
                    <Lock className="mr-1.5 size-4" /> Lock
                  </>
                )}
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

function CreateFyDialog({
  companyId,
  onCreated,
}: {
  companyId: string;
  onCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await createFinancialYear(companyId, {
        name: name.trim(),
        start_date: start,
        end_date: end,
      });
      setOpen(false);
      setName("");
      setStart("");
      setEnd("");
      onCreated();
      toast.success("Financial year created");
    } catch (err) {
      toast.error("Could not create financial year", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setSaving(false);
    }
  }

  const valid = name.trim() && start && end && new Date(end) > new Date(start);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <CalendarPlus className="mr-1.5 size-4" />
          New financial year
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a financial year</DialogTitle>
          <DialogDescription>
            The new year starts inactive. Use &quot;Make active&quot; once you are ready
            to post entries to it.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="fy-name">Name</Label>
            <Input
              id="fy-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="FY 2026-27"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="fy-start">Start date</Label>
              <Input id="fy-start" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fy-end">End date</Label>
              <Input id="fy-end" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={saving || !valid}>
              {saving && <Loader2 className="mr-1.5 size-4 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
