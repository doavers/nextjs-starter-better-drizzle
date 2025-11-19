import { Kanban, Users, LayoutDashboard, Building2, type LucideIcon } from "lucide-react";

import { UserRole } from "@/config/role-config";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
  requiredRole?: UserRole | UserRole[];
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
  requiredRole?: UserRole | UserRole[]; // Support single role or array of roles
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 2,
    label: "Pages",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard/default",
        icon: LayoutDashboard,
      },
      // {
      //   title: "Email",
      //   url: "/mail",
      //   icon: Mail,
      //   comingSoon: true,
      // },
      // {
      //   title: "Chat",
      //   url: "/chat",
      //   icon: MessageSquare,
      //   comingSoon: true,
      // },
      // {
      //   title: "Calendar",
      //   url: "/calendar",
      //   icon: Calendar,
      //   comingSoon: true,
      // },
      {
        title: "Kanban",
        url: "/dashboard/kanban",
        icon: Kanban,
      },
      {
        title: "Users",
        url: "/dashboard/user",
        icon: Users,
        requiredRole: [UserRole.SUPERADMIN, UserRole.ADMIN],
        subItems: [
          { title: "Add User", url: "/dashboard/user/new", newTab: false },
          { title: "User List", url: "/dashboard/user", newTab: false },
        ],
      },
      {
        title: "Organizations",
        url: "/dashboard/organization",
        icon: Building2,
        subItems: [
          {
            title: "Add Organization",
            url: "/dashboard/organization/new",
            newTab: false,
            requiredRole: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.USER],
          },
          {
            title: "Organization List",
            url: "/dashboard/organization",
            newTab: false,
            requiredRole: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.USER],
          },
        ],
      },
      // {
      //   title: "Roles",
      //   url: "/roles",
      //   icon: Lock,
      //   comingSoon: true,
      // }
    ],
  },
];
