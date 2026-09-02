"use client";

import { Building2, Check, ChevronsUpDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCompany } from "./company-provider";
import { CreateCompanyDialog } from "./create-company-dialog";

export function CompanySwitcher() {
  const { companies, activeCompany, setActiveCompany } = useCompany();

  return (
    <div className="flex items-center gap-1.5">
      {companies.length === 0 ? (
        <CreateCompanyDialog
          trigger={
            <Button size="sm">
              <Building2 />
              Create company
            </Button>
          }
        />
      ) : (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="max-w-56 justify-between">
                <span className="truncate">{activeCompany?.name}</span>
                <ChevronsUpDown className="ml-1 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Companies</DropdownMenuLabel>
              {companies.map((c) => (
                <DropdownMenuItem
                  key={c.id}
                  onSelect={() => setActiveCompany(c.id)}
                >
                  <Building2 />
                  <span className="flex-1 truncate">{c.name}</span>
                  {activeCompany?.id === c.id && (
                    <Check className="text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <CreateCompanyDialog
            trigger={
              <Button variant="outline" size="icon-sm" aria-label="New company">
                <Plus />
              </Button>
            }
          />
        </>
      )}
    </div>
  );
}