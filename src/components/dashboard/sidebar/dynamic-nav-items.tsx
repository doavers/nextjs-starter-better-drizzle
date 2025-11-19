import { headers } from "next/headers";

import { API_CONFIG } from "@/config/api-config";
import { UserRole } from "@/config/role-config";
import { auth } from "@/lib/auth";
import { sidebarItems, type NavGroup } from "@/navigation/sidebar/sidebar-items";

export async function DynamicNavItems(): Promise<NavGroup[]> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return sidebarItems;
  }

  const userRole = session.user.role as UserRole;
  const isAdmin = userRole === UserRole.SUPERADMIN || userRole === UserRole.ADMIN;

  // For regular users, check if they already have an organization
  let hasOrganization = false;
  if (!isAdmin) {
    try {
      const cookies = await headers();
      const cookieHeader = cookies.get("cookie")?.toString() || "";

      const response = await fetch(`${API_CONFIG.backendURL}/v1/users/organizations`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader,
        },
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        if (result.code === "00" && result.data?.organizations?.length > 0) {
          hasOrganization = true;
        }
      }
    } catch (error) {
      console.warn("Failed to check user organizations:", error);
    }
  }

  // Clone and modify the sidebar items based on user permissions
  return sidebarItems.map((group) => {
    if (group.label === "Pages") {
      return {
        ...group,
        items: group.items
          .map((item) => {
            // Handle Organizations section
            if (item.title === "Organizations") {
              const subItems = [...(item.subItems || [])];

              // Filter sub-items based on role and organization status
              const filteredSubItems = subItems.filter((subItem) => {
                if (subItem.title === "Add Organization") {
                  // Show Add Organization for:
                  // 1. Admins (always)
                  // 2. Regular users who don't have an organization yet
                  return isAdmin || (!hasOrganization && subItem.requiredRole?.includes(UserRole.USER));
                }
                return true;
              });

              return {
                ...item,
                subItems: filteredSubItems,
              };
            }

            // Handle Users section (only for admins)
            if (item.title === "Users") {
              return {
                ...item,
                subItems: item.subItems?.filter(
                  (subItem) => !subItem.requiredRole || subItem.requiredRole.includes(userRole),
                ),
              };
            }

            return item;
          })
          .filter((item) => {
            // Filter out items that user doesn't have access to
            if (!item.requiredRole) return true;

            if (Array.isArray(item.requiredRole)) {
              return item.requiredRole.includes(userRole);
            }

            return item.requiredRole === userRole;
          }),
      };
    }

    return group;
  });
}
