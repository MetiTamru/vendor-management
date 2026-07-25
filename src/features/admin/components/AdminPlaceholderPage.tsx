"use client";

import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PlaceholderKey = "users" | "roles" | "settings";

type AdminPlaceholderPageProps = {
	section: PlaceholderKey;
};

export function AdminPlaceholderPage({ section }: AdminPlaceholderPageProps) {
	const t = useTranslations("Admin.placeholders");

	return (
		<div className="container max-w-2xl py-8">
			<Card>
				<CardHeader>
					<CardTitle>{t(`${section}Title`)}</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						{t(`${section}Description`)}
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
