import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { v4 as uuidv4 } from "uuid";

import FormCardSkeleton from "@/components/dashboard/form/form-card-skeleton";
import PageContainer from "@/components/dashboard/layout/page-container";
import { UserRole } from "@/config/role-config";
import UserViewPage from "@/features/users/components/user-view-page";
import { isAllowedRole } from "@/lib/api/role-validation";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard : User Form",
};

type PageProps = { params: Promise<{ userId: string }> };

async function hasEditPermission(): Promise<boolean> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.role) {
    return false;
  }

  return isAllowedRole(session.user.role, [UserRole.SUPERADMIN, UserRole.ADMIN]);
}

export default async function Page(props: PageProps) {
  // Require admin or superadmin role to access user management
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/login");
  }

  const hasEdit = await hasEditPermission();
  const params = await props.params;

  // Redirect based on permissions
  if (hasEdit) {
    redirect(`/dashboard/user/${params.userId}/edit`);
  } else {
    redirect(`/dashboard/user/${params.userId}/view`);
  }

  // This should never be reached due to redirects
  const traceId = uuidv4();
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
