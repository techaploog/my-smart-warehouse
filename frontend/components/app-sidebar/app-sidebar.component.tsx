"use client";

import {
  ArrowLeftIcon,
  BoxesIcon,
  ClipboardCheckIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  PackageIcon,
  StoreIcon,
  TagsIcon,
  UsersIcon,
  WarehouseIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const MAIN_NAV_ITEMS = [
  { title: "Dashboard", href: "/", icon: LayoutDashboardIcon },
  { title: "Stocks", href: "/stocks", icon: BoxesIcon },
  { title: "Documents", href: "/documents", icon: FileTextIcon },
  { title: "Approvals", href: "/approvals", icon: ClipboardCheckIcon },
] as const;

const MASTER_NAV_ITEMS = [
  { title: "Items", href: "/items", icon: PackageIcon },
  { title: "Stores", href: "/stores", icon: StoreIcon },
  { title: "Categories", href: "/categories", icon: TagsIcon },
  { title: "Users", href: "/users", icon: UsersIcon },
] as const;

function isNavActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export const AppSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-sidebar-border h-12 border-b">
        <div className="flex items-center justify-between gap-2 px-2 py-1.5">
          <WarehouseIcon className="size-5 shrink-0" />
          <span className="truncate font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
            My Smart Warehouse
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MAIN_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isNavActive(pathname, item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link href={item.href} className="text-slate-600">
                        <Icon className="size-5 shrink-0 group-data-[collapsible=icon]:size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Master Data</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MASTER_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isNavActive(pathname, item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link href={item.href} className="text-slate-600">
                        <Icon className="size-5 shrink-0 group-data-[collapsible=icon]:size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-sidebar-border border-t">
        <div className="text-muted-foreground flex-center gap-1 truncate px-2 text-xs">
          <SidebarTrigger />
          <div className="flex items-center justify-between gap-2 px-2 py-1.5 group-data-[collapsible=icon]:hidden">
            <ArrowLeftIcon size={10} />
            <span>Collapse menu</span>
          </div>
        </div>
        <Separator />
        <div className="text-muted-foreground truncate px-2 text-center text-xs group-data-[collapsible=icon]:hidden">
          <p>Warehouse operations</p>
          <p>Frontend v0.1.0</p>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};
