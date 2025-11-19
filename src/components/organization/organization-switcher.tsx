"use client";

import { Building2, ChevronDown, Check } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useOrganizationContext } from "@/hooks/use-organization-context";

export function OrganizationSwitcher() {
  const { currentOrganization, organizations, switchOrganization, isLoading } = useOrganizationContext();
  const { state } = useSidebar(); // Get sidebar state: "expanded" or "collapsed"
  const [open, setOpen] = useState(false);
  const isCollapsed = state === "collapsed";

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        {!isCollapsed && <Skeleton className="h-4 w-32" />}
        {!isCollapsed && <Skeleton className="h-4 w-4" />}
      </div>
    );
  }

  if (!currentOrganization) {
    return (
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Building2 className="size-4" />
        {!isCollapsed && <span>No organization</span>}
      </div>
    );
  }

  const triggerButton = (
    <Button
      variant="outline"
      size="sm"
      role="combobox"
      aria-expanded={open}
      aria-label="Select an organization"
      data-sidebar="organization-switcher"
      className={`bg-background hover:bg-muted w-full justify-between ${isCollapsed ? "h-8 w-8 p-1" : ""}`}
    >
      <div
        className="flex items-center gap-2 truncate"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <Avatar className="size-5">
          <AvatarImage src={currentOrganization.logo} alt={currentOrganization.name} />
          <AvatarFallback>{currentOrganization.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        {!isCollapsed && <span className="truncate">{currentOrganization.name}</span>}
      </div>
      {!isCollapsed && <ChevronDown className="ml-auto size-4 shrink-0 opacity-50" />}
    </Button>
  );

  const triggerContent = isCollapsed ? (
    <Tooltip>
      <TooltipTrigger asChild>{triggerButton}</TooltipTrigger>
      <TooltipContent side="right" className="flex flex-col items-start">
        <p className="font-medium">{currentOrganization.name}</p>
        <p className="text-muted-foreground text-xs">Click to switch organization</p>
      </TooltipContent>
    </Tooltip>
  ) : (
    triggerButton
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerContent}</DialogTrigger>
      <DialogContent className="p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search organization..." />
            <CommandEmpty>No organization found.</CommandEmpty>
            <CommandGroup heading="Organizations">
              {organizations.map((org) => (
                <CommandItem
                  key={org.id}
                  onSelect={() => {
                    if (org.id !== currentOrganization.id) {
                      switchOrganization(org.id);
                    }
                    setOpen(false);
                  }}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Avatar className="size-5">
                    <AvatarImage src={org.logo} alt={org.name} />
                    <AvatarFallback>{org.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col">
                    <span className="font-medium">{org.name}</span>
                    {org.memberCount !== undefined && (
                      <span className="text-muted-foreground text-xs">{org.memberCount} members</span>
                    )}
                  </div>
                  {org.id === currentOrganization.id && <Check className="text-primary ml-auto size-4" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
