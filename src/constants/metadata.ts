import { type Metadata } from "next";

import { siteConfig } from "./siteconfig";

export const metadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	title: {
		template: siteConfig.seo.titleTemplate,
		default: siteConfig.seo.defaultTitle,
	},
	description: siteConfig.description,
	keywords: [
		siteConfig.name.toLowerCase(),
		"nextjs",
		"react",
		"typescript",
		"tailwindcss",
		"web development",
		"boilerplate",
		"template",
		"modern web",
		"frontend development",
		"responsive design",
		"performance",
		"accessibility",
		"SEO friendly",
		"developer tools",
	],
	authors: [{ name: siteConfig.author.name }], // Changed from support.email
	creator: siteConfig.author.name,
	publisher: siteConfig.appPublisher,
	applicationName: siteConfig.name,
	category: "Web Development",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	robots: {
		index: siteConfig.seo.robotsEnabled,
		follow: siteConfig.seo.robotsEnabled,
		googleBot: {
			index: siteConfig.seo.robotsEnabled,
			follow: siteConfig.seo.robotsEnabled,
			"max-image-preview": "large",
			"max-video-preview": -1,
			"max-snippet": -1,
		},
	},
	openGraph: {
		type: "website",
		locale: siteConfig.features.i18n.defaultLocale,
		url: siteConfig.url,
		title: siteConfig.seo.defaultTitle,
		description: siteConfig.description,
		siteName: siteConfig.name,
		images: [
			{
				url: `${siteConfig.url}${siteConfig.ogImage}`,
				width: 1200,
				height: 630,
				alt: `${siteConfig.name} Logo`,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: siteConfig.seo.defaultTitle,
		description: siteConfig.description,
		creator: siteConfig.links.twitter,
		images: [`${siteConfig.url}${siteConfig.ogImage}`],
	},
	verification: {
		google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
		yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
	},
	alternates: {
		canonical: siteConfig.url,
		languages: Object.fromEntries(
			siteConfig.features.i18n.locales.map((locale) => [
				locale,
				`${siteConfig.url}/${locale}`,
			])
		),
	},
	generator: siteConfig.name,
	manifest: `${siteConfig.url}/manifest.json`,
	other: {
		"mobile-web-app-capable": "yes",
		"apple-mobile-web-app-capable": "yes",
		"application-name": siteConfig.name,
		"apple-mobile-web-app-title": siteConfig.name,
		"theme-color": "#ffffff",
		"msapplication-navbutton-color": "#ffffff",
		"apple-mobile-web-app-status-bar-style": "black-translucent",
		"msapplication-starturl": "/",
	},
};

export const appInfo = {
	version: siteConfig.version,
	author: siteConfig.author,
	platforms: ["Web"],
	minRequirements: {
		node: ">=18.0.0",
		npm: ">=8.0.0",
	},
	features: Object.keys(siteConfig.features),
	techStack: {
		framework: "Next.js",
		language: "TypeScript",
		styling: "Tailwind CSS",
		components: "shadcn/ui",
		stateManagement: "Zustand",
		api: "TanStack Query + fetch",
		testing: "Jest & React Testing Library",
	},
};
