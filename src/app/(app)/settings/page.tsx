"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { useCompany } from "@/components/company/company-provider";
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
import { updateCompanySettings } from "@/lib/api/settings";
import { INDIAN_STATES } from "@/lib/states";
import type { Company } from "@/lib/types";
import type { CompanySettings } from "@/lib/api/settings";

const GST_RATES = [0, 0.25, 3, 5, 12, 18, 28];

function SettingsForm({ company, onSaved }: { company: Company; onSaved: () => void }) {
  const [form, setForm] = useState<CompanySettings>({
    name: company.name ?? "",
    legal_name: company.legal_name ?? "",
    gstin: company.gstin ?? "",
    pan: company.pan ?? "",
    address_line1: company.address_line1 ?? "",
    city: company.city ?? "",
    state: company.state ?? "",
    state_code: company.state_code ?? "",
    pincode: company.pincode ?? "",
    phone: company.phone ?? "",
    email: company.email ?? "",
  });
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof CompanySettings>(key: K, value: CompanySettings[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const withState = (code: string) => {
    const st = INDIAN_STATES.find((s) => s.code === code);
    set("state_code", code);
    set("state", st?.name ?? "");
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateCompanySettings(company.id, form);
      onSaved();
      toast.success("Settings saved");
    } catch (err) {
      toast.error("Could not save settings", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Company &amp; GST Settings</CardTitle>
          <CardDescription>
            GSTIN, state code and tax-related details. The state code determines
            intra-state (CGST/SGST) vs inter-state (IGST) treatment on invoices.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Company name *</Label>
              <Input id="name" value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="legal_name">Legal name</Label>
              <Input id="legal_name" value={form.legal_name ?? ""} onChange={(e) => set("legal_name", e.target.value)} />
            </div>
          </div>

          <div className="rounded-lg border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/20">
            <p className="mb-3 text-sm font-semibold text-indigo-700 dark:text-indigo-300">
              GST details
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="gstin">GSTIN</Label>
                <Input id="gstin" value={form.gstin ?? ""} onChange={(e) => set("gstin", e.target.value)} placeholder="22AAAAA0000A1Z5" className="font-mono" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pan">PAN</Label>
                <Input id="pan" value={form.pan ?? ""} onChange={(e) => set("pan", e.target.value)} placeholder="AAAAA0000A" className="font-mono" />
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="state">State</Label>
                <Select value={form.state_code ?? undefined} onValueChange={withState}>
                  <SelectTrigger id="state" className="w-full">
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
              <div className="space-y-1.5">
                <Label htmlFor="state_code">State code</Label>
                <Input id="state_code" value={form.state_code ?? ""} readOnly className="font-mono" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="address_line1">Address</Label>
              <Input id="address_line1" value={form.address_line1 ?? ""} onChange={(e) => set("address_line1", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city">City</Label>
              <Input id="city" value={form.city ?? ""} onChange={(e) => set("city", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pincode">Pincode</Label>
              <Input id="pincode" value={form.pincode ?? ""} onChange={(e) => set("pincode", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="animate-spin" /> : <Save />}
              Save settings
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tax rates (reference)</CardTitle>
          <CardDescription>
            Standard GST slabs used across items and invoices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {GST_RATES.map((r) => (
              <span
                key={r}
                className="rounded-md border bg-muted/50 px-3 py-1 text-sm font-medium tabular-nums"
              >
                {r}%
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

export default function SettingsPage() {
  const { activeCompany, refreshCompanies } = useCompany();

  if (!activeCompany) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Please select a company to manage settings.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Company profile and GST configuration for {activeCompany.name}.
        </p>
      </div>

      <SettingsForm
        key={activeCompany.id}
        company={activeCompany}
        onSaved={() => void refreshCompanies()}
      />
    </div>
  );
}
