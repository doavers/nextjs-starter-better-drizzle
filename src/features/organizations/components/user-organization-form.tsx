"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import * as z from "zod";

import { createUserOrganizationAction } from "@/actions/common/organization-action";
import { FileUploader } from "@/components/common/file-uploader";
import { FormError } from "@/components/common/form-error";
import { FormSuccess } from "@/components/common/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { OrganizationFormSchema } from "@/schemas/organization";

export default function UserOrganizationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const { toast } = useToast();

  const defaultValues = {
    name: "",
    slug: "",
    logo: "",
    metadata: "",
  };

  // State to handle file uploads
  const [logoFiles, setLogoFiles] = useState<File[]>([]);
  // Track if user has manually edited the slug
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  const form = useForm<z.infer<typeof OrganizationFormSchema>>({
    resolver: zodResolver(OrganizationFormSchema),
    defaultValues,
  });

  async function onSubmit(values: z.infer<typeof OrganizationFormSchema>) {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const traceId = uuidv4();
      const payload = {
        name: values.name,
        slug: values.slug,
        logo: values.logo,
        metadata: values.metadata,
      };

      const result = await createUserOrganizationAction(traceId, payload);

      if (result.code === "00") {
        const successMessage = "Organization created successfully!";
        setSuccess(successMessage);
        toast({
          title: "Success",
          description: successMessage,
        });
        form.reset();
        setTimeout(() => {
          router.push("/dashboard/organization");
        }, 2000);
      } else {
        const errorMessage = `Failed: ${result.message || "Unknown error occurred"}`;
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = `Failed: ${error instanceof Error ? error.message : "Unknown error"}`;
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    // Don't auto-update if user has manually edited the slug
    if (isSlugManuallyEdited) {
      return;
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .trim();

    form.setValue("slug", slug);
  };

  // Handle when user manually edits the slug
  const handleSlugChange = (value: string) => {
    setIsSlugManuallyEdited(true);
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">Create Your Organization</CardTitle>
        <CardDescription>
          Create your own organization. You can create one organization as a regular user.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Organization Logo */}
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <div className="space-y-2">
                  <FormItem className="w-full">
                    <FormLabel className="text-base font-medium">Organization Logo</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={logoFiles}
                        onValueChange={(files: File[] | ((prev: File[]) => File[])) => {
                          // Handle both direct File[] and updater function
                          const newFiles = Array.isArray(files) ? files : files(logoFiles);
                          setLogoFiles(newFiles);
                          // Convert file to base64 string for form submission
                          if (newFiles.length > 0) {
                            const file = newFiles[0];
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              field.onChange(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          } else {
                            field.onChange("");
                          }
                        }}
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
              <div className="grid grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter organization name"
                          {...field}
                          disabled={loading}
                          onChange={(e) => {
                            field.onChange(e);
                            handleNameChange(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="organization-slug"
                          {...field}
                          disabled={loading}
                          onChange={(e) => {
                            field.onChange(e);
                            handleSlugChange(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-muted-foreground text-sm">
                        Unique identifier used in URLs. Auto-generated from name.
                      </p>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              <FormField
                control={form.control}
                name="metadata"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Metadata</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter additional metadata (JSON format)"
                        {...field}
                        disabled={loading}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-muted-foreground text-sm">
                      Optional metadata in JSON format for additional organization settings.
                    </p>
                  </FormItem>
                )}
              />
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
          {loading ? "Creating..." : "Create Organization"}
        </Button>
      </CardFooter>
    </Card>
  );
}
