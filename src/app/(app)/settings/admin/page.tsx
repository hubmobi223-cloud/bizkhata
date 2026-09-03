"use client";

import { useMemo, useState } from "react";
import { Building2, CalendarRange, Percent, Shield, Users } from "lucide-react";
import { useCompany } from "@/components/company/company-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoleBadge, MembersTab } from "@/components/admin/members";
import { FinancialYearsTab } from "@/components/admin/financial-years";
import { TaxMastersTab } from "@/components/admin/tax-masters";
import { CompanyTab } from "@/components/admin/company";
import type { MemberRole } from "@/lib/api/admin";

function NotAdmin() {
  return (
    <div className="py-10 text-center text-sm text-muted-foreground">
      You need an owner or admin role on this company to access the admin panel.
    </div>
  );
}

export default function AdminPage() {
  const { activeCompany } = useCompany();
  const role = (activeCompany?.role ?? "viewer") as MemberRole;
  const canAdmin = role === "owner" || role === "admin";

  const [tab, setTab] = useState<string>("members");

  const tabs = useMemo(
    () => [
      { value: "members", label: "Members & roles", icon: Users },
      { value: "financial-years", label: "Financial years", icon: CalendarRange },
      { value: "tax-masters", label: "Tax masters", icon: Percent },
      { value: "company", label: "Company & logo", icon: Building2 },
    ],
    []
  );

  if (!activeCompany) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        Please select a company to manage.
      </div>
    );
  }

  if (!canAdmin) return <NotAdmin />;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="size-5 text-indigo-500" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin Panel</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Manage {activeCompany.name} &mdash; members, financial years, tax and company
            details.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <RoleBadge role={role} />
        <span className="text-xs text-muted-foreground">
          You are signed in with the {role} role.
        </span>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="space-y-6">
        <TabsList className="flex-wrap">
          {tabs.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              <t.icon className="mr-1.5 size-4" />
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="members">
          <MembersTab companyId={activeCompany.id} isOwner={role === "owner"} />
        </TabsContent>
        <TabsContent value="financial-years">
          <FinancialYearsTab companyId={activeCompany.id} />
        </TabsContent>
        <TabsContent value="tax-masters">
          <TaxMastersTab companyId={activeCompany.id} />
        </TabsContent>
        <TabsContent value="company">
          <CompanyTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
