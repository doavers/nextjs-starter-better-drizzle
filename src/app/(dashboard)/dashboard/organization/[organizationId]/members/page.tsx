import { Metadata } from "next";
import { Suspense } from "react";
import { v4 as uuidv4 } from "uuid";

import { requireOrganizationAccess } from "@/actions/common/member-action";
import FormCardSkeleton from "@/components/dashboard/form/form-card-skeleton";
import PageContainer from "@/components/dashboard/layout/page-container";
import OrganizationMembersPage from "@/features/organizations/components/organization-members-page";

export const metadata: Metadata = {
  title: "Dashboard : Organization Members",
};

type PageProps = { params: Promise<{ organizationId: string }> };

export default async function Page(props: PageProps) {
  const { organizationId } = await props.params;

  // Check if user has access to this organization (redirects if no access)
  await requireOrganizationAccess(organizationId);

  const traceId = uuidv4();
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <OrganizationMembersPage traceId={traceId} organizationId={organizationId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
