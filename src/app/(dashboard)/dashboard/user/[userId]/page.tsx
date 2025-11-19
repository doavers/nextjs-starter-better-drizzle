import { Metadata } from "next";
import { Suspense } from "react";
import { v4 as uuidv4 } from "uuid";

import FormCardSkeleton from "@/components/dashboard/form/form-card-skeleton";
import PageContainer from "@/components/dashboard/layout/page-container";
import UserViewPage from "@/features/users/components/user-view-page";
import { requireAdmin } from "@/lib/server-access-control";

export const metadata: Metadata = {
  title: "Dashboard : User Form",
};

type PageProps = { params: Promise<{ userId: string }> };

export default async function Page(props: PageProps) {
  // Require admin or superadmin role to access user management
  await requireAdmin();

  const traceId = uuidv4();
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <UserViewPage traceId={traceId} userId={params.userId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
