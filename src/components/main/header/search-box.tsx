"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SearchBox = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchParams) {
      const params = new URLSearchParams(searchParams);
      // Simply set the query parameter, no need to check if it exists first
      params.set("query", searchTerm);
      router.push(`/search?${params.toString()}`);
    }
    setSearchTerm("");
  };

  return (
    <form onSubmit={onFormSubmit} className="flex w-full items-start rounded-lg border-2">
      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full rounded-md border-none p-2 outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 lg:w-64"
        placeholder="Search.."
      />
      <Button type="submit" className="duration-200 hover:opacity-30" variant={"link"}>
        <Search size={25} />
      </Button>
    </form>
  );
};

const SearchBoxWithReset = () => {
  const pathname = usePathname();

  // When pathname changes and is not "/search", the component will be recreated with a new key
  // This effectively resets the searchTerm state without needing useEffect
  return <SearchBox key={pathname !== "/search" ? "reset" : "search"} />;
};

export default SearchBoxWithReset;
