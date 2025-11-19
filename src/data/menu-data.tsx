import { useTranslations } from "next-intl";

import { UserRole } from "@/config/role-config";
import { Menu } from "@/types/frontend/menu";

const MenuData = () => {
  const t = useTranslations("menu-data");
  const menuData: Menu[] = [
    {
      id: "home",
      title: `${t("about")}`,
      path: "/about",
      newTab: false,
    },
    {
      id: "services",
      title: `${t("services")}`,
      path: "/services",
      newTab: false,
    },
    {
      id: "explore",
      title: `${t("explore")}`,
      newTab: false,
      submenu: [
        {
          id: "portfolio",
          title: `${t("portfolio")}`,
          path: "/portfolio",
          newTab: false,
        },
        {
          id: "blogs",
          title: "Blog",
          path: "/blogs",
          newTab: false,
        },
        {
          id: "docs",
          title: `${t("docs")}`,
          path: "/docs",
          newTab: false,
        },
        {
          id: "pricing",
          title: "Pricing",
          path: "/pricing",
          newTab: false,
        },
        {
          id: "contact",
          title: `${t("contact")}`,
          path: "/contact",
          newTab: false,
        },
      ],
    },
    {
      id: 9,
      title: `${t("manage")}`,
      newTab: false,
      isLogedin: true,
      userRoles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.USER],
      submenu: [
        {
          id: "dashboard",
          title: `${t("dashboard")}`,
          path: "/dashboard",
          newTab: false,
          userRoles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.USER],
        },
        {
          id: "profile",
          title: `${t("profile")}`,
          path: "/profile",
          newTab: false,
          userRoles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.USER],
        },
      ],
    },
  ];
  return menuData;
};

export default MenuData;
