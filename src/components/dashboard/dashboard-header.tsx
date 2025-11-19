"use client";

import { Building2, Users, Crown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganizationContext } from "@/hooks/use-organization-context";

export function DashboardHeader() {
  const { currentOrganization, isLoading } = useOrganizationContext();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-9 w-64" />
          </div>
        </CardHeader>
      </Card>
    );
  }

  if (!currentOrganization) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="size-5" />
            Dashboard
          </CardTitle>
          <CardDescription>No organization selected. Please create or join an organization.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getRoleIcon = (role?: string) => {
    switch (role?.toLowerCase()) {
      case "owner":
        return <Crown className="size-4 text-yellow-600" />;
      default:
        return <Users className="size-4 text-blue-600" />;
    }
  };

  const getRoleBadgeVariant = (role?: string) => {
    switch (role?.toLowerCase()) {
      case "owner":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-3">
              <Building2 className="size-5" />
              {currentOrganization.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {getRoleIcon(currentOrganization.role)}
                <span className="capitalize">{currentOrganization.role || "Member"}</span>
              </div>
              {currentOrganization.memberCount !== undefined && (
                <span>• {currentOrganization.memberCount} members</span>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={getRoleBadgeVariant(currentOrganization.role)} className="capitalize">
              {currentOrganization.role || "Member"}
            </Badge>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
