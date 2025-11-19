"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { parseDate } from "chrono-node";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import * as z from "zod";

import { createUserAction, updateUserAction } from "@/actions/common/user-action";
import { FileUploader } from "@/components/common/file-uploader";
import { FormError } from "@/components/common/form-error";
import { FormSuccess } from "@/components/common/form-success";
import { Calendar29 } from "@/components/date-picker/calendar29";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { UserRole } from "@/config/role-config";
import { isEmpty } from "@/lib/common";
import { UserFormSchema } from "@/schemas/user";
import UserType from "@/types/common/user-type";

export default function UserForm({ initialData, pageTitle }: { initialData: UserType | null; pageTitle: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const defaultValues = {
    image: undefined,
    name: initialData?.name ?? "",
    email: initialData?.email ?? "",
    role: initialData?.role ?? UserRole.USER,
    banned: initialData?.banned ?? false,
    ban_reason: initialData?.ban_reason ?? "",
    ban_expires: initialData?.ban_expires ?? undefined,
  };

  const form = useForm<z.infer<typeof UserFormSchema>>({
    resolver: zodResolver(UserFormSchema),
    defaultValues,
    values: defaultValues,
  });

  const isEditing = Boolean(!isEmpty(initialData) && initialData?.id);

  async function onSubmit(values: z.infer<typeof UserFormSchema>) {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const traceId = uuidv4();
      const payload = {
        name: values.name,
        email: values.email,
        role: values.role,
        banned: values.banned,
        ban_reason: values.banned ? values.ban_reason : null,
        ban_expires: values.banned ? values.ban_expires : null,
        image: values.image,
      };

      let result;
      if (isEditing) {
        result = await updateUserAction(traceId, initialData?.id || "", payload);
      } else {
        result = await createUserAction(traceId, payload);
      }

      if (result.code === "00") {
        setSuccess(`User ${isEditing ? "updated" : "created"} successfully.`);
        if (!isEditing) {
          form.reset();
          setTimeout(() => {
            router.push("/dashboard/user");
          }, 1500);
        }
      } else {
        setError(result.message || `Failed to ${isEditing ? "update" : "create"} user.`);
      }
    } catch (error) {
      setError(`An error occurred: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">{pageTitle}</CardTitle>
        <CardDescription>
          {isEditing
            ? "Update user information and permissions."
            : "Create a new user account with appropriate permissions."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Profile Image */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <div className="space-y-2">
                  <FormItem className="w-full">
                    <FormLabel className="text-base font-medium">Profile Image</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onValueChange={field.onChange}
                        maxFiles={1}
                        maxSize={4 * 1024 * 1024}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} disabled={loading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter email address"
                          {...field}
                          disabled={loading || isEditing}
                        />
                      </FormControl>
                      <FormMessage />
                      {isEditing && (
                        <p className="text-muted-foreground text-sm">Email cannot be changed after account creation.</p>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Role</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={loading}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={UserRole.USER as string}>USER</SelectItem>
                          <SelectItem value={UserRole.ADMIN as string}>ADMIN</SelectItem>
                          <SelectItem value={UserRole.SUPERADMIN as string}>SUPER ADMIN</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Ban Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Ban Settings</h3>
              <div className="space-y-4 rounded-lg border p-4">
                <FormField
                  control={form.control}
                  name="banned"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Banned Status</FormLabel>
                        <p className="text-muted-foreground text-sm">Ban this user from accessing the system</p>
                      </div>
                      <FormControl>
                        <Switch checked={!!field.value} onCheckedChange={field.onChange} disabled={loading} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch("banned") && (
                  <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="ban_expires"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ban Expires</FormLabel>
                          <FormControl>
                            <Calendar29
                              value={
                                field.value
                                  ? new Date(field.value).toLocaleDateString("en-US", {
                                      month: "long",
                                      day: "2-digit",
                                      year: "numeric",
                                    })
                                  : ""
                              }
                              onValueChangeAction={(val) => {
                                const parsedDate = parseDate(val);
                                field.onChange(parsedDate ? new Date(parsedDate) : undefined);
                              }}
                              month={field.value ? new Date(field.value) : undefined}
                              onMonthChangeAction={(newMonth) => {
                                if (newMonth) field.onChange(newMonth);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ban_reason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ban Reason</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter reason for ban" {...field} disabled={loading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Error and Success Messages */}
            <FormError message={error} />
            <FormSuccess message={success} />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={loading}>
          {loading ? "Saving..." : isEditing ? "Update User" : "Create User"}
        </Button>
      </CardFooter>
    </Card>
  );
}
