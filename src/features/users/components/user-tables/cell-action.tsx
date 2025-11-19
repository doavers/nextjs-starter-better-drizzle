"use client";

import { EditIcon, EllipsisIcon, TrashIcon, EyeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { v4 as uuidv4 } from "uuid";

import { deleteUserAction } from "@/actions/common/user-action";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import UserType from "@/types/common/user-type";

interface CellActionProps {
  data: UserType;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  const onConfirm = async () => {
    startTransition(async () => {
      try {
        const traceId = uuidv4();
        const result = await deleteUserAction(traceId, data.id);

        if (result.code === "00") {
          toast({
            title: "Success",
            description: "User deleted successfully.",
          });
          router.refresh();
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to delete user.",
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
    router.push(`/dashboard/user/${data.id}`);
  };

  const handleEdit = () => {
    router.push(`/dashboard/user/${data.id}`);
  };

  const handleDelete = () => {
    setOpen(true);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={isPending}
        title="Delete User"
        description={`Are you sure you want to delete ${data.name}? This action cannot be undone.`}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
            <span className="sr-only">Open menu</span>
            <EllipsisIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleView}>
            <EyeIcon className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit}>
            <EditIcon className="mr-2 h-4 w-4" />
            Edit User
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600" disabled={isPending}>
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
