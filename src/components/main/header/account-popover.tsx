"use client";

import { Heart, HelpCircle, ListOrdered, LogOut, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import UserAvatar from "./user-avatar";

const AccountPopover = () => {
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
      link: "/support",
      label: "Help",
      icon: <HelpCircle />,
      isActive: pathname.includes("/help"),
    },
  ];

  return (
    <div className="hidden lg:block">
      <Popover>
        <PopoverTrigger className="flex items-center justify-center rounded-md p-2 duration-200 hover:bg-gray-200 dark:hover:bg-gray-800">
          <User size={25} />
        </PopoverTrigger>
        <PopoverContent className="rounded-2xl">
          <ul className="space-y-1 text-center">
            <UserAvatar />
            <Separator className="my-2!" />
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
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AccountPopover;
