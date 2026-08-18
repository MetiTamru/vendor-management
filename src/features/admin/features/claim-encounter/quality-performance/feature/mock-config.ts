import type { ApiQualityPerformancePlaceholderDto } from "./dto/qualityPerformanceDto";

export const QUALITY_PERFORMANCE_PLACEHOLDER_PAGES: ApiQualityPerformancePlaceholderDto[] =
	[
		{
			slug: "gap-closure",
			title: "Gap Closure",
			description:
				"Manage open quality gaps, track closure activities, and monitor outreach progress across measures.",
		},
		{
			slug: "ncqa-submission",
			title: "NCQA Submission",
			description:
				"Track HEDIS file creation, validation, submission status, and NCQA response handling.",
		},
		{
			slug: "performance-trends",
			title: "Performance Trends",
			description:
				"Analyze compliance trends over time, compare measurement years, and identify improving or declining measures.",
		},
		{
			slug: "provider-performance",
			title: "Provider Performance",
			description:
				"Review provider-level quality measure results, compliance rates, and gap closure performance.",
		},
		{
			slug: "audit",
			title: "Audit",
			description:
				"Review quality measure audit trails, calculation changes, and compliance documentation.",
		},
		{
			slug: "documents",
			title: "Documents",
			description:
				"Access HEDIS specifications, technical notes, provider tips, and quality performance reports.",
		},
	];
