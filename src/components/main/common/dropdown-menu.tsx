import { ChevronDown } from "lucide-react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DropdownMenuComponent = () => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-full px-4 py-1 font-medium hover:bg-gray-200 dark:hover:bg-gray-800">
          Pages <ChevronDown />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="space-y-2 p-6">
          <DropdownMenuItem>
            <Link href={"/homepagetwo"}>Home Page Two</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={"/shoppagetwo"}>Shop Page Two</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={"/blogpageone"}>Blog Page One</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={"/blogpagetwo"}>Blog Page Two</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={"/dashboard"}>Dashboard Page</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={"/auth/register"}>Sign Up Page</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={"/auth/login"}>Sign In Page</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={"/auth/reset"}>Forgot Password Page</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DropdownMenuComponent;
