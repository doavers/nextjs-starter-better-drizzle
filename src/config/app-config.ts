import { toTitleCase } from "@/lib/string";

import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();
const appName = toTitleCase(process.env.NEXT_PUBLIC_APP_NAME ?? "Doavers");

export const APP_CONFIG = {
  name: `${appName}`,
  version: packageJson.version,
  // copyright: `© ${currentYear}, ${appName}.`,
  copyright: `${currentYear}, ${appName}.`,
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  meta: {
    title: `${process.env.NEXT_PUBLIC_SITE_TITLE}`,
    description: `${process.env.NEXT_PUBLIC_SITE_DESCRIPTION}`,
  },
};
