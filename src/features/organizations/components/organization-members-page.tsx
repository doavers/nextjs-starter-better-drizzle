"use client";

import { MailPlusIcon, UsersIcon } from "lucide-react";
import { useState } from "react";

import { Heading } from "@/components/common/heading";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { OrganizationInvitationsList } from "./organization-invitations-list";
import { OrganizationMembersList } from "./organization-members-list";

interface OrganizationMembersPageProps {
  organizationId: string;
  traceId: string;
}

export default function OrganizationMembersPage({ organizationId, traceId }: OrganizationMembersPageProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Heading title="Organization Members" description="Manage your team members and invitations" />
        </div>
      </div>

      <Separator />

      <Tabs defaultValue="members" className="w-full">
        <TabsList>
          <TabsTrigger value="members" className="flex items-center gap-2">
            <UsersIcon className="h-4 w-4" />
            Members
          </TabsTrigger>
          <TabsTrigger value="invitations" className="flex items-center gap-2">
            <MailPlusIcon className="h-4 w-4" />
            Invitations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <OrganizationMembersList
            organizationId={organizationId}
            traceId={traceId}
            key={`members-${refreshKey}`}
            onRefresh={handleRefresh}
          />
        </TabsContent>

        <TabsContent value="invitations" className="space-y-4">
          <OrganizationInvitationsList
            organizationId={organizationId}
            traceId={traceId}
            key={`invitations-${refreshKey}`}
            onRefresh={handleRefresh}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
