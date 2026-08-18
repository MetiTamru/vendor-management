export type QualityPerformancePlaceholderSlug =
	| "gap-closure"
	| "ncqa-submission"
	| "performance-trends"
	| "provider-performance"
	| "audit"
	| "documents";

export type QualityPerformancePlaceholderModel = {
	slug: QualityPerformancePlaceholderSlug;
	title: string;
	description: string;
};
