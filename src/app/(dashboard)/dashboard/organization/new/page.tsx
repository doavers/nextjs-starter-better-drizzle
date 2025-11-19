import { headers } from "next/headers";
import { redirect } from "next/navigation";

import PageContainer from "@/components/dashboard/layout/page-container";
import UserOrganizationForm from "@/features/organizations/components/user-organization-form";
import { auth } from "@/lib/auth";

export default async function NewOrganizationPage() {
  // Check if user is authenticated
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <UserOrganizationForm />
      </div>
    </PageContainer>
  );
}
