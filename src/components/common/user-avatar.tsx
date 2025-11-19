"use client";

import { CircleUserRound, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AUTH_CONFIG } from "@/config/auth-config";
import { signOut, useSession } from "@/lib/auth-client";

export const UserAvatar = () => {
  const t = useTranslations("menu-data");
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push(AUTH_CONFIG.afterLogoutRedirect);
        },
      },
    });
  };

  if (!isPending && session?.user && user) {
    return (
      <div className="flex items-center gap-3 px-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8 border border-slate-300">
                <AvatarFallback className="bg-teal-500 text-white">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              <div className="sapce-y-1 flex flex-col">
                <p className="text-sm leading-none font-medium">
                  Hi, {user.name} - ({user.role?.toUpperCase()})
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer">
              <CircleUserRound className="mr-2 h-2 w-4" />
              <span className="font-medium">{t("profile")}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500">
              <LogOut className="mr-2 h-2 w-4" />
              <span className="font-medium">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return null;
};
