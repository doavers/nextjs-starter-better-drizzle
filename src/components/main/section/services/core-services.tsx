import { Cloud, CodeXml, ShoppingBasket, Smartphone } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CoreServices = async () => {
  const t = await getTranslations("services");

  const services = [
    {
      icon: <CodeXml className="text-primary h-10 w-10" />,
      title: t("service-list.1.title"),
      description: t("service-list.1.description"),
    },
    {
      icon: <Smartphone className="text-primary h-10 w-10" />,
      title: t("service-list.2.title"),
      description: t("service-list.2.description"),
    },
    {
      icon: <Cloud className="text-primary h-10 w-10" />,
      title: t("service-list.3.title"),
      description: t("service-list.3.description"),
    },
    {
      icon: <ShoppingBasket className="text-primary h-10 w-10" />,
      title: t("service-list.4.title"),
      description: t("service-list.4.description"),
    },
  ];

  return (
    <section id="services" className="py-24 sm:py-32">
      <div className="mx-auto mt-10 max-w-screen-xl px-4">
        <div className="text-center">
          <h2 className="text-foreground font-headline text-3xl font-bold tracking-tight sm:text-4xl">{t("title")}</h2>
          <p className="text-muted-foreground mt-4 text-lg">{t("description")}</p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Card
              key={service.title}
              className="transform text-center transition-transform duration-300 hover:-translate-y-2"
            >
              <CardHeader>
                <div className="bg-primary/10 mx-auto flex h-20 w-20 items-center justify-center rounded-full dark:bg-slate-400">
                  {service.icon}
                </div>
                <CardTitle className="mt-4">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="shadow-1 hover:bg-gray-2 inline-flex items-center justify-center rounded-md bg-black px-7 py-[14px] text-center text-base font-medium text-white transition duration-300 ease-in-out dark:bg-white dark:text-black"
          >
            {t("explore-our-services")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CoreServices;
