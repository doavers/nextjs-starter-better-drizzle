"use client";

import { Heart, HelpCircle, Home, ListOrdered, LogOut, Menu, Store, Text, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import ThemeToggler from "./theme-toggler";

const MobileHeader = () => {
  const pathname = usePathname() ?? "/";

  const userLinks = [
    {
      link: "/my-account",
      label: "My Account",
      icon: <User />,
      isActive: pathname.includes("/my-account"),
    },
    {
      link: "/wishlist",
      label: "Wishlist",
      icon: <Heart />,
      isActive: pathname.includes("/wishlist"),
    },
    {
      link: "/my-orders",
      label: "My Orders",
      icon: <ListOrdered />,
      isActive: pathname.includes("/my-orders"),
    },
    {
      link: "/help",
      label: "Help",
      icon: <HelpCircle />,
      isActive: pathname.includes("/help"),
    },
  ];

  const navlinks = [
    {
      link: "/",
      label: "Home",
      icon: <Home />,
      isActive: pathname === "/",
    },
    {
      link: "/shop",
      label: "Shop",
      icon: <Store />,
      isActive: pathname.includes("/shop"),
    },
    {
      link: "/blog",
      label: "Blogs",
      icon: <Text />,
      isActive: pathname.includes("/blog"),
    },
  ];

  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger>
          <Menu className="mt-2" size={25} />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetDescription>
              <ul className="space-y-1 p-2 text-start text-lg">
                {/* navigation links here */}
                {navlinks.map((link) => (
                  <Link
                    key={link.link}
                    href={link.link}
                    className={cn(
                      "flex items-center gap-2 rounded-md p-2 hover:bg-gray-200 dark:hover:bg-gray-800",
                      link.isActive && "bg-gray-200 dark:bg-gray-800",
                    )}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
                <Separator className="my-2!" />
                {/* theme toggle option here */}
                <div className="flex items-center gap-2">
                  <ThemeToggler />
                  <p>Change Theme</p>
                </div>
                <Separator className="my-2!" />

                {/* user retated options here */}
                {userLinks.map((link) => (
                  <Link
                    key={link.link}
                    href={link.link}
                    className={cn(
                      "flex items-center gap-2 rounded-md p-2 hover:bg-gray-200 dark:hover:bg-gray-800",
                      link.isActive && "bg-gray-200 dark:bg-gray-800",
                    )}
                  >
                    {link.icon} {link.label}
                  </Link>
                ))}
                <Separator className="my-2!" />
                <button className="flex items-start justify-start gap-2 bg-transparent p-2 hover:opacity-50">
                  <LogOut />
                  Logout
                </button>
              </ul>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileHeader;
