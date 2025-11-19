import { APP_CONFIG } from "@/config/app-config";

export default function Head() {
  return (
    <>
      <title>{`${APP_CONFIG.meta.title || "Doavers - All in one platform"}`}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta
        name="description"
        content={`${APP_CONFIG.meta.description || "Doavers is an all-in-one platform that empowers developers to build, deploy, and scale modern web applications."}`}
      />
      <link rel="icon" href="/images/logo/logo-square.png" />
    </>
  );
}
