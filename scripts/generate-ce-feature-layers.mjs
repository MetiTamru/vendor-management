#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(
	import.meta.dirname,
	"../src/features/admin/features/claim-encounter"
);
const MOCK_COMMENT =
	"Intentionally mock-backed analytics domain; no vendor-core route.";

function ensureDir(dir) {
	fs.mkdirSync(dir, { recursive: true });
}

function write(filePath, content) {
	ensureDir(path.dirname(filePath));
	fs.writeFileSync(filePath, content, "utf8");
}

function baseName(id) {
	return id.split("/").pop();
}

function writeLayer({
	id,
	pascal,
	mockRel,
	domain,
	listHooks,
	reExports,
	apiFns,
	extraImports = [],
}) {
	const name = baseName(id);
	const dir = path.join(ROOT, id, "feature");

	write(
		path.join(dir, "dto", `${name}Dto.ts`),
		`export type * from "${mockRel}";\n`
	);

	const typeLines = [
		`import type { FeatureListResult } from "@/features/admin/shared/feature-contract";`,
		``,
		`export * from "${mockRel}";`,
	];
	for (const imp of extraImports) {
		if (Array.isArray(imp)) {
			typeLines.push(`export * from "${imp[1]}";`);
		} else if (typeof imp === "string") {
			typeLines.push(imp);
		}
	}
	typeLines.push(
		``,
		`export type ${pascal}ListResult<T> = FeatureListResult<T>;`,
		``
	);
	write(path.join(dir, "types", `${name}Model.ts`), typeLines.join("\n"));

	write(
		path.join(dir, "mappers", `${name}Mappers.ts`),
		`export * from "${mockRel}";\n`
	);

	const mockImports = [`import * as mock from "${mockRel}";`];
	for (const imp of extraImports) {
		if (Array.isArray(imp)) {
			mockImports.push(`import * as ${imp[0]} from "${imp[1]}";`);
		}
	}

	const apiBodies = apiFns.map(([fnName, mockRef, kind, source = "mock"]) => {
		const src = source;
		if (kind === "fn") {
			return `
export async function ${fnName}(...args: Parameters<typeof ${src}.${mockRef}>) {
	return withMockOrRemote(
		() => ${src}.${mockRef}(...args),
		async () => [] as Awaited<ReturnType<typeof ${src}.${mockRef}>>
	);
}`;
		}
		if (kind === "object") {
			return `
export async function ${fnName}() {
	return withMockOrRemote(
		() => ${src}.${mockRef},
		async () => ${src}.${mockRef}
	);
}`;
		}
		if (kind === "async-fn") {
			return `
export async function ${fnName}(...args: Parameters<typeof ${src}.${mockRef}>) {
	return withMockOrRemote(
		() => ${src}.${mockRef}(...args),
		async () => ""
	);
}`;
		}
		return `
export async function ${fnName}() {
	return withMockOrRemote(() => ${src}.${mockRef}, async () => []);
}`;
	});

	write(
		path.join(dir, "api", `${name}Api.ts`),
		`/** ${MOCK_COMMENT} */
import { withMockOrRemote } from "@/lib/mock-mode";
${mockImports.join("\n")}
${apiBodies.join("\n")}
`
	);

	const apiImportNames = apiFns.map(([fnName]) => fnName);
	const reExportLines = (reExports ?? []).map(
		(sym) => `export { ${sym} } from "../types/${name}Model";`
	);
	const hookBlocks = (listHooks ?? [])
		.map(({ hook, api, prop }) => {
			const query = `use${pascal}${hook}Query`;
			const list = `use${pascal}${hook}List`;
			return `
export function ${query}() {
	return useQuery({
		queryKey: featureQueryKey(domain, "${prop}"),
		queryFn: async () => {
			const items = await ${api}();
			const list = Array.isArray(items) ? items : [];
			return { items: list, total: list.length };
		},
	});
}

export function ${list}() {
	const query = ${query}();
	return { ...query, ${prop}: query.data?.items ?? [] };
}`;
		})
		.join("\n");

	write(
		path.join(dir, "queries", `use${pascal}Query.ts`),
		`"use client";

import { useQuery } from "@tanstack/react-query";

import { featureQueryKey } from "@/features/admin/shared/feature-contract";

import {
	${apiImportNames.join(",\n\t")}
} from "../api/${name}Api";

const domain = "${domain}";

${reExportLines.join("\n")}
${hookBlocks}
`
	);
}

