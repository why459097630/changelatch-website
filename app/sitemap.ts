import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.thinkitdoneapp.com";

  return [
    { url: `${baseUrl}/` },
    { url: `${baseUrl}/pricing` },
    { url: `${baseUrl}/trust` },
    { url: `${baseUrl}/privacy` },
    { url: `${baseUrl}/terms` },
    { url: `${baseUrl}/refund` },
  ];
}