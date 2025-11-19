import { CheckCircle, Cloud, CodeXml, ShoppingBasket, Smartphone } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Services = async () => {
  const t = await getTranslations("services");

  const services = [
    {
      icon: <CodeXml className="text-primary h-10 w-10" />,
      title: t("service-list.1.title"),
      description: t("service-list.1.description"),
      features: ["Responsive Design", "E-commerce Solutions", "CMS Integration", "API Development"],
      link: "/contact?service=web",
    },
    {
      icon: <Smartphone className="text-primary h-10 w-10" />,
      title: t("service-list.2.title"),
      description: t("service-list.2.description"),
      features: ["Native iOS & Android", "Cross-Platform (React Native)", "UI/UX Design", "App Store Submission"],
      link: "/contact?service=mobile",
    },
    {
      icon: <Cloud className="text-primary h-10 w-10" />,
      title: t("service-list.3.title"),
      description: t("service-list.3.description"),
      features: ["99.9% Uptime Guarantee", "Automated Backups", "Scalable Resources", "24/7 Monitoring"],
      link: "/contact?service=cloud",
    },
    {
      icon: <ShoppingBasket className="text-primary h-10 w-10" />,
      title: t("service-list.4.title"),
      description: t("service-list.4.description"),
      features: ["E-commerce Solutions", "Secure Payment", "CMS Integration", "API Development"],
      link: "/contact?service=ecommerce",
    },
  ];

  return (
    <section id="services" className="bg-gray-1 pt-5 pb-8 lg:pt-[5px] lg:pb-[70px] dark:bg-gray-800">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="wow fadeInUp" data-wow-delay=".2s">
          <div className="mt-20 grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => (
              <Card key={service.title} className="flex flex-col">
                <CardHeader className="items-center text-center">
                  <div className="mx-auto">{service.icon}</div>
                  <CardTitle className="mt-4 text-2xl">{service.title}</CardTitle>
                  <CardDescription className="mt-2">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <CheckCircle className="mr-3 h-5 w-5 shrink-0 text-green-500" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 w-full">
                    <Link href={service.link}>Request a Quote</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
