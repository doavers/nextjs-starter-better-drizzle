"use client";

import { EditIcon, TrashIcon, EyeIcon, UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { v4 as uuidv4 } from "uuid";

import { deleteOrganizationAction } from "@/actions/common/organization-action";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth-client";
import { OrganizationType } from "@/types/common/organization-type";

interface CellActionProps {
  data: OrganizationType;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = authClient.useSession();

  // Check if user can delete organizations (only SUPERADMIN and ADMIN)
  const canDeleteOrganization = session?.user?.role === "superadmin" || session?.user?.role === "admin";

  // Check if user can edit organizations (only SUPERADMIN, ADMIN, or owner)
  const canEditOrganization = canDeleteOrganization || data.role === "owner";

  const onConfirm = async () => {
    startTransition(async () => {
      try {
        const traceId = uuidv4();
        const result = await deleteOrganizationAction(traceId, data.id);

        if (result.code === "00") {
          toast({
            title: "Success",
            description: "Organization deleted successfully.",
          });
          router.refresh();
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to delete organization.",
            variant: "destructive",
          });
        }
      } catch {
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      } finally {
        setOpen(false);
      }
    });
  };

  const handleView = () => {
    router.push(`/dashboard/organization/${data.id}`);
  };

  const handleEdit = () => {
    router.push(`/dashboard/organization/${data.id}`);
  };

  const handleViewMembers = () => {
    router.push(`/dashboard/organization/${data.id}/members`);
  };

  const handleDelete = () => {
    setOpen(true);
  };

  return (
    <TooltipProvider>
      <>
        <AlertModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onConfirm={onConfirm}
          loading={isPending}
          title="Delete Organization"
          description={`Are you sure you want to delete ${data.name}? This action cannot be undone and will remove all associated data.`}
        />
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleView}
                disabled={isPending}
                className="h-8 px-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              >
                <EyeIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Details</p>
            </TooltipContent>
          </Tooltip>

          {canEditOrganization && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  disabled={isPending}
                  className="h-8 px-2 text-green-600 hover:bg-green-50 hover:text-green-700"
                >
                  <EditIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Organization</p>
              </TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleViewMembers}
                disabled={isPending}
                className="h-8 px-2 text-purple-600 hover:bg-purple-50 hover:text-purple-700"
              >
                <UsersIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Members</p>
            </TooltipContent>
          </Tooltip>

          {canDeleteOrganization && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isPending}
                  className="h-8 px-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Organization</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </>
    </TooltipProvider>
  );
};
