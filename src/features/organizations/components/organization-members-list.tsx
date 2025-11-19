/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { UserPlusIcon, TrashIcon, ShieldIcon, UserIcon, UsersIcon } from "lucide-react";
import { useState, useTransition, useEffect, useCallback } from "react";

import { getOrganizationMembersAction, removeMemberAction } from "@/actions/common/organization-action";
import { AlertModal } from "@/components/modal/alert-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrganizationContext } from "@/hooks/use-organization-context";
import { useToast } from "@/hooks/use-toast";

import { InviteMemberModal } from "./invite-member-modal";

interface Member {
  id: string;
  userId: string;
  name: string;
  email: string;
  image?: string;
  role: string;
  createdAt: string;
}

interface OrganizationMembersListProps {
  organizationId: string;
  traceId: string;
  onRefresh?: () => void;
}

export function OrganizationMembersList({ organizationId, traceId, onRefresh }: OrganizationMembersListProps) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isPending, startTransition] = useTransition();
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { currentOrganization } = useOrganizationContext();

  const fetchMembers = useCallback(async () => {
    try {
      const result = await getOrganizationMembersAction(traceId, organizationId);
      if (result.code === "00") {
        // Type assertion to ensure result.data is an array of Member objects
        setMembers((result.data as Member[]) || []);
      } else {
        // Handle API error response
        toast({
          title: "Error",
          description: result.message || "Failed to fetch members.",
          variant: "destructive",
        });
        setMembers([]); // Clear members on error
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      toast({
        title: "Error",
        description: "Failed to fetch members.",
        variant: "destructive",
      });
      setMembers([]); // Clear members on error
    } finally {
      setIsLoading(false);
    }
  }, [traceId, organizationId, toast]);

  useEffect(() => {
    fetchMembers();
  }, [organizationId, traceId]);

  const handleRemoveMember = async (member: Member) => {
    setSelectedMember(member);
    setDeleteModalOpen(true);
  };

  const confirmRemoveMember = async () => {
    if (!selectedMember) return;

    startTransition(async () => {
      try {
        const result = await removeMemberAction(traceId, selectedMember.id);

        if (result.code === "00") {
          toast({
            title: "Success",
            description: "Member removed successfully.",
          });
          // Refresh the members list
          fetchMembers();
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to remove member.",
            variant: "destructive",
          });
        }
      } catch {
        toast({
          title: "Error",
          description: "Failed to remove member.",
          variant: "destructive",
        });
      } finally {
        setDeleteModalOpen(false);
        setSelectedMember(null);
      }
    });
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      owner: "destructive" as const,
      member: "secondary" as const,
      admin: "default" as const,
    };

    const icons = {
      owner: <ShieldIcon className="h-3 w-3" />,
      member: <UserIcon className="h-3 w-3" />,
      admin: <ShieldIcon className="h-3 w-3" />,
    };

    // Safely get variant and icon with fallbacks for unknown roles
    const variant = role in variants ? variants[role as keyof typeof variants] : "secondary";
    const icon = role in icons ? icons[role as keyof typeof icons] : <UserIcon className="h-3 w-3" />;

    return (
      <Badge variant={variant} className="flex items-center gap-1">
        {icon}
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Manage who has access to {currentOrganization?.name || "your organization"}
              </CardDescription>
            </div>
            <Button onClick={() => setIsInviteModalOpen(true)} className="flex items-center gap-2">
              <UserPlusIcon className="h-4 w-4" />
              Invite Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">
              <div className="border-primary mx-auto h-12 w-12 animate-spin rounded-full border-b-2"></div>
              <p className="text-muted-foreground mt-2 text-sm">Loading members...</p>
            </div>
          ) : members.length === 0 ? (
            <div className="py-8 text-center">
              <UsersIcon className="text-muted-foreground mx-auto h-12 w-12" />
              <h3 className="mt-2 text-sm font-semibold">No members yet</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Get started by inviting team members to your organization.
              </p>
              <div className="mt-6">
                <Button onClick={() => setIsInviteModalOpen(true)}>
                  <UserPlusIcon className="mr-2 h-4 w-4" />
                  Invite First Member
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={member.image} alt={member.name} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{member.name}</p>
                        {getRoleBadge(member.role)}
                      </div>
                      <p className="text-muted-foreground text-sm">{member.email}</p>
                      <p className="text-muted-foreground text-xs">
                        Joined {new Date(member.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {member.role !== "owner" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveMember(member)}
                        disabled={isPending}
                      >
                        <TrashIcon className="h-4 w-4" />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => {
          setIsInviteModalOpen(false);
          onRefresh?.();
        }}
        organizationId={organizationId}
        traceId={traceId}
      />

      <AlertModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmRemoveMember}
        loading={isPending}
        title="Remove Member"
        description={`Are you sure you want to remove ${selectedMember?.name} from ${currentOrganization?.name}? This action cannot be undone.`}
      />
    </>
  );
}
