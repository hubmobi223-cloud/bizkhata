"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  BookOpen,
  Boxes,
  FileChartColumn,
  LayoutDashboard,
  ReceiptText,
  Store,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { CompanySwitcher } from "@/components/company/company-switcher";
import { FinancialYearBadge } from "@/components/financial-year-badge";
import { UserMenu } from "@/components/user-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  note?: string;
}

const NAV: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ledgers", label: "Chart of Accounts", icon: BookOpen },
  { href: "/items", label: "Items & Inventory", icon: Boxes },
  { href: "/vouchers", label: "Vouchers", icon: ReceiptText },
  { href: "/billing", label: "Billing & POS", icon: Store },
  { href: "/reports", label: "Reports", icon: FileChartColumn, disabled: true, note: "Phase 6" },
];

function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = !item.disabled && isActive(item.href, pathname);
  const classes = cn(
    "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm whitespace-nowrap",
    item.disabled
      ? "cursor-not-allowed text-muted-foreground/60"
      : active
        ? "bg-accent font-medium text-accent-foreground"
        : "text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground"
  );
  const content = (
    <>
      <item.icon className="size-4 shrink-0" />
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {item.disabled && item.note ? (
        <Badge variant="secondary" className="px-1.5 text-[10px] font-medium">
          {item.note}
        </Badge>
      ) : null}
    </>
  );
  if (item.disabled) {
    return (
      <span aria-disabled className={classes}>
        {content}
      </span>
    );
  }
  return (
    <Link href={item.href} className={classes}>
      {content}
    </Link>
  );
}

export function AppShell({
  user,
  children,
}: {
  user: User;
  children: ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between gap-3 px-4 lg:px-6">
          <Brand />
          <div className="flex items-center gap-2">
            <FinancialYearBadge />
            <CompanySwitcher />
            <UserMenu user={user} />
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-56 shrink-0 flex-col gap-0.5 border-r p-3 md:flex">
          {NAV.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </aside>
        <div className="min-w-0 flex-1">
          <nav className="flex gap-1 overflow-x-auto border-b px-4 py-2 md:hidden">
            {NAV.map((item) => (
              <NavLink key={item.href} item={item} pathname={pathname} />
            ))}
          </nav>
          <main className="px-4 py-6 lg:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
}