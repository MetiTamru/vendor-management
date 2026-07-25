import { ArrowRight, Github, Linkedin, Twitter } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { HomeHeader } from "@/components/home/HomeHeader";
import Logo from "@/components/shared/logo/Logo";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/constants/siteconfig";
import { Link } from "@/i18n/navigation";

type Features = {
	authentication: {
		enabled: boolean;
		providers: string[];
	};
	i18n: {
		defaultLocale: string;
		locales: string[];
	};
	themes: {
		default: string;
		themes: string[];
	};
};

function renderFeatureContent(key: keyof Features, value: unknown) {
	if (typeof value === "object" && value !== null) {
		switch (key) {
			case "authentication": {
				const auth = value as Features["authentication"];
				return auth.enabled
					? `Supports ${auth.providers.join(", ")}`
					: "Disabled";
			}
			case "i18n": {
				const i18n = value as Features["i18n"];
				return `Supports ${i18n.locales.join(", ")}`;
			}
			case "themes": {
				const themes = value as Features["themes"];
				return `Supports ${themes.themes.join(", ")}`;
			}
		}
	}
	return "Enabled";
}

export default async function Home() {
	const t = await getTranslations("HomePage");

	return (
		<div className="min-h-screen bg-gradient-to-b from-muted/50 to-background">
			<HomeHeader />
			<div className="container mx-auto px-4 py-16">
				<div className="mb-16 text-center">
					<div className="mx-auto mb-8 flex justify-center">
						<Logo />
					</div>
					<h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
						{t("title")}
					</h1>
					<p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
						{siteConfig.description}
					</p>
					<div className="flex justify-center gap-4">
						<Button asChild>
							<Link href={siteConfig.links.docs}>
								Get Started <ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
						<Button variant="outline" asChild>
							<a
								href={siteConfig.links.github}
								target="_blank"
								rel="noopener noreferrer"
							>
								<Github className="mr-2 h-4 w-4" /> GitHub
							</a>
						</Button>
					</div>
				</div>

				<div className="mb-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
					{(
						Object.entries(siteConfig.features) as [keyof Features, unknown][]
					).map(([key, value]) => (
						<div key={key} className="rounded-lg border bg-card p-6">
							<h3 className="mb-2 text-xl font-semibold capitalize">
								{key.replace(/([A-Z])/g, " $1").trim()}
							</h3>
							<p className="text-sm text-muted-foreground">
								{renderFeatureContent(key, value)}
							</p>
						</div>
					))}
				</div>

				<div className="flex justify-center space-x-6">
					<a
						href={siteConfig.social.github}
						className="text-muted-foreground hover:text-foreground"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Github className="h-6 w-6" />
					</a>
					<a
						href={siteConfig.social.twitter}
						className="text-muted-foreground hover:text-foreground"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Twitter className="h-6 w-6" />
					</a>
					<a
						href={siteConfig.social.linkedin}
						className="text-muted-foreground hover:text-foreground"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Linkedin className="h-6 w-6" />
					</a>
				</div>
			</div>
		</div>
	);
}
