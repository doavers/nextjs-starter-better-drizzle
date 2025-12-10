import { APP_CONFIG } from "@/config/app-config";

export async function GET() {
  const rssData = {
    title: `${APP_CONFIG.name} RSS Feed`,
    description: `This is ${APP_CONFIG.name} RSS feed`,
    link: `${APP_CONFIG.url}/rss.xml`,
    copyright: `${new Date().getFullYear()} ${APP_CONFIG.name}`,
    items: [
      {
        title: `${APP_CONFIG.meta.title}`,
        description: `${APP_CONFIG.meta.description}`,
        link: `${APP_CONFIG.url}`,
        publishDate: new Date().toUTCString(),
        guid: "menu-data-home",
      },
      {
        title: `About ${APP_CONFIG.name}`,
        description: `About ${APP_CONFIG.meta.title}`,
        link: `${APP_CONFIG.url}/about`,
        publishDate: new Date().toUTCString(),
        guid: "menu-data-about",
      },
      {
        title: `${APP_CONFIG.name} Services`,
        description: `Services ${APP_CONFIG.meta.title}`,
        link: `${APP_CONFIG.url}/services`,
        publishDate: new Date().toUTCString(),
        guid: "menu-data-services",
      },
      {
        title: `${APP_CONFIG.name} Portfolio`,
        description: `Portfolio ${APP_CONFIG.meta.title}`,
        link: `${APP_CONFIG.url}/portfolio`,
        publishDate: new Date().toUTCString(),
        guid: "menu-data-portfolio",
      },
      {
        title: `${APP_CONFIG.name} Blog`,
        description: `Blog ${APP_CONFIG.meta.title}`,
        link: `${APP_CONFIG.url}/blogs`,
        publishDate: new Date().toUTCString(),
        guid: "menu-data-blogs",
      },
      {
        title: `Contact ${APP_CONFIG.name}`,
        description: `Contact ${APP_CONFIG.meta.title}`,
        link: `${APP_CONFIG.url}/contact`,
        publishDate: new Date().toUTCString(),
        guid: "menu-data-contact",
      },
    ],
  };
  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
 <title>${rssData.title}</title>
 <description>${rssData.description}</description>
 <link>${rssData.link}</link>
 <copyright>${rssData.copyright}</copyright>
 ${rssData.items.map(
   (item: { title: string; description: string; link: string; publishDate: string; guid: string }) => {
     return `<item>
    <title>${item.title}</title>
    <description>${item.description}</description>
    <link>${item.link}</link>
    <pubDate>${item.publishDate}</pubDate>
    <guid isPermaLink="false">${item.guid}</guid>
 </item>`;
   },
 )}
</channel>
</rss>`;

  const headers = new Headers({ "content-type": "application/xml" });

  return new Response(rssFeed, { headers });
}
