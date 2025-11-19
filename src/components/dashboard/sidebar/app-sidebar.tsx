/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Settings, CircleHelp, Search, Database, ClipboardList, File, Command } from "lucide-react";

import { OrganizationSwitcher } from "@/components/organization/organization-switcher";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { APP_CONFIG } from "@/config/app-config";
import { UserRole } from "@/config/role-config";
import { useSession } from "@/lib/auth-client";
import { sidebarItems } from "@/navigation/sidebar/sidebar-items";
import UserType from "@/types/common/user-type";

import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";

const data = {
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: CircleHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: Database,
    },
    {
      name: "Reports",
      url: "#",
      icon: ClipboardList,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: File,
    },
  ],
};

type AppSidebarProps = {
  users?: any[] | UserType[];
} & React.ComponentProps<typeof Sidebar>;

export function AppSidebar({ users, ...props }: AppSidebarProps) {
  const appName = APP_CONFIG.name;
  const appUrl = APP_CONFIG.url;
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <a href={appUrl} className="flex items-center gap-2">
                <Command />
                <span className="text-base font-semibold">{appName}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {user?.role !== UserRole.SUPERADMIN && (
          <div className="px-0 py-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-1">
            <OrganizationSwitcher />
          </div>
        )}
        <Separator />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarItems} />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={users && users.length > 0 ? users[0] : null} />
      </SidebarFooter>
    </Sidebar>
  );
}
