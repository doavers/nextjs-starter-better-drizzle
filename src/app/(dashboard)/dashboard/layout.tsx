import { cookies, headers } from "next/headers";
import { ReactNode } from "react";

import { AccountSwitcher } from "@/components/dashboard/sidebar/account-switcher";
import { AppSidebar } from "@/components/dashboard/sidebar/app-sidebar";
import { LayoutControls } from "@/components/dashboard/sidebar/layout-controls";
import { SearchDialog } from "@/components/dashboard/sidebar/search-dialog";
import { ThemeSwitcher } from "@/components/dashboard/sidebar/theme-switcher";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserRole } from "@/config/role-config";
import { OrganizationProvider } from "@/hooks/use-organization-context";
import { auth } from "@/lib/auth";
import { getPreference } from "@/lib/cookie";
import { cn } from "@/lib/utils";
import {
  SIDEBAR_VARIANT_VALUES,
  SIDEBAR_COLLAPSIBLE_VALUES,
  CONTENT_LAYOUT_VALUES,
  NAVBAR_STYLE_VALUES,
  type SidebarVariant,
  type SidebarCollapsible,
  type ContentLayout,
  type NavbarStyle,
} from "@/types/preferences/layout";

export default async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  const users = [];
  users.push({ ...user!, avatar: user?.image ?? "", role: user?.role ?? UserRole.USER });

  const [sidebarVariant, sidebarCollapsible, contentLayout, navbarStyle] = await Promise.all([
    getPreference<SidebarVariant>("sidebar_variant", SIDEBAR_VARIANT_VALUES, "inset"),
    getPreference<SidebarCollapsible>("sidebar_collapsible", SIDEBAR_COLLAPSIBLE_VALUES, "icon"),
    getPreference<ContentLayout>("content_layout", CONTENT_LAYOUT_VALUES, "centered"),
    getPreference<NavbarStyle>("navbar_style", NAVBAR_STYLE_VALUES, "sticky"),
  ]);

  const layoutPreferences = {
    contentLayout,
    variant: sidebarVariant,
    collapsible: sidebarCollapsible,
    navbarStyle,
  };

  return (
    <OrganizationProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar users={users} variant={sidebarVariant} collapsible={sidebarCollapsible} />
        {/* <AppSidebar /> */}
        <SidebarInset
          data-content-layout={contentLayout}
          className={cn(
            "data-[content-layout=centered]:mx-auto! data-[content-layout=centered]:max-w-screen-xl",
            // Adds right margin for inset sidebar in centered layout up to 113rem.
            // On wider screens with collapsed sidebar, removes margin and sets margin auto for alignment.
            "max-[113rem]:peer-data-[variant=inset]:mr-2! min-[101rem]:peer-data-[variant=inset]:peer-data-[state=collapsed]:mr-auto!",
          )}
        >
          <header
            data-navbar-style={navbarStyle}
            data-sidebar-variant={sidebarVariant}
            className={cn(
              "flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12",
              // Navbar style classes
              "data-[navbar-style=sticky]:bg-background/80 data-[navbar-style=sticky]:border-b-border/50 data-[navbar-style=sticky]:sticky data-[navbar-style=sticky]:top-0 data-[navbar-style=sticky]:z-50 data-[navbar-style=sticky]:backdrop-blur-md",
              // Sidebar variant specific adjustments
              "data-[sidebar-variant=floating]:border-l-0 data-[sidebar-variant=inset]:border-l-0 data-[sidebar-variant=sidebar]:border-l-0",
              // Ensure consistent positioning across all variants
              "relative",
            )}
          >
            <div className="flex w-full items-center justify-between px-4 lg:px-6">
              <div className="flex items-center gap-1 lg:gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
                <SearchDialog />
              </div>
              <div className="flex items-center gap-2">
                <LayoutControls {...layoutPreferences} />
                <ThemeSwitcher />
                <AccountSwitcher users={users} />
              </div>
            </div>
          </header>
          {/* <main>
          </main> */}
          <div className="h-full p-4 md:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </OrganizationProvider>
  );
}
