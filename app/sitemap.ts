import type { MetadataRoute } from "next";

const BASE = "https://www.carestaysuites.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/listings`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/corporate`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/contact`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.5 },
  ];
}
