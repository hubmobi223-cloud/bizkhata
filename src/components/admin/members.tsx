"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, ShieldAlert, Trash2, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  addMember,
  listMembers,
  MEMBER_ROLES,
  removeMember,
  updateMember,
} from "@/lib/api/admin";
import type { CompanyMember, MemberRole } from "@/lib/api/admin";
import { cn } from "@/lib/utils";

const ROLE_BADGE: Record<string, string> = {
  owner: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  admin: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
  accountant: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  viewer: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

export function RoleBadge({ role }: { role: string }) {
  return <Badge className={cn("capitalize", ROLE_BADGE[role])}>{role}</Badge>;
}

export function MembersTab({
  companyId,
  isOwner,
}: {
  companyId: string;
  isOwner: boolean;
}) {
  const [members, setMembers] = useState<CompanyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await listMembers(companyId);
      setMembers(data);
    } catch (err) {
      console.error("[MembersTab] load failed:", err);
      toast.error("Could not load members", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    void Promise.resolve().then(async () => {
      try {
        const data = await listMembers(companyId);
        setMembers(data);
      } catch (err) {
        console.error("[MembersTab] listMembers failed:", err);
        toast.error("Could not load members", {
          description: err instanceof Error ? err.message : "Unknown error",
        });
      } finally {
        setLoading(false);
      }
    });
  }, [companyId]);

  async function handleRoleChange(member: CompanyMember, role: MemberRole) {
    setBusyId(member.id);
    try {
      await updateMember(companyId, member.id, role, member.is_active);
      await load();
      toast.success("Role updated");
    } catch (err) {
      toast.error("Could not update role", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setBusyId(null);
    }
  }

  async function handleToggleActive(member: CompanyMember) {
    setBusyId(member.id);
    try {
      await updateMember(companyId, member.id, member.role, !member.is_active);
      await load();
      toast.success(member.is_active ? "Member deactivated" : "Member activated");
    } catch (err) {
      toast.error("Could not update member", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setBusyId(null);
    }
  }

  async function handleRemove(member: CompanyMember) {
    setBusyId(member.id);
    try {
      await removeMember(companyId, member.id);
      await load();
      toast.success("Member removed");
    } catch (err) {
      toast.error("Could not remove member", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="text-base">Team members</CardTitle>
          <CardDescription>
            Add people to this company and control what they can see and do.
          </CardDescription>
        </div>
        <AddMemberDialog companyId={companyId} onAdded={load} />
      </CardHeader>
      <CardContent className="space-y-2">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : members.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No members yet.
          </p>
        ) : (
          members.map((m) => {
            return (
              <div
                key={m.id}
                className="flex flex-wrap items-center gap-3 rounded-lg border p-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">
                      {m.email ?? "Unknown user"}
                    </p>
                    {!m.is_active && (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Member since {new Date(m.created_at).toLocaleDateString()}
                  </p>
                </div>

                <RoleBadge role={m.role} />

                <Select
                  value={m.role}
                  onValueChange={(v) => void handleRoleChange(m, v as MemberRole)}
                  disabled={!isOwner || !m.is_active || m.role === "owner" || busyId === m.id}
                >
                  <SelectTrigger className="w-36" aria-label="Change role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MEMBER_ROLES.map((r) => (
                      <SelectItem key={r.value} value={r.value} disabled={m.role === "owner" && r.value !== "owner"}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {isOwner && m.role !== "owner" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void handleToggleActive(m)}
                      disabled={busyId === m.id}
                    >
                      {m.is_active ? "Deactivate" : "Activate"}
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          aria-label="Remove member"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Remove {m.email}?</DialogTitle>
                          <DialogDescription>
                            This member will lose access to {companyId && "this company"}. This
                            cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="destructive"
                            onClick={() => void handleRemove(m)}
                            disabled={busyId === m.id}
                          >
                            Remove
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </div>
            );
          })
        )}

        {!isOwner && (
          <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldAlert className="size-4" />
            Only the company owner can change roles or remove members.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function AddMemberDialog({
  companyId,
  onAdded,
}: {
  companyId: string;
  onAdded: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MemberRole>("accountant");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSaving(true);
    try {
      await addMember(companyId, email.trim(), role);
      setOpen(false);
      setEmail("");
      setRole("accountant");
      onAdded();
      toast.success("Member added");
    } catch (err) {
      toast.error("Could not add member", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <UserPlus className="mr-1.5 size-4" />
          Add member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a team member</DialogTitle>
          <DialogDescription>
            Add someone by email. They must already have a BizKhata account
            (they can sign up for free). The email is matched exactly.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="member-email">Email</Label>
            <Input
              id="member-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teammate@company.com"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="member-role">Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as MemberRole)}>
              <SelectTrigger id="member-role" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MEMBER_ROLES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label} &mdash; {r.hint}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={saving || !email.trim()}>
              {saving && <Loader2 className="mr-1.5 size-4 animate-spin" />}
              Add member
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
