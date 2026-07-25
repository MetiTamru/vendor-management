import { type SidebarNavItem } from "@/types/UI/system.types";

export const siteConfig = {
	name: "Next.js Starter",
	description:
		"Frontend-first Next.js boilerplate with Better Auth, Zustand, and TanStack Query",
	version: "0.1.0",
	appPublisher: "KABA Software Development",
	author: {
		name: "Kalab Amssalu",
		email: "kalishdesandy@gmail.com",
		url: "https://github.com/kalabAmssalu",
	},
	url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
	ogImage: "/og.svg",
	links: {
		github: "https://github.com/kalabAmssalu",
		docs: "/admin/groups",
		twitter: "@kalabAmssalu",
	},
	mainNav: [
		{ title: "Home", href: "/" },
		{ title: "Groups", href: "/admin/groups" },
	],
	sidebarNav: [
		{
			title: "Groups",
			href: "/admin/groups",
			permission: "groups-list",
		},
		{
			title: "Users",
			href: "/admin/users",
			permission: "users-list",
		},
		{
			title: "Roles",
			href: "/admin/roles",
			permission: "roles-list",
		},
		{
			title: "Settings",
			href: "/admin/settings",
			permission: "settings-view",
		},
	] as SidebarNavItem[],
	settings: {
		themeToggle: true,
		languageSelector: true,
		authEnabled: true,
		searchEnabled: false,
	},
	features: {
		authentication: {
			enabled: true,
			providers: ["credentials"],
		},
		i18n: {
			defaultLocale: "en",
			locales: ["en", "am"],
		},
		themes: {
			default: "system",
			themes: ["light", "dark", "system"],
		},
		techStack: {
			framework: "Next.js",
			language: "TypeScript",
			styling: "Tailwind CSS",
			components: "shadcn/ui",
			stateManagement: "Zustand",
			api: "TanStack Query + fetch",
			testing: "Jest",
		},
	},
	api: {
		baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
		timeout: 10000,
		retryAttempts: 3,
	},
	analytics: {
		googleAnalytics: process.env.NEXT_PUBLIC_GA_ID,
		microsoftClarity: process.env.NEXT_PUBLIC_CLARITY_ID,
	},
	/** Enforced on NestJS API — not in this Next.js frontend */
	security: {
		backendEnforced: true,
	},
	seo: {
		titleTemplate: "%s | Next.js Starter",
		defaultTitle: "Next.js Starter",
		robotsEnabled: process.env.NODE_ENV === "production",
	},
	layout: {
		maxWidth: "1440px",
		navigationHeight: "64px",
		sidebarWidth: "240px",
		footerHeight: "64px",
	},
	social: {
		github: "https://github.com/kalabAmssalu",
		twitter: "https://twitter.com/kalabAmssalu",
		linkedin: "https://linkedin.com/in/kalabAmssalu",
	},
	support: {
		email: "kalishdesandy@gmail.com",
		issues: "https://github.com/kalabAmssalu/issues",
	},
};

export type SiteConfig = typeof siteConfig;