const layers = [
	{
		id: "ltss",
		pascal: "Ltss",
		mockRel: "../../mock-data",
		domain: "ltss",
		listHooks: [
			{
				hook: "Authorizations",
				api: "listAuthorizations",
				prop: "authorizations",
			},
			{ hook: "Utilization", api: "listUtilization", prop: "utilization" },
			{ hook: "Vendors", api: "listVendors", prop: "vendors" },
			{ hook: "Exceptions", api: "listExceptions", prop: "exceptions" },
			{ hook: "Submissions", api: "listSubmissions", prop: "submissions" },
		],
		reExports: [
			"LTSS_TABS",
			"LTSS_KPI",
			"LTSS_KPI_ICONS",
			"LTSS_QUALITY_HREF",
			"LTSS_DRILLDOWN_EXAMPLES",
			"LtssTabId",
			"AuthStatus",
			"AuthorizationRow",
		],
		apiFns: [
			["listAuthorizations", "LTSS_AUTHORIZATIONS"],
			["listUtilization", "LTSS_UTILIZATION"],
			["listVendors", "LTSS_VENDORS"],
			["listExceptions", "LTSS_EXCEPTIONS"],
			["listSubmissions", "LTSS_SUBMISSIONS"],
			["getKpis", "LTSS_KPI", "object"],
		],
	},
	{
		id: "cms-edge",
		pascal: "CmsEdge",
		mockRel: "../../mock-data",
		domain: "cms-edge",
		listHooks: [
			{
				hook: "AuditRequests",
				api: "listAuditRequests",
				prop: "auditRequests",
			},
			{ hook: "AuditReports", api: "listAuditReports", prop: "auditReports" },
			{
				hook: "SubmissionHistory",
				api: "listSubmissionHistory",
				prop: "submissionHistory",
			},
			{ hook: "CmsResponses", api: "listCmsResponses", prop: "cmsResponses" },
			{
				hook: "DocumentLibrary",
				api: "listDocumentLibrary",
				prop: "documentLibrary",
			},
		],
		reExports: [
			"CMS_EDGE_TABS",
			"CMS_EDGE_TAB_META",
			"CMS_EDGE_REPORTING_PERIODS",
			"CmsEdgeTabId",
			"CMS_EDGE_AUDIT_KPIS",
			"CMS_EDGE_AUDIT_STATUS_MIX",
			"CMS_EDGE_AUDIT_SLA",
			"CMS_EDGE_AUDIT_FINDINGS",
			"CMS_EDGE_AUDIT_ACTIVITY",
			"CMS_EDGE_AUDIT_FINDINGS_TOTAL",
			"SEVERITY_DOT",
			"PRIORITY_DOT",
			"AUDIT_STATUS_STYLES",
			"REPORT_STATUS_STYLES",
			"FINDING_STATUS_STYLES",
			"CMS_EDGE_OVERVIEW_KPIS",
			"CMS_EDGE_OVERVIEW_SUBMISSION_HISTORY",
			"CMS_EDGE_OVERVIEW_CMS_RESPONSES",
			"CMS_EDGE_OVERVIEW_VALIDATION",
			"CMS_EDGE_OVERVIEW_FM_ITEMS",
			"CMS_EDGE_OVERVIEW_AUDIT_SUMMARY",
			"CMS_EDGE_OVERVIEW_REPORTING_CYCLE",
			"CMS_EDGE_OVERVIEW_TIMELINE",
			"CMS_EDGE_OVERVIEW_DOCUMENT_COUNTS",
			"OVERVIEW_SUBMISSION_STATUS_STYLES",
			"OVERVIEW_RESPONSE_STATUS_STYLES",
			"CMS_EDGE_RESPONSE_KPIS",
			"CMS_EDGE_RESPONSES_LIST",
			"CMS_EDGE_RESPONSE_SELECTED",
			"CMS_EDGE_RESPONSE_TYPE_MIX",
			"CMS_EDGE_RESPONSE_STATUS_TREND",
			"CMS_RESPONSE_STATUS_STYLES",
			"CMS_EDGE_SUBMISSION_KPIS",
			"CMS_EDGE_SUBMISSION_DETAILS",
			"CMS_EDGE_SUBMISSION_NOTES",
			"SUBMISSION_STATUS_STYLES",
			"SUBMISSION_CMS_RESPONSE_STYLES",
			"CMS_EDGE_VALIDATION_KPIS",
			"CMS_EDGE_VALIDATION_RUNS",
			"CMS_EDGE_VALIDATION_RECORD_TYPES",
			"CMS_EDGE_VALIDATION_SELECTED",
			"CMS_EDGE_VALIDATION_RECORD_TYPE_MIX",
			"CMS_EDGE_VALIDATION_TREND",
			"CMS_EDGE_VALIDATION_EXCEPTIONS",
			"VALIDATION_RUN_STATUS_STYLES",
			"VALIDATION_SEVERITY_STYLES",
			"CMS_EDGE_INTERNAL_VALIDATION_SUMMARY",
			"CMS_EDGE_INTERNAL_FILE_VALIDATION",
			"CMS_EDGE_INTERNAL_RECORD_VALIDATION",
			"CMS_EDGE_INTERNAL_VALIDATION_TREND",
			"CMS_EDGE_TOP_ERROR_CATEGORIES",
			"CMS_EDGE_EXTERNAL_VALIDATION_SUMMARY",
			"CMS_EDGE_EXTERNAL_FILE_VALIDATION",
			"CMS_EDGE_EXTERNAL_RECORD_VALIDATION",
			"CMS_EDGE_EXTERNAL_ERROR_BREAKDOWN",
			"CMS_EDGE_EXTERNAL_QUICK_ACTIONS",
			"CMS_EDGE_DOCUMENT_KPIS",
			"CMS_EDGE_STORAGE_MIX",
			"CMS_EDGE_DOCUMENT_TYPES",
			"CMS_EDGE_DOCUMENT_SUBMISSIONS",
			"CMS_EDGE_DOCUMENT_STATUSES",
			"CMS_EDGE_RECENT_DOCUMENTS",
			"CMS_EDGE_RETENTION_ALERTS",
			"DOCUMENT_STATUS_STYLES",
			"RETENTION_ALERT_STYLES",
			"CMS_EDGE_FM_KPIS",
			"CMS_EDGE_FM_OVERVIEW_MIX",
			"CMS_EDGE_FM_SUMMARY",
			"CMS_EDGE_FM_TREND",
			"CMS_EDGE_FM_CATEGORIES",
			"CMS_EDGE_FM_SELECTED_DETAILS",
			"CMS_EDGE_FM_ACTIVITY",
			"FM_COMPLETED_STYLE",
			"filterDocumentLibrary",
			"formatCurrencyPrecise",
		],
		apiFns: [
			["listAuditRequests", "CMS_EDGE_AUDIT_REQUESTS"],
			["listAuditReports", "CMS_EDGE_AUDIT_REPORTS"],
			["listSubmissionHistory", "CMS_EDGE_SUBMISSION_HISTORY"],
			["listCmsResponses", "CMS_EDGE_RESPONSES_LIST"],
			["listDocumentLibrary", "CMS_EDGE_DOCUMENT_LIBRARY"],
		],
	},
	{
		id: "quality-performance",
		pascal: "QualityPerformance",
		mockRel: "../../mock-data",
		domain: "quality-performance",
		listHooks: [
			{
				hook: "OpenGapsByMeasure",
				api: "listOpenGapsByMeasure",
				prop: "openGapsByMeasure",
			},
			{
				hook: "GapClosureActivity",
				api: "listGapClosureActivity",
				prop: "gapClosureActivity",
			},
		],
		reExports: [
			"QUALITY_PERFORMANCE_KPIS",
			"QUALITY_COMPLIANCE_TREND",
			"QUALITY_COMPLIANCE_GOAL",
			"QUALITY_TOP_MEASURES",
			"QUALITY_GAP_STATUS",
			"QUALITY_NCQA_SUBMISSION",
			"QUALITY_DOCUMENTS",
			"QUALITY_QUICK_ACTIONS",
			"GapTrend",
		],
		apiFns: [
			["listOpenGapsByMeasure", "QUALITY_OPEN_GAPS_BY_MEASURE"],
			["listGapClosureActivity", "QUALITY_GAP_CLOSURE_ACTIVITY"],
			["getKpis", "QUALITY_PERFORMANCE_KPIS", "object"],
		],
	},
	{
		id: "quality-performance/measure-comparison",
		pascal: "MeasureComparison",
		mockRel: "../../../measure-comparison/mock-data",
		domain: "quality-performance-measure-comparison",
		listHooks: [
			{ hook: "Measures", api: "listMeasures", prop: "measures" },
			{
				hook: "ReadinessRows",
				api: "listReadinessRows",
				prop: "readinessRows",
			},
		],
		reExports: [
			"MCR_FILTERS",
			"MCR_KPIS",
			"MCR_COMPLIANCE_DISTRIBUTION",
			"MCR_TOP_GAPS",
			"MCR_MEASURE_LIBRARY_HREF",
			"MCR_READINESS_SUMMARY",
			"MCR_READINESS_BY_DOMAIN",
			"MeasureTrend",
			"MeasureComparisonRow",
			"ComplianceBand",
			"ReadinessStatus",
			"ComponentStatus",
			"ReadinessRow",
		],
		apiFns: [
			["listMeasures", "MCR_MEASURES"],
			["listReadinessRows", "MCR_READINESS_ROWS"],
			["getKpis", "MCR_KPIS", "object"],
		],
	},
	{
		id: "risk-adjustment",
		pascal: "RiskAdjustment",
		mockRel: "../../mock-data",
		domain: "risk-adjustment",
		listHooks: [
			{ hook: "HccSummary", api: "listHccSummary", prop: "hccSummary" },
			{
				hook: "MemberOpportunities",
				api: "listMemberOpportunities",
				prop: "memberOpportunities",
			},
			{
				hook: "CodingValidation",
				api: "listCodingValidation",
				prop: "codingValidation",
			},
			{
				hook: "RaSubmissions",
				api: "listRaSubmissions",
				prop: "raSubmissions",
			},
			{ hook: "RaAudits", api: "listRaAudits", prop: "raAudits" },
			{ hook: "RaDocuments", api: "listRaDocuments", prop: "raDocuments" },
		],
		reExports: [
			"RISK_ADJUSTMENT_TABS",
			"RISK_ADJUSTMENT_TAB_SLUGS",
			"RISK_ADJUSTMENT_TAB_META",
			"RISK_ADJUSTMENT_KPIS",
			"RISK_ADJUSTMENT_RAF_TREND",
			"RISK_ADJUSTMENT_HCC_CATEGORIES",
			"RISK_ADJUSTMENT_OPPORTUNITIES",
			"RISK_ADJUSTMENT_SUBMISSIONS",
			"RISK_ADJUSTMENT_AUDIT_ITEMS",
			"RISK_ADJUSTMENT_PROGRAM_INFO",
			"RISK_ADJUSTMENT_DATA_AS_OF",
			"HCC_37_MEMBERS",
			"MEMBER_OPPORTUNITY_KPIS",
			"CODING_VALIDATION_KPIS",
			"CODING_VALIDATION_DETAIL",
			"RA_SUBMISSION_KPIS",
			"RA_SUBMISSION_DETAIL",
			"RA_AUDIT_KPIS",
			"RA_AUDIT_DETAIL",
			"RA_DOCUMENT_KPIS",
			"RA_DOCUMENT_DETAIL",
			"RiskAdjustmentTab",
			"HccSummaryRow",
			"HccMemberRow",
			"MemberOpportunityRow",
			"MemberOpportunityDetail",
			"CodingValidationRow",
			"RaSubmissionRow",
			"RaAuditRow",
			"RaDocumentRow",
			"getMemberOpportunityDetail",
		],
		apiFns: [
			["listHccSummary", "HCC_SUMMARY_ROWS"],
			["listMemberOpportunities", "MEMBER_OPPORTUNITY_ROWS"],
			["listCodingValidation", "CODING_VALIDATION_ROWS"],
			["listRaSubmissions", "RA_SUBMISSION_ROWS"],
			["listRaAudits", "RA_AUDIT_ROWS"],
			["listRaDocuments", "RA_DOCUMENT_ROWS"],
			["getMemberOpportunityDetail", "getMemberOpportunityDetail", "fn"],
		],
	},
	{
		id: "program-reporting",
		pascal: "ProgramReporting",
		mockRel: "../../mock-data",
		domain: "program-reporting",
		listHooks: [],
		extraImports: ['export type { ProgramType } from "../../types";'],
		reExports: [
			"MEDICARE_REPORTING_TABS",
			"MEDICAID_REPORTING_TABS",
			"SUBMISSION_STATUS_STYLES",
			"MEDICARE_SUBMISSION_STATUS_STYLES",
			"MEDICAID_SUBMISSION_STATUS_STYLES",
			"AUDIT_STATUS_STYLES",
			"EXCEPTION_STATUS_STYLES",
			"FINDING_SEVERITY_STYLES",
			"MEDICARE_RISK_ADJUSTMENT_KPIS",
			"MEDICARE_RISK_ADJUSTMENT_HCC_CATEGORIES",
			"MEDICARE_COMPLIANCE_KPIS",
			"MEDICARE_COMPLIANCE_REQUIREMENTS",
			"MEDICARE_COMPLIANCE_ATTESTATIONS",
			"getOverviewData",
			"getAuditData",
			"getProgramScale",
			"getSubmissionsData",
		],
		apiFns: [
			["getOverviewData", "getOverviewData", "fn"],
			["getAuditData", "getAuditData", "fn"],
			["getProgramScale", "getProgramScale", "fn"],
			["getSubmissionsData", "getSubmissionsData", "fn"],
		],
	},
	{
		id: "compliance-calendar",
		pascal: "ComplianceCalendar",
		mockRel: "../../mock-data",
		domain: "compliance-calendar",
		listHooks: [
			{ hook: "Obligations", api: "listObligations", prop: "obligations" },
			{
				hook: "UpcomingDeadlines",
				api: "listUpcomingDeadlines",
				prop: "upcomingDeadlines",
			},
		],
		reExports: [
			"COMPLIANCE_PROGRAM_COLORS",
			"COMPLIANCE_PROGRAM_LABELS",
			"COMPLIANCE_CALENDAR_KPIS",
			"COMPLIANCE_CALENDAR_MONTH",
			"COMPLIANCE_CALENDAR_TODAY",
			"COMPLIANCE_CALENDAR_EVENTS",
			"COMPLIANCE_PROGRAM_SUMMARY",
			"COMPLIANCE_FILTER_PROGRAMS",
			"COMPLIANCE_FILTER_TYPES",
			"COMPLIANCE_FILTER_STATUSES",
			"COMPLIANCE_FILTER_OWNERS",
			"COMPLIANCE_DATE_RANGE",
			"COMPLIANCE_LEGEND_ITEMS",
			"COMPLIANCE_CALENDAR_WEEK_START",
			"COMPLIANCE_CALENDAR_SCHEDULE",
			"COMPLIANCE_CALENDAR_WEEK_LABEL",
			"ComplianceProgramKey",
			"CalendarDayEvent",
			"ObligationStatus",
			"ComplianceObligationRow",
			"CalendarScheduleItem",
			"CalendarListGroup",
			"UpcomingDeadline",
			"ObligationDetail",
			"buildMay2025Grid",
			"buildComplianceWeekDays",
			"getScheduleForDay",
			"getScheduleForWeek",
			"getScheduleListGroups",
			"complianceProgramPillClass",
			"complianceStatusPillClass",
			"getObligationDetail",
			"getObligationRow",
		],
		apiFns: [
			["listObligations", "COMPLIANCE_OBLIGATIONS"],
			["listUpcomingDeadlines", "COMPLIANCE_UPCOMING_DEADLINES"],
			["getObligationDetail", "getObligationDetail", "fn"],
		],
	},
	{
		id: "compliance-program",
		pascal: "ComplianceProgram",
		mockRel: "../../mock-data",
		domain: "compliance-program",
		listHooks: [],
		reExports: [
			"ComplianceProgramRow",
			"rowsForComplianceProgramPage",
			"statsForRows",
		],
		apiFns: [
			["rowsForComplianceProgramPage", "rowsForComplianceProgramPage", "fn"],
			["statsForRows", "statsForRows", "fn"],
		],
	},
	{
		id: "executive-analytics",
		pascal: "ExecutiveAnalytics",
		mockRel: "../../mock-data",
		domain: "executive-analytics",
		listHooks: [
			{ hook: "Domains", api: "listDomains", prop: "domains" },
			{ hook: "Alerts", api: "listAlerts", prop: "alerts" },
		],
		extraImports: [
			["regulatoryMock", "../../regulatory-quality-mock"],
			["riskMock", "../../risk-exceptions-mock"],
		],
		reExports: [
			"EXECUTIVE_DATA_AS_OF",
			"EXECUTIVE_REPORTING_PERIODS",
			"EXECUTIVE_COMPARE_PERIODS",
			"EXECUTIVE_OPERATIONAL_HEALTH",
			"EXECUTIVE_KPIS",
			"EXECUTIVE_COMPLIANCE_OBLIGATIONS",
			"EXECUTIVE_ACCEPTANCE_TREND",
			"EXECUTIVE_ACCEPTANCE_TARGET",
			"EXECUTIVE_TOP_VENDORS",
			"ExecutiveHealthStatus",
			"ExecutiveDomain",
			"ExecutiveObligationStatus",
			"ExecutiveAlertSeverity",
			"executiveStatusPillClass",
			"RQ_REPORTING_PERIODS",
			"RQ_TABS",
			"RQ_KPIS",
			"RQ_OBLIGATIONS",
			"RQ_PROGRAM_COMPLIANCE",
			"RQ_OVERALL_SCORE",
			"RQ_SUBMISSION_STATUS",
			"RQ_QUALITY_COMPOSITE",
			"RQ_QUALITY_MEASURES",
			"RQ_MEASURE_DISTRIBUTION",
			"RQ_TOTAL_MEASURES",
			"RQ_ALERTS",
			"RE_REPORTING_PERIODS",
			"RE_COMPARE_PERIODS",
			"RE_KPIS",
			"RE_RAF_GAUGE",
			"RE_RAF_TREND",
			"RE_EXCEPTION_CATEGORIES",
			"RE_TOTAL_EXCEPTIONS",
			"RE_SEVERITY_BARS",
			"RE_TOP_EXCEPTIONS",
			"RE_FINANCIAL_IMPACT",
			"RE_RAF_OPPORTUNITY",
			"RE_ALERTS",
		],
		apiFns: [
			["listDomains", "EXECUTIVE_DOMAINS"],
			["listAlerts", "EXECUTIVE_ALERTS"],
			[
				"listRegulatoryQualityMeasures",
				"RQ_QUALITY_MEASURES",
				undefined,
				"regulatoryMock",
			],
			["listRiskExceptions", "RE_TOP_EXCEPTIONS", undefined, "riskMock"],
		],
	},
	{
		id: "file-management",
		pascal: "FileManagement",
		mockRel: "../../mock-data",
		domain: "file-management",
		listHooks: [
			{ hook: "SourceFiles", api: "listSourceFiles", prop: "sourceFiles" },
			{ hook: "IssuerFiles", api: "listIssuerFiles", prop: "issuerFiles" },
			{ hook: "HhsFiles", api: "listHhsFiles", prop: "hhsFiles" },
		],
		reExports: [
			"SOURCE_FILE_TYPES",
			"ISSUER_FILE_TYPES",
			"HHS_FILE_TYPES",
			"ISSUER_STATUS_OPTIONS",
			"HHS_STATUS_OPTIONS",
			"ISSUER_NAME_OPTIONS",
			"TrackedFileRow",
			"TrackFileFilters",
			"filterTrackedFiles",
			"filterIssuerHhsFiles",
			"hasSourceSearch",
			"hasIssuerHhsSearch",
		],
		apiFns: [
			["listSourceFiles", "mockSourceFiles", "fn"],
			["listIssuerFiles", "mockIssuerFiles", "fn"],
			["listHhsFiles", "mockHhsFiles", "fn"],
		],
	},
	{
		id: "medicaid-encounter",
		pascal: "MedicaidEncounter",
		mockRel: "../../mock-data",
		domain: "medicaid-encounter",
		listHooks: [
			{
				hook: "DocumentLibrary",
				api: "listDocumentLibrary",
				prop: "documentLibrary",
			},
			{
				hook: "ExceptionDetails",
				api: "listExceptionDetails",
				prop: "exceptionDetails",
			},
			{
				hook: "ResponseFiles",
				api: "listResponseFiles",
				prop: "responseFiles",
			},
		],
		reExports: [
			"MEDICAID_ENCOUNTER_KPIS",
			"MEDICAID_OVERVIEW_KPIS",
			"MEDICAID_ENCOUNTER_TABS",
			"MEDICAID_SUBMISSION_STATUS_STYLES",
			"MEDICAID_EXCEPTION_STATUS_STYLES",
			"MEDICAID_OVERVIEW_RECENT_SUBMISSIONS",
			"MEDICAID_OVERVIEW_ACCEPTANCE_TREND",
			"MEDICAID_OVERVIEW_REJECTION_DONUT",
			"MEDICAID_OVERVIEW_RECENT_RESPONSES",
			"MEDICAID_OVERVIEW_EXCEPTIONS",
			"MEDICAID_OVERVIEW_QUICK_ACTIONS",
			"MEDICAID_ACCEPTANCE_TREND",
			"MEDICAID_RATE_BY_REPORT_TYPE",
			"MEDICAID_RATE_BY_PLAN",
			"MEDICAID_REPORTS_BY_TYPE",
			"MEDICAID_TOP_REJECTIONS",
			"MEDICAID_RATE_BY_MONTH",
			"MEDICAID_SUMMARY_BY_TYPE",
			"MEDICAID_RESPONSE_KPIS",
			"MEDICAID_RESPONSE_SUMMARY_TREND",
			"MEDICAID_RESPONSES_BY_STATUS",
			"MEDICAID_TOP_ERROR_REASONS",
			"MEDICAID_RECENT_WARNINGS",
			"MEDICAID_AUDIT_KPIS",
			"MEDICAID_AUDIT_STATUS_STYLES",
			"MEDICAID_RECENT_AUDIT_ACTIVITIES",
			"MEDICAID_FINDINGS_BY_SEVERITY",
			"MEDICAID_FINDINGS_TREND",
			"MEDICAID_TOP_AUDIT_FINDINGS",
			"MEDICAID_CORRECTIVE_ACTIONS_SUMMARY",
			"MEDICAID_AUDIT_QUICK_ACTIONS",
			"MEDICAID_DOCUMENT_KPIS",
			"MEDICAID_DOCUMENT_TYPE_STYLES",
			"MEDICAID_DOCUMENT_STATUS_STYLES",
			"MEDICAID_DOCUMENT_TYPES_FILTER",
			"MEDICAID_DOCUMENT_STATES_FILTER",
			"MEDICAID_DOCUMENT_VENDORS_FILTER",
			"MEDICAID_DOCUMENT_STATUSES_FILTER",
			"MEDICAID_DOCUMENT_REPORTING_PERIODS_FILTER",
			"MEDICAID_DOCUMENT_CATEGORIES",
			"MEDICAID_DOCUMENT_QUICK_ACTIONS",
			"MEDICAID_EXCEPTION_KPIS",
			"MEDICAID_EXCEPTION_SEVERITY_STYLES",
			"MEDICAID_EXCEPTIONS_BY_SEVERITY",
			"MEDICAID_EXCEPTIONS_TREND",
			"MEDICAID_TOP_EXCEPTION_REASONS",
			"MEDICAID_EXCEPTIONS_BY_STATE",
			"MEDICAID_EXCEPTION_SEVERITY_FILTER",
			"MEDICAID_EXCEPTION_STATUS_FILTER",
			"MEDICAID_INTERNAL_VALIDATION_SUMMARY",
			"MEDICAID_EXTERNAL_VALIDATION_SUMMARY",
			"MEDICAID_INTERNAL_VALIDATION_STATUS_STYLES",
			"MEDICAID_EXTERNAL_VALIDATION_STATUS_STYLES",
			"MEDICAID_INTERNAL_VALIDATION_DETAILS",
			"MEDICAID_EXTERNAL_VALIDATION_DETAILS",
			"MEDICAID_VALIDATION_TOP_ERROR_CODES",
			"MEDICAID_VALIDATION_TREND",
			"MEDICAID_EXTERNAL_VALIDATION_TREND",
			"MEDICAID_EXTERNAL_TOP_REJECTION_CODES",
			"MEDICAID_VALIDATION_TYPE_BREAKDOWN",
			"MEDICAID_VALIDATION_QUICK_ACTIONS",
			"filterMedicaidDocuments",
			"filterMedicaidExceptions",
		],
		apiFns: [
			["listDocumentLibrary", "MEDICAID_DOCUMENT_LIBRARY"],
			["listExceptionDetails", "MEDICAID_EXCEPTION_DETAILS"],
			["listResponseFiles", "MEDICAID_RESPONSE_FILES"],
		],
	},
	{
		id: "medicare-reporting",
		pascal: "MedicareReporting",
		mockRel: "../../mock-data",
		domain: "medicare-reporting",
		listHooks: [
			{
				hook: "PartDSubmissions",
				api: "listPartDSubmissions",
				prop: "partDSubmissions",
			},
		],
		reExports: [
			"MEDICARE_REPORTING_TABS",
			"MEDICARE_PART_D_KPIS",
			"MEDICARE_PART_D_SUBMISSION_STATUS_STYLES",
			"MEDICARE_PART_D_RESPONSE_STATUS_STYLES",
			"MEDICARE_PART_D_ERROR_SEVERITY_STYLES",
			"MEDICARE_PART_D_RECONCILIATION_STATUS_STYLES",
			"MEDICARE_PART_D_COMPLIANCE_STATUS_STYLES",
			"MEDICARE_PART_D_SUBMISSIONS",
			"MEDICARE_PART_D_RESPONSES",
			"MEDICARE_PART_D_VALIDATION_ERRORS",
			"MEDICARE_PART_D_RECONCILIATION",
			"MEDICARE_PART_D_COMPLIANCE",
			"MEDICARE_PART_D_DOCUMENTS",
		],
		apiFns: [
			["listPartDSubmissions", "MEDICARE_PART_D_SUBMISSIONS"],
			["getPartDKpis", "MEDICARE_PART_D_KPIS", "object"],
		],
	},
	{
		id: "edi",
		pascal: "Edi",
		mockRel: "../../fixtures",
		domain: "claim-encounter-edi",
		listHooks: [],
		reExports: [
			"EDI_FIXTURE_PATHS",
			"EdiFixtureKey",
			"fixtureKeyForTransaction",
		],
		apiFns: [
			["loadEdiFixture", "loadEdiFixture", "async-fn"],
			["loadEdiByPath", "loadEdiByPath", "async-fn"],
		],
	},
];

