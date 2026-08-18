/** Intentionally mock-backed analytics domain; no vendor-core route. */
import { withMockOrRemote } from "@/lib/mock-mode";

import type { ApiQualityPerformancePlaceholderDto } from "../dto/qualityPerformanceDto";
import { QUALITY_PERFORMANCE_PLACEHOLDER_PAGES } from "../mock-config";

export async function getQualityPerformancePlaceholder(
	slug: string
): Promise<ApiQualityPerformancePlaceholderDto | null> {
	return withMockOrRemote(
		() =>
			QUALITY_PERFORMANCE_PLACEHOLDER_PAGES.find((page) => page.slug === slug) ??
			null,
		async () => null
	);
}

export async function listQualityPerformancePlaceholders(): Promise<
	ApiQualityPerformancePlaceholderDto[]
> {
	return withMockOrRemote(
		() => QUALITY_PERFORMANCE_PLACEHOLDER_PAGES,
		async () => []
	);
}
