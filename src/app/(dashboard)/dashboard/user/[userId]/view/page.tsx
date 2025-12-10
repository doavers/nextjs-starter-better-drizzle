import { Metadata } from "next";
import { Suspense } from "react";
import { v4 as uuidv4 } from "uuid";

import { getUserByIdAction } from "@/actions/common/user-action";
import FormCardSkeleton from "@/components/dashboard/form/form-card-skeleton";
import PageContainer from "@/components/dashboard/layout/page-container";
import { Button } from "@/components/ui/button";
import { UserDetailView } from "@/features/users/components/user-detail-view";
import { requireAdmin } from "@/lib/server-access-control";
import UserType from "@/types/common/user-type";

export const metadata: Metadata = {
  title: "Dashboard : View User",
};

type PageProps = { params: Promise<{ userId: string }> };

export default async function Page(props: PageProps) {
  // Require admin or superadmin role to access user management
  await requireAdmin();

  const traceId = uuidv4();
  const params = await props.params;

  // Fetch user data
  const apiRes = await getUserByIdAction(traceId, params.userId);
  const user = apiRes.data as UserType;

  if (!user) {
    return (
      <PageContainer scrollable>
        <div className="flex-1 space-y-4">
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <h1 className="text-2xl font-semibold">User Not Found</h1>
            <p className="text-muted-foreground">
              The user you&apos;re trying to view doesn&apos;t exist or you don&apos;t have permission to access it.
            </p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <UserDetailView user={user} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
