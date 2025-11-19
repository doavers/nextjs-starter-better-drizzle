import { notFound } from "next/navigation";

import { getUserByIdAction } from "@/actions/common/user-action";
import UserType from "@/types/common/user-type";

import UserForm from "./user-form";

type TUserViewPageProps = {
  traceId: string;
  userId: string;
};

export default async function UserViewPage({ traceId, userId }: TUserViewPageProps) {
  let user = null;
  let pageTitle = "Create New User";

  if (userId !== "new") {
    const apiRes = await getUserByIdAction(traceId, userId);
    user = apiRes.data as UserType;
    if (!user) {
      notFound();
    }
    pageTitle = `Edit User`;
  }

  return <UserForm initialData={user} pageTitle={pageTitle} />;
}
