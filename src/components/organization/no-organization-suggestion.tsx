"use client";

import { Building2, Plus, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrganizationContext } from "@/hooks/use-organization-context";

export function NoOrganizationSuggestion() {
  const { isLoading } = useOrganizationContext();
  const router = useRouter();

  if (isLoading) {
    return null;
  }

  const handleCreateOrganization = () => {
    router.push("/dashboard/organization");
  };

  return (
    <Card className="mx-auto max-w-lg text-center">
      <CardHeader className="pb-4">
        <div className="mx-flex bg-primary/10 mx-auto mb-4 size-16 items-center justify-center rounded-full">
          <Building2 className="text-primary size-8" />
        </div>
        <CardTitle className="text-2xl">No Organization Found</CardTitle>
        <CardDescription className="text-base">
          You haven&apos;t joined any organizations yet. Create your first organization to get started with the
          dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium">With an organization, you can:</h4>
          <ul className="text-muted-foreground space-y-1 text-left text-sm">
            <li>• Manage team members and roles</li>
            <li>• Organize projects and resources</li>
            <li>• Collaborate with your team</li>
            <li>• Configure organization-wide settings</li>
          </ul>
        </div>
        <Button onClick={handleCreateOrganization} className="w-full" size="lg">
          <Plus className="mr-2 size-4" />
          Create Your First Organization
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