for (const layer of layers) {
	// Fix program-reporting extraImports - handle as special case in writeLayer
	if (layer.id === "program-reporting") {
		const name = baseName(layer.id);
		const dir = path.join(ROOT, layer.id, "feature");
		write(
			path.join(dir, "dto", `${name}Dto.ts`),
			`export type * from "${layer.mockRel}";\n`
		);
		write(
			path.join(dir, "types", `${name}Model.ts`),
			`import type { FeatureListResult } from "@/features/admin/shared/feature-contract";

export * from "${layer.mockRel}";
export type { ProgramType } from "../../types";

export type ${layer.pascal}ListResult<T> = FeatureListResult<T>;
`
		);
		write(
			path.join(dir, "mappers", `${name}Mappers.ts`),
			`export * from "${layer.mockRel}";\n`
		);
		const apiBodies = layer.apiFns.map(([fnName, mockRef, kind]) => {
			if (kind === "fn") {
				return `
export async function ${fnName}(...args: Parameters<typeof mock.${mockRef}>) {
	return withMockOrRemote(
		() => mock.${mockRef}(...args),
		async () => [] as Awaited<ReturnType<typeof mock.${mockRef}>>
	);
}`;
			}
			return "";
		});
		write(
			path.join(dir, "api", `${name}Api.ts`),
			`/** ${MOCK_COMMENT} */
import { withMockOrRemote } from "@/lib/mock-mode";
import * as mock from "${layer.mockRel}";
${apiBodies.join("\n")}
`
		);
		const reExportLines = layer.reExports.map(
			(sym) => `export { ${sym} } from "../types/${name}Model";`
		);
		reExportLines.push(
			`export type { ProgramType } from "../types/${name}Model";`
		);
		write(
			path.join(dir, "queries", `use${layer.pascal}Query.ts`),
			`"use client";

import { featureQueryKey } from "@/features/admin/shared/feature-contract";

import {
	${layer.apiFns.map(([fn]) => fn).join(",\n\t")}
} from "../api/${name}Api";

const domain = "${layer.domain}";

${reExportLines.join("\n")}
`
		);
		console.log(`Generated ${layer.id} (special)`);
		continue;
	}

	writeLayer(layer);
	console.log(`Generated ${layer.id}`);
}
