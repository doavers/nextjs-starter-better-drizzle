"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
};

const PortfolioTab = () => {
  const t = useTranslations("portfolio");

  const tabs = [
    { id: "all", label: t("tags.all") },
    { id: "web", label: t("tags.web") },
    { id: "mobile", label: t("tags.mobile") },
    { id: "api", label: t("tags.api") },
    { id: "cloud", label: t("tags.cloud") },
    { id: "e-commerce", label: t("tags.e-commerce") },
  ];

  const projects: Project[] = [
    {
      id: "1",
      title: t("project-list.1.title"),
      description: t("project-list.1.description"),
      image: "/images/blog/blog-01.jpg",
      tags: [t("tags.web"), t("tags.e-commerce")],
    },
    {
      id: "2",
      title: t("project-list.2.title"),
      description: t("project-list.2.description"),
      image: "/images/blog/blog-02.jpg",
      tags: [t("tags.web")],
    },
    {
      id: "3",
      title: t("project-list.3.title"),
      description: t("project-list.3.description"),
      image: "/images/blog/blog-03.jpg",
      tags: [t("tags.web")],
    },
    {
      id: "4",
      title: t("project-list.4.title"),
      description: t("project-list.4.description"),
      image: "/images/blog/blog-details-01.jpg",
      tags: [t("tags.web")],
    },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = projects.filter(
    (project) => activeTab === "all" || project.tags.includes(tabs.find((tab) => tab.id === activeTab)?.label ?? ""),
  );

  return (
    <section id="services" className="bg-gray-1 pt-5 pb-8 lg:pt-[5px] lg:pb-[70px] dark:bg-gray-800">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="wow fadeInUp" data-wow-delay=".2s">
          <div className="md:mt-12.5">
            {/* <!-- Features item Start --> */}

            <div className="mx-auto w-full px-4 py-8">
              <div className="mb-8 flex space-x-4 overflow-x-auto pb-2 md:justify-center">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    variant={activeTab === tab.id ? "default" : "outline"}
                    className="rounded-full"
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                  {filteredProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-card-foreground animate_top shadow-solid-3 hover:shadow-solid-4 dark:border-strokedark dark:bg-blacksection dark:hover:bg-hoverdark z-40 overflow-hidden rounded-lg border border-white bg-white p-7.5 transition-all xl:p-12.5 dark:bg-slate-600"
                    >
                      <div className="relative h-48 cursor-pointer" onClick={() => setSelectedProject(project)}>
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover"
                          // layout="fill"
                          // objectFit="cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="mb-2 text-xl font-semibold">{project.title}</h3>
                        <p className="text-muted-foreground mb-4 dark:text-slate-200">{project.description}</p>
                        <div className="mb-4 flex flex-wrap gap-2">
                          {project.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-secondary text-secondary-foreground rounded px-2 py-1 text-xs font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Button onClick={() => alert(`View details for ${project.title}`)}>View Details</Button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              <Dialog open={selectedProject !== null} onOpenChange={(open) => !open && setSelectedProject(null)}>
                <DialogContent className="bgsm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{selectedProject?.title}</DialogTitle>
                    <DialogDescription>{selectedProject?.description}</DialogDescription>
                  </DialogHeader>
                  <div className="relative mb-4 h-64">
                    <Image
                      src={selectedProject?.image ?? "/images/image-not-available.png"}
                      alt={selectedProject?.title ?? "Image not available"}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject?.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-secondary text-secondary-foreground rounded px-2 py-1 text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            {/* <!-- Features item End --> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioTab;
