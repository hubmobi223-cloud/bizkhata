"use client";

import { useEffect, useMemo, useState } from "react";
import { FolderTree, Layers, Pencil, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCompany } from "@/components/company/company-provider";
import { Onboarding } from "@/components/company/onboarding";
import { CreateGroupDialog } from "@/components/chart-of-accounts/group-dialog";
import { CreateLedgerDialog } from "@/components/chart-of-accounts/ledger-dialog";
import {
  deactivateLedger,
  fetchAccountGroups,
  fetchLedgers,
  fetchTrialBalance,
  GROUP_TYPE_LABELS,
} from "@/lib/api/ledgers";
import { formatAmount } from "@/lib/format";
import { cn } from "@/lib/utils";
import type {
  AccountGroup,
  LedgerRow,
  TrialBalanceRow,
} from "@/lib/types";

interface GroupNode extends AccountGroup {
  children: GroupNode[];
}

function buildTree(groups: AccountGroup[]): GroupNode[] {
  const nodes = new Map<string, GroupNode>();
  groups.forEach((g) => nodes.set(g.id, { ...g, children: [] }));
  const roots: GroupNode[] = [];
  nodes.forEach((node) => {
    if (node.parent_id && nodes.has(node.parent_id)) {
      nodes.get(node.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  });
  const sort = (n: GroupNode[]) =>
    n.forEach((node) => {
      node.children.sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name));
      sort(node.children);
    });
  roots.sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name));
  sort(roots);
  return roots;
}

function flattenNode(node: GroupNode, depth: number): Array<{ node: GroupNode; depth: number }> {
  return [
    { node, depth },
    ...node.children.flatMap((child) => flattenNode(child, depth + 1)),
  ];
}

function balanceCell(net: number): { text: string; className: string } {
  if (net > 0) return { text: `${formatAmount(net)} Dr`, className: "text-foreground" };
  if (net < 0) return { text: `${formatAmount(-net)} Cr`, className: "text-foreground" };
  return { text: formatAmount(0), className: "text-muted-foreground" };
}

