import { Metadata } from "next";

import Breadcrumb from "@/components/main/common/breadcrumb";
import NotFound from "@/components/main/section/not-found";
import { APP_CONFIG } from "@/config/app-config";

export const metadata: Metadata = {
  title: `404 Page | ${APP_CONFIG.meta.title}`,
};

const ErrorPage = () => {
  return (
    <>
      <Breadcrumb pageName="404" />

      <NotFound />
    </>
  );
};

export default ErrorPage;
