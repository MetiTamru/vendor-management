import type { MetadataRoute } from "next";

import { siteConfig } from "@/constants/siteconfig";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = siteConfig.url;

	return [
		{
			url: `${baseUrl}`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1,
		},
		{
			url: `${baseUrl}/docs`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/components`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/examples`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/docs/getting-started`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/docs/components/ui`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/docs/components/form`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.7,
		},
	];
}