export default function ChartOfAccountsPage() {
  const { companies, activeCompany } = useCompany();
  const [data, setData] = useState<{
    groups: AccountGroup[];
    ledgers: LedgerRow[];
    trialBalance: TrialBalanceRow[];
  } | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [editingLedger, setEditingLedger] = useState<LedgerRow | null>(null);
  const [deletingLedger, setDeletingLedger] = useState<LedgerRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDeleteLedger() {
    if (!deletingLedger) return;
    setDeleting(true);
    try {
      await deactivateLedger(deletingLedger.id);
      toast.success(`"${deletingLedger.name}" removed`);
      setDeletingLedger(null);
      setReloadKey((k) => k + 1);
    } catch (err) {
      toast.error("Could not remove ledger", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setDeleting(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    if (!activeCompany) return;
    Promise.all([
      fetchAccountGroups(activeCompany.id),
      fetchLedgers(activeCompany.id),
      fetchTrialBalance(activeCompany.id),
    ])
      .then(([groups, ledgers, trialBalance]) => {
        if (!cancelled) setData({ groups, ledgers, trialBalance });
      })
      .catch(() => {
        if (!cancelled) {
          setData({ groups: [], ledgers: [], trialBalance: [] });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [activeCompany, reloadKey]);

  const loading = data === null && !!activeCompany;
  const groups = useMemo(() => data?.groups ?? [], [data]);
  const ledgers = useMemo(() => data?.ledgers ?? [], [data]);
  const trialBalance = useMemo(() => data?.trialBalance ?? [], [data]);

  const tree = useMemo(() => buildTree(groups), [groups]);
  const flatGroups = useMemo(
    () => tree.flatMap((node) => flattenNode(node, 0)),
    [tree]
  );
  const selectedGroup = selectedGroupId
    ? flatGroups.find(({ node }) => node.id === selectedGroupId)
    : null;

  const balanceByLedger = useMemo(() => {
    const map = new Map<string, TrialBalanceRow>();
    trialBalance.forEach((row) => map.set(row.ledger_id, row));
    return map;
  }, [trialBalance]);

  const visibleLedgers = useMemo(() => {
    let list = ledgers;
    if (selectedGroup) {
      const ids = new Set<string>([selectedGroup.node.id]);
      selectedGroup.node.children.forEach((child) => {
        flattenNode(child, 0).forEach(({ node }) => ids.add(node.id));
      });
      list = list.filter((l) => ids.has(l.account_group_id));
    }
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          (l.code ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [ledgers, selectedGroup, query]);

  const totalLedgers = ledgers.length;

  if (companies.length === 0) {
    return <Onboarding />;
  }

  const summary = flatGroups.reduce<Record<string, number>>((acc, { node }) => {
    acc[node.group_type] = (acc[node.group_type] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Chart of Accounts
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {totalLedgers} ledgers across {groups.length} account groups in{" "}
            {activeCompany?.name}.
          </p>
        </div>
        <div className="flex gap-2">
          <CreateGroupDialog
            companyId={activeCompany?.id ?? ""}
            groups={groups}
            onCreated={() => setReloadKey((k) => k + 1)}
            trigger={
              <Button variant="outline">
                <FolderTree className="size-4" />
                New group
              </Button>
            }
          />
          <CreateLedgerDialog
            companyId={activeCompany?.id ?? ""}
            groups={groups}
            onCreated={() => setReloadKey((k) => k + 1)}
            trigger={
              <Button>
                <Layers className="size-4" />
                New ledger
              </Button>
            }
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Search group…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedGroupId(null);
              }}
            />
          </div>
          <Card>
            <CardContent className="p-2">
              <button
                type="button"
                onClick={() => setSelectedGroupId(null)}
                className={cn(
                  "w-full rounded-md px-2.5 py-1.5 text-left text-sm",
                  selectedGroupId === null
                    ? "bg-accent font-medium text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/60"
                )}
              >
                All groups
              </button>
              {flatGroups.map(({ node, depth }) => (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setSelectedGroupId(node.id)}
                  className={cn(
                    "w-full truncate rounded-md px-2.5 py-1.5 text-left text-sm",
                    selectedGroupId === node.id
                      ? "bg-accent font-medium text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/60"
                  )}
                  style={{ paddingLeft: `${8 + depth * 12}px` }}
                >
                  {node.name}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="min-w-0">
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
                      <th className="px-3 py-2.5 font-medium">Ledger</th>
                      <th className="px-3 py-2.5 font-medium">Group</th>
                      <th className="px-3 py-2.5 text-right font-medium">Opening</th>
                      <th className="px-3 py-2.5 text-right font-medium">Net balance</th>
                      <th className="w-20 px-1 py-2.5" />
                    </tr>
                  </thead>
                  <tbody>
                    {visibleLedgers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-3 py-8 text-center text-muted-foreground"
                        >
                          No ledgers found.
                        </td>
                      </tr>
                    ) : (
                      visibleLedgers.map((ledger) => {
                        const tb = balanceByLedger.get(ledger.id);
                        const net = tb?.net_balance ?? 0;
                        const netCell = balanceCell(net);
                        const openingHas = ledger.opening_debit > 0 || ledger.opening_credit > 0;
                        const opening = openingHas
                          ? ledger.opening_debit > 0
                            ? `${formatAmount(ledger.opening_debit)} Dr`
                            : `${formatAmount(ledger.opening_credit)} Cr`
                          : "—";
                        return (
                          <tr key={ledger.id} className="border-b last:border-0">
                            <td className="px-3 py-2.5">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="font-medium">{ledger.name}</span>
                                {ledger.code && (
                                  <span className="text-xs text-muted-foreground">
                                    {ledger.code}
                                  </span>
                                )}
                                {!ledger.is_active && (
                                  <Badge variant="secondary">inactive</Badge>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-2.5 text-muted-foreground">
                              {tb?.group_name ?? "—"}
                            </td>
                            <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">
                              {opening}
                            </td>
                            <td className={cn("px-3 py-2.5 text-right tabular-nums", netCell.className)}>
                              {netCell.text}
                            </td>
                            <td className="px-2 py-2.5">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="size-8 px-0"
                                  onClick={() => setEditingLedger(ledger)}
                                  aria-label={`Edit ${ledger.name}`}
                                >
                                  <Pencil className="size-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="size-8 px-0 text-destructive hover:text-destructive"
                                  onClick={() => setDeletingLedger(ledger)}
                                  aria-label={`Remove ${ledger.name}`}
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
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
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(summary).map(([type, count]) => (
          <Badge key={type} variant="outline" className="text-xs">
            {GROUP_TYPE_LABELS[type as keyof typeof GROUP_TYPE_LABELS]}: {count}
          </Badge>
        ))}
      </div>

      {editingLedger && (
        <CreateLedgerDialog
          key={editingLedger.id}
          companyId={activeCompany?.id ?? ""}
          groups={groups}
          ledger={editingLedger}
          open
          onOpenChange={(next) => {
            if (!next) setEditingLedger(null);
          }}
          onCreated={() => {
            setEditingLedger(null);
            setReloadKey((k) => k + 1);
          }}
        />
      )}

      <Dialog
        open={!!deletingLedger}
        onOpenChange={(next) => {
          if (!next && !deleting) setDeletingLedger(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove ledger?</DialogTitle>
            <DialogDescription>
              {deletingLedger?.name} will be deactivated and hidden from
              active lists. Existing transactions are preserved. This can be
              reversed by reactivating the ledger.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setDeletingLedger(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteLedger}
              disabled={deleting}
            >
              {deleting ? "Removing…" : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}