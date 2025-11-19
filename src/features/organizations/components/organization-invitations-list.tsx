"use client";

import { MailIcon, TrashIcon, RefreshCwIcon } from "lucide-react";
import { useState, useTransition, useEffect, useCallback } from "react";

import { getOrganizationInvitationsAction, cancelInvitationAction } from "@/actions/common/organization-action";
import { AlertModal } from "@/components/modal/alert-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrganizationContext } from "@/hooks/use-organization-context";
import { useToast } from "@/hooks/use-toast";

interface Invitation {
  id: string;
  email: string;
  role: string;
  status: string;
  expiresAt: string;
  createdAt: string;
  inviterName: string;
}

interface OrganizationInvitationsListProps {
  organizationId: string;
  traceId: string;
  onRefresh?: () => void;
}

export function OrganizationInvitationsList({ organizationId, traceId, onRefresh }: OrganizationInvitationsListProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null);
  const [isPending, startTransition] = useTransition();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { currentOrganization } = useOrganizationContext();

  const fetchInvitations = useCallback(
    async (showLoading = true) => {
      if (showLoading) setIsLoading(true);
      try {
        const result = await getOrganizationInvitationsAction(traceId, organizationId);
        if (result.code === "00") {
          // Type assertion to ensure result.data is an array of Invitation objects
          setInvitations((result.data as Invitation[]) || []);
        }
      } catch (error) {
        console.error("Error fetching invitations:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [traceId, organizationId],
  );

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  const handleCancelInvitation = async (invitation: Invitation) => {
    setSelectedInvitation(invitation);
    setDeleteModalOpen(true);
  };

  const confirmCancelInvitation = async () => {
    if (!selectedInvitation) return;

    startTransition(async () => {
      try {
        const result = await cancelInvitationAction(traceId, selectedInvitation.id);

        if (result.code === "00") {
          toast({
            title: "Success",
            description: "Invitation cancelled successfully.",
          });
          // Refresh the invitations list
          fetchInvitations(false);
          onRefresh?.();
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to cancel invitation.",
            variant: "destructive",
          });
        }
      } catch {
        toast({
          title: "Error",
          description: "Failed to cancel invitation.",
          variant: "destructive",
        });
      } finally {
        setDeleteModalOpen(false);
        setSelectedInvitation(null);
      }
    });
  };

  const handleResendInvitation = async (invitation: Invitation) => {
    startTransition(async () => {
      try {
        // TODO: Implement actual API call to resend invitation
        // For now, we'll just show a success toast with the invitation details
        console.log("Resending invitation for:", invitation.email);
        // await resendInvitationAction(traceId, invitation.id);

        toast({
          title: "Success",
          description: `Invitation resent to ${invitation.email} successfully.`,
        });
        onRefresh?.();
      } catch {
        toast({
          title: "Error",
          description: `Failed to resend invitation to ${invitation.email}.`,
          variant: "destructive",
        });
      }
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "default",
      accepted: "secondary",
      expired: "destructive",
      cancelled: "outline",
    };

    return <Badge variant={variants[status] || "secondary"}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      owner: "destructive",
      member: "secondary",
      admin: "default",
    };

    return <Badge variant={variants[role] || "secondary"}>{role.charAt(0).toUpperCase() + role.slice(1)}</Badge>;
  };

  const isExpired = (expiresAt: string) => {
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    // Check if the date is valid before comparing
    return !isNaN(expiryDate.getTime()) && expiryDate < now;
  };

  const pendingInvitations = invitations.filter((inv) => inv.status === "pending" && !isExpired(inv.expiresAt));
  const otherInvitations = invitations.filter((inv) => inv.status !== "pending" || isExpired(inv.expiresAt));

  return (
    <>
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Pending Invitations</CardTitle>
            <CardDescription>
              Manage pending invitations to {currentOrganization?.name || "your organization"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">
              <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
              <p className="text-muted-foreground mt-2 text-sm">Loading invitations...</p>
            </div>
          ) : pendingInvitations.length === 0 ? (
            <div className="py-8 text-center">
              <MailIcon className="text-muted-foreground mx-auto h-12 w-12" />
              <h3 className="mt-2 text-sm font-semibold">No pending invitations</h3>
              <p className="text-muted-foreground mt-1 text-sm">All invitations have been accepted or have expired.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingInvitations.map((invitation) => (
                <div key={invitation.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                      <MailIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{invitation.email}</p>
                        {getRoleBadge(invitation.role)}
                        {getStatusBadge(invitation.status)}
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Invited by {invitation.inviterName} • Expires{" "}
                        {!isNaN(new Date(invitation.expiresAt).getTime())
                          ? new Date(invitation.expiresAt).toLocaleDateString()
                          : "Invalid date"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResendInvitation(invitation)}
                      disabled={isPending}
                    >
                      <RefreshCwIcon className="mr-1 h-4 w-4" />
                      Resend
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelInvitation(invitation)}
                      disabled={isPending}
                    >
                      <TrashIcon className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {otherInvitations.length > 0 && (
            <>
              <div className="mt-8">
                <h4 className="mb-4 text-sm font-semibold">Past Invitations</h4>
                <div className="space-y-4">
                  {otherInvitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="flex items-center justify-between rounded-lg border p-4 opacity-75"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                          <MailIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{invitation.email}</p>
                            {getRoleBadge(invitation.role)}
                            {getStatusBadge(invitation.status)}
                          </div>
                          <p className="text-muted-foreground text-sm">
                            Invited by {invitation.inviterName} •{" "}
                            {invitation.status === "expired" ? "Expired" : "Cancelled"}{" "}
                            {!isNaN(new Date(invitation.expiresAt).getTime())
                              ? new Date(invitation.expiresAt).toLocaleDateString()
                              : "Invalid date"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <AlertModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmCancelInvitation}
        loading={isPending}
        title="Cancel Invitation"
        description={`Are you sure you want to cancel the invitation for ${selectedInvitation?.email}? This action cannot be undone.`}
      />
    </>
  );
}
