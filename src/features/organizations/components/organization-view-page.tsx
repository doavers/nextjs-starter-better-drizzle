import { notFound } from "next/navigation";

import { getOrganizationByIdAction } from "@/actions/common/organization-action";
import { OrganizationType } from "@/types/common/organization-type";

import OrganizationForm from "./organization-form";

type TOrganizationViewPageProps = {
  traceId: string;
  organizationId: string;
};

export default async function OrganizationViewPage({ traceId, organizationId }: TOrganizationViewPageProps) {
  let organization = null;
  let pageTitle = "Create New Organization";

  if (organizationId !== "new") {
    const apiRes = await getOrganizationByIdAction(traceId, organizationId);
    organization = apiRes.data as OrganizationType;
    if (!organization) {
      notFound();
    }
    pageTitle = `Edit Organization`;
  }

  return <OrganizationForm initialData={organization} pageTitle={pageTitle} />;
}
