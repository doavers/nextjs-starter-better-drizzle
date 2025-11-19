"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MailIcon, UserPlusIcon } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { inviteMemberAction } from "@/actions/common/organization-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const inviteMemberSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["member", "admin"]),
  message: z.string().optional(),
});

type InviteMemberForm = z.infer<typeof inviteMemberSchema>;

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
  traceId: string;
}

export function InviteMemberModal({ isOpen, onClose, organizationId, traceId }: InviteMemberModalProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<InviteMemberForm>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: "",
      role: "member",
      message: "",
    },
  });

  const onSubmit = (data: InviteMemberForm) => {
    startTransition(async () => {
      try {
        const result = await inviteMemberAction(traceId, organizationId, {
          email: data.email,
          role: data.role,
          message: data.message,
        });

        if (result.code === "00") {
          toast({
            title: "Invitation sent",
            description: `Invitation has been sent to ${data.email}`,
          });

          form.reset();
          onClose();
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to send invitation. Please try again.",
            variant: "destructive",
          });
        }
      } catch {
        toast({
          title: "Error",
          description: "Failed to send invitation. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlusIcon className="h-5 w-5" />
            Invite Team Member
          </DialogTitle>
          <DialogDescription>
            Send an invitation to join your organization. They will receive an email with instructions to accept.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input placeholder="colleague@example.com" type="email" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a role for the member" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal message (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add a personal message to the invitation..."
                      className="resize-none"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <MailIcon className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <MailIcon className="mr-2 h-4 w-4" />
                    Send Invitation
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
