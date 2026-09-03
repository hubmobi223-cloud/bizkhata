"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import Image from "next/image";
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
import { CURRENCIES, updateCompanyAdmin } from "@/lib/api/admin";

export function CompanyTab() {
  const { activeCompany, refreshCompanies } = useCompany();
  const [name, setName] = useState(activeCompany?.name ?? "");
  const [currency, setCurrency] = useState(activeCompany?.currency ?? "INR");
  const [logoUrl, setLogoUrl] = useState(activeCompany?.logo_url ?? "");
  const [saving, setSaving] = useState(false);

  if (!activeCompany) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No company selected.
      </p>
    );
  }

  const company = activeCompany;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateCompanyAdmin(company.id, {
        name,
        currency,
        logo_url: logoUrl || null,
      });
      await refreshCompanies();
      toast.success("Company updated");
    } catch (err) {
      toast.error("Could not update company", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Company logo &amp; currency</CardTitle>
          <CardDescription>
            Set a logo shown on printed invoices and the currency used across the
            books. Full profile, GSTIN and address details are managed from Settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="co-name">Company name *</Label>
              <Input id="co-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="co-currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="co-currency" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="co-logo">Logo URL</Label>
              <Input
                id="co-logo"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
              />
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Logo preview</p>
            {logoUrl ? (
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border bg-muted/40">
                <Image
                  src={logoUrl}
                  alt="Company logo"
                  width={80}
                  height={80}
                  className="h-full w-full object-contain"
                  unoptimized
                />
              </div>
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-lg border bg-muted/40 text-xs text-muted-foreground">
                No logo
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="mr-1.5 size-4 animate-spin" /> : <Save className="mr-1.5 size-4" />}
              Save company
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
