export const seo = (title: string, description: string) => ({
  meta: [
    { title: `${title} · Ravyu` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} · Ravyu` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ],
});
