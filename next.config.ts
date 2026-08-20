import { NextConfig } from "next";

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import createNextIntlPlugin from "next-intl/plugin";

const isDockerBuild = process.env.DOCKER_BUILD === "1";
const withBundleAnalyzer =
	process.env.ANALYZE === "true"
		? // eslint-disable-next-line @typescript-eslint/no-require-imports
			require("@next/bundle-analyzer")({ enabled: true })
		: (config: NextConfig) => config;

const nextConfig: NextConfig = {
	output: "standalone",
	poweredByHeader: false,
	reactStrictMode: true,
	productionBrowserSourceMaps: false,
	compress: true,
	compiler: {
		removeConsole:
			process.env.NODE_ENV === "production"
				? { exclude: ["error", "warn"] }
				: false,
	},
	experimental: {
		optimizePackageImports: [
			"lucide-react",
			"@radix-ui/react-icons",
			"better-auth",
			"date-fns",
			"recharts",
			"@radix-ui/react-dialog",
			"@radix-ui/react-dropdown-menu",
			"@radix-ui/react-select",
		],
	},
	eslint: {
		ignoreDuringBuilds: isDockerBuild,
	},
	typescript: {
		ignoreBuildErrors: false,
	},
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{ key: "X-Frame-Options", value: "DENY" },
					{ key: "X-Content-Type-Options", value: "nosniff" },
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
				],
			},
		];
	},
};

const withNextIntl = createNextIntlPlugin();
export default withBundleAnalyzer(withNextIntl(nextConfig));

// Older Next/OpenNext combinations can start workerd during `next build`,
// so only enable the Cloudflare dev shim for local development.
if (process.env.NODE_ENV === "development") {
	initOpenNextCloudflareForDev();
}
