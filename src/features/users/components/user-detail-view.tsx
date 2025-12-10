"use client";

import { format } from "date-fns";
import { ArrowLeftIcon, EditIcon, ShieldIcon, BanIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import UserType from "@/types/common/user-type";

interface UserDetailViewProps {
  user: UserType;
}

export function UserDetailView({ user }: UserDetailViewProps) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/dashboard/user/${user.id}/edit`);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-semibold">User Profile</h1>
        </div>
        <Button onClick={handleEdit}>
          <EditIcon className="mr-2 h-4 w-4" />
          Edit User
        </Button>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.image || undefined} alt={user.name} />
              <AvatarFallback className="bg-teal-500 text-xl text-white">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-xl">{user.name}</div>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Information */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-muted-foreground text-sm font-medium">Full Name</h3>
              <p className="text-base">{user.name}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-muted-foreground text-sm font-medium">Email Address</h3>
              <p className="text-base">{user.email}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-muted-foreground text-sm font-medium">User ID</h3>
              <p className="font-mono text-base">{user.id}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-muted-foreground text-sm font-medium">Account Created</h3>
              <p className="text-base">{user.created_at ? format(new Date(user.created_at), "PPP") : "Unknown"}</p>
            </div>
          </div>

          <Separator />

          {/* Role and Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Account Status</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                  <ShieldIcon className="h-4 w-4" />
                  Role
                </h4>
                <div>
                  <Badge
                    variant={user.role === "SUPERADMIN" ? "default" : user.role === "ADMIN" ? "secondary" : "outline"}
                  >
                    {user.role}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                  <BanIcon className="h-4 w-4" />
                  Ban Status
                </h4>
                <div>
                  <Badge variant={user.banned ? "destructive" : "default"}>{user.banned ? "Banned" : "Active"}</Badge>
                </div>
              </div>
            </div>

            {/* Ban Information */}
            {user.banned && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/20">
                <h4 className="mb-2 font-medium text-red-800 dark:text-red-200">Ban Details</h4>
                {user.ban_reason && (
                  <div className="mb-2">
                    <span className="text-muted-foreground text-sm font-medium">Reason: </span>
                    <span className="text-sm">{user.ban_reason}</span>
                  </div>
                )}
                {user.ban_expires && (
                  <div>
                    <span className="text-muted-foreground text-sm font-medium">Expires: </span>
                    <span className="text-sm">{format(new Date(user.ban_expires), "PPP")}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Information</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="text-muted-foreground text-sm font-medium">Last Updated</h4>
                <p className="text-base">{user.updated_at ? format(new Date(user.updated_at), "PPP") : "Never"}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-muted-foreground text-sm font-medium">Email Verified</h4>
                <Badge variant={user.email_verified ? "default" : "secondary"}>
                  {user.email_verified ? "Verified" : "Not Verified"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
