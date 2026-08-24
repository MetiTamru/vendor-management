import { vendorCoreFetch, vendorCoreFetchBlob } from "@/lib/vendor-core/client";
import type {
	AccountDto,
	AppSettingCreateInput,
	AppSettingDto,
	AppSettingListQuery,
	AppSettingUpdateInput,
	AuditRecordDto,
	ClaimLineDto,
	ConnectionDto,
	CoreUserDto,
	CredentialDto,
	EligibilityFileDto,
	ErrorRecordDto,
	IdentityGroupCreateInput,
	IdentityGroupDto,
	IdentityGroupListQuery,
	IdentityGroupUpdateInput,
	InboundFileDto,
	IntakeJobDto,
	IntakeJobRunDto,
	LoginEventDto,
	MemberCoverageDto,
	MemberDetailDto,
	MemberListDto,
	MemberListQuery,
	MonitoringDashboardDto,
	PaginatedResult,
	ProcessingEventDto,
	ProviderCreateInput,
	ProviderDashboardStatsDto,
	ProviderDashboardStatsQuery,
	ProviderDto,
	ProviderListQuery,
	ProviderRosterCreateInput,
	ProviderRosterDto,
	ProviderRosterListQuery,
	ProviderRosterUpdateInput,
	ProviderStatusInput,
	ProviderUpdateInput,
	RoleCreateInput,
	RoleDto,
	RoleListQuery,
	RoleUpdateInput,
	RoutingRuleDto,
	ValidationResultDto,
	VendorDto,
} from "@/lib/vendor-core/types";
import {
	normalizeAccount,
	normalizeClaimLine,
	normalizeConnection,
	normalizeEligibilityFile,
	normalizeErrorRecord,
	normalizeInboundFile,
	normalizeJob,
	normalizeJobRun,
	normalizeMemberCoverage,
	normalizeProcessingEvent,
	normalizeProvider,
	normalizeProviderRoster,
	normalizeValidationResult,
	normalizeVendor,
} from "@/lib/vendor-core/types";

/**
 * Live vendor-core paths (api.vm.tillahealth.com):
 * - Most resources: GET …/list/ + POST …/create/
 * - Intake jobs, inbound files, uploads, monitoring: REST-style roots
 */
export const vendorCoreEndpoints = {
	vendorsList: "/api/v1/vendors/list/",
	vendorsCreate: "/api/v1/vendors/create/",
	vendor: (id: string) => `/api/v1/vendors/${id}/`,
	accountsList: "/api/v1/accounts/list/",
	accountsCreate: "/api/v1/accounts/create/",
	credentialsList: "/api/v1/credentials/list/",
	credentialsCreate: "/api/v1/credentials/create/",
	connectionsList: "/api/v1/connections/list/",
	connectionsCreate: "/api/v1/connections/create/",
	connection: (id: string) => `/api/v1/connections/${id}/`,
	connectionTest: (id: string) => `/api/v1/connections/${id}/test/`,
	intakeJobs: "/api/v1/intake-jobs/",
	intakeJob: (id: string) => `/api/v1/intake-jobs/${id}/`,
	intakeJobRun: (id: string) => `/api/v1/intake-jobs/${id}/run/`,
	intakeJobRunsList: "/api/v1/intake-job-runs/list/",
	memberCoveragesList: "/api/v1/member-coverages/list/",
	memberCoveragesCreate: "/api/v1/member-coverages/create/",
	memberCoveragesSeed: "/api/v1/member-coverages/seed/",
	membersList: "/api/v1/members/list/",
	membersListExportCsv: "/api/v1/members/list/export/csv/",
	membersCreate: "/api/v1/members/create/",
	member: (id: string) => `/api/v1/members/${id}/`,
	memberUpdate: (id: string) => `/api/v1/members/${id}/update/`,
	memberDelete: (id: string) => `/api/v1/members/${id}/delete/`,
	memberDetailExportCsv: (id: string) => `/api/v1/members/${id}/export/csv/`,
	memberDetailExportPdf: (id: string) => `/api/v1/members/${id}/export/pdf/`,
	memberPrint: (id: string) => `/api/v1/members/${id}/print/`,
	memberDocumentSummaryPdf: (id: string) =>
		`/api/v1/members/${id}/documents/summary/pdf/`,
	memberDocumentEligibilityLetterPdf: (id: string) =>
		`/api/v1/members/${id}/documents/eligibility-letter/pdf/`,
	memberDocumentCoverageCardPdf: (id: string) =>
		`/api/v1/members/${id}/documents/coverage-card/pdf/`,
	memberSourceRecordsList: (id: string) =>
		`/api/v1/members/${id}/source-records/list/`,
	memberSourceRecord: (id: string, rid: string) =>
		`/api/v1/members/${id}/source-records/${rid}/`,
	memberEligibilityHistoryList: (id: string) =>
		`/api/v1/members/${id}/eligibility-history/list/`,
	memberPlanHistoryList: (id: string) =>
		`/api/v1/members/${id}/plan-history/list/`,
	memberExceptionsList: (id: string) =>
		`/api/v1/members/${id}/exceptions/list/`,
	memberExceptionsCreate: (id: string) =>
		`/api/v1/members/${id}/exceptions/create/`,
	memberAccumulatorsList: (id: string) =>
		`/api/v1/members/${id}/accumulators/list/`,
	memberAccumulatorsCreate: (id: string) =>
		`/api/v1/members/${id}/accumulators/create/`,
	memberClaimsList: (id: string) => `/api/v1/members/${id}/claims/list/`,
	memberClaimsCreate: (id: string) => `/api/v1/members/${id}/claims/create/`,
	memberChangeEventsList: (id: string) =>
		`/api/v1/members/${id}/change-events/list/`,
	memberFamilyLinksList: (id: string) =>
		`/api/v1/members/${id}/family-links/list/`,
	providersList: "/api/v1/providers/list/",
	providersCreate: "/api/v1/providers/create/",
	providersStats: "/api/v1/providers/stats/",
	providersSeed: "/api/v1/providers/seed/",
	provider: (id: string) => `/api/v1/providers/${id}/`,
	providerUpdate: (id: string) => `/api/v1/providers/${id}/update/`,
	providerDelete: (id: string) => `/api/v1/providers/${id}/delete/`,
	providerRestore: (id: string) => `/api/v1/providers/${id}/restore/`,
	providerHardDelete: (id: string) => `/api/v1/providers/${id}/hard-delete/`,
	providerStatus: (id: string) => `/api/v1/providers/${id}/status/`,
	providerRostersList: "/api/v1/provider-rosters/list/",
	providerRostersCreate: "/api/v1/provider-rosters/create/",
	providerRoster: (id: string) => `/api/v1/provider-rosters/${id}/`,
	providerRosterUpdate: (id: string) =>
		`/api/v1/provider-rosters/${id}/update/`,
	providerRosterDelete: (id: string) =>
		`/api/v1/provider-rosters/${id}/delete/`,
	providerRosterRestore: (id: string) =>
		`/api/v1/provider-rosters/${id}/restore/`,
	providerRosterHardDelete: (id: string) =>
		`/api/v1/provider-rosters/${id}/hard-delete/`,
	providerRosterRecount: (id: string) =>
		`/api/v1/provider-rosters/${id}/recount/`,
	claimLinesList: "/api/v1/claim-lines/list/",
	claimLinesCreate: "/api/v1/claim-lines/create/",
	claimLinesSeed: "/api/v1/claim-lines/seed/",
	claimLine: (id: string) => `/api/v1/claim-lines/${id}/`,
	claimLineUpdate: (id: string) => `/api/v1/claim-lines/${id}/update/`,
	claimLineDelete: (id: string) => `/api/v1/claim-lines/${id}/delete/`,
	claimLineHardDelete: (id: string) => `/api/v1/claim-lines/${id}/hard-delete/`,
	claimLineRestore: (id: string) => `/api/v1/claim-lines/${id}/restore/`,
	eligibilityFilesList: "/api/v1/eligibility-files/list/",
	eligibilityFilesCreate: "/api/v1/eligibility-files/create/",
	inboundFiles: "/api/v1/inbound-files/",
	inboundFile: (id: string) => `/api/v1/inbound-files/${id}/`,
	inboundFileEvents: (id: string) => `/api/v1/inbound-files/${id}/events/`,
	inboundFileReprocess: (id: string) =>
		`/api/v1/inbound-files/${id}/reprocess/`,
	inboundFilesSeed: "/api/v1/inbound-files/seed/",
	validationResultsList: "/api/v1/validation-results/list/",
	uploads: "/api/v1/intake/uploads/",
	monitoring: "/api/v1/monitoring/",
	errorsList: "/api/v1/errors/list/",
	error: (id: string) => `/api/v1/errors/${id}/`,
	errorRetry: (id: string) => `/api/v1/errors/${id}/retry/`,
	errorResolve: (id: string) => `/api/v1/errors/${id}/resolve/`,
	routingRulesList: "/api/v1/routing-rules/list/",
	routingRulesCreate: "/api/v1/routing-rules/create/",
	auditList: "/api/v1/audit/list/",
	users: "/api/v1/users/",
	userUpdate: (id: string) => `/api/v1/users/${id}/update/`,
	userPassword: (id: string) => `/api/v1/users/${id}/password/`,
	userLoginEvents: (id: string) => `/api/v1/users/${id}/login-events/`,
	loginEvents: "/api/v1/users/login-events/",
	myLoginEvents: "/api/v1/users/me/login-events/",
	vendorUpdate: (id: string) => `/api/v1/vendors/${id}/update/`,
	vendorDelete: (id: string) => `/api/v1/vendors/${id}/delete/`,
	vendorHardDelete: (id: string) => `/api/v1/vendors/${id}/hard-delete/`,
	vendorRestore: (id: string) => `/api/v1/vendors/${id}/restore/`,
	health: "/health/",
	identityGroupsList: "/api/v1/identity-groups/list/",
	identityGroupsCreate: "/api/v1/identity-groups/create/",
	identityGroup: (id: string) => `/api/v1/identity-groups/${id}/`,
	identityGroupUpdate: (id: string) => `/api/v1/identity-groups/${id}/update/`,
	identityGroupDelete: (id: string) => `/api/v1/identity-groups/${id}/delete/`,
	identityGroupRestore: (id: string) =>
		`/api/v1/identity-groups/${id}/restore/`,
	identityGroupMembersAdd: (id: string) =>
		`/api/v1/identity-groups/${id}/members/add/`,
	identityGroupMembersRemove: (id: string) =>
		`/api/v1/identity-groups/${id}/members/remove/`,
	identityGroupMemberLinkUser: (id: string) =>
		`/api/v1/identity-groups/${id}/members/link-user/`,
	rolesList: "/api/v1/roles/list/",
	rolesCreate: "/api/v1/roles/create/",
	role: (id: string) => `/api/v1/roles/${id}/`,
	roleUpdate: (id: string) => `/api/v1/roles/${id}/update/`,
	roleDelete: (id: string) => `/api/v1/roles/${id}/delete/`,
	roleRestore: (id: string) => `/api/v1/roles/${id}/restore/`,
	roleHardDelete: (id: string) => `/api/v1/roles/${id}/hard-delete/`,
	roleUsersAssign: (id: string) => `/api/v1/roles/${id}/users/assign/`,
	roleUsersUnassign: (id: string) => `/api/v1/roles/${id}/users/unassign/`,
	settingsList: "/api/v1/settings/list/",
	settingsCreate: "/api/v1/settings/create/",
	setting: (id: string) => `/api/v1/settings/${id}/`,
	settingUpdate: (id: string) => `/api/v1/settings/${id}/update/`,
	settingDelete: (id: string) => `/api/v1/settings/${id}/delete/`,
	settingRestore: (id: string) => `/api/v1/settings/${id}/restore/`,
} as const;

function pageParams(
	extra?: Record<string, string | number | undefined | null>
) {
	// Django list endpoints reject limit > 100 ("One or more fields are invalid.")
	const merged = { limit: 100, offset: 0, ...extra };
	const limit = Number(merged.limit);
	if (!Number.isFinite(limit) || limit < 1) merged.limit = 100;
	else if (limit > 100) merged.limit = 100;
	return merged;
}

async function listAllPages<T>(
	fetchPage: (params: {
		limit: number;
		offset: number;
	}) => Promise<PaginatedResult<T>>,
	pageSize = 100
): Promise<T[]> {
	const results: T[] = [];
	let offset = 0;
	for (;;) {
		const page = await fetchPage({ limit: pageSize, offset });
		const chunk = page.results ?? [];
		results.push(...chunk);
		const count = page.count;
		offset += chunk.length;
		if (!chunk.length) break;
		if (typeof count === "number" && offset >= count) break;
		if (chunk.length < pageSize) break;
	}
	return results;
}

function mapPage<T, R>(
	page: PaginatedResult<T>,
	map: (item: T) => R
): PaginatedResult<R> {
	return {
		...page,
		results: (page.results ?? []).map(map),
	};
}

export const vendorCoreApi = {
	createVendor: (body: {
		vendor_code: string;
		legal_name: string;
		country: string;
		city: string;
		trade_name?: string;
		status?: string;
		tier?: string;
		metadata?: Record<string, unknown>;
	}) =>
		vendorCoreFetch<VendorDto>(vendorCoreEndpoints.vendorsCreate, {
			method: "POST",
			body: JSON.stringify(body),
		}).then((v) => normalizeVendor(v as unknown as Record<string, unknown>)),

	createAccount: (body: {
		vendor: string;
		account_code: string;
		name?: string;
		line_of_business?: string;
		active?: boolean;
		metadata?: Record<string, unknown>;
	}) =>
		vendorCoreFetch<AccountDto>(vendorCoreEndpoints.accountsCreate, {
			method: "POST",
			body: JSON.stringify(body),
		}).then((a) => normalizeAccount(a as unknown as Record<string, unknown>)),

	createCredential: (body: {
		name: string;
		kind: string;
		secret_ref: string;
		metadata?: Record<string, unknown>;
	}) =>
		vendorCoreFetch<CredentialDto>(vendorCoreEndpoints.credentialsCreate, {
			method: "POST",
			body: JSON.stringify(body),
		}),

	createConnection: (body: Record<string, unknown>) =>
		vendorCoreFetch<ConnectionDto>(vendorCoreEndpoints.connectionsCreate, {
			method: "POST",
			body: JSON.stringify(body),
		}).then((c) =>
			normalizeConnection(c as unknown as Record<string, unknown>)
		),

	createIntakeJob: (body: Record<string, unknown>) =>
		vendorCoreFetch<IntakeJobDto>(vendorCoreEndpoints.intakeJobs, {
			method: "POST",
			body: JSON.stringify(body),
		}).then((j) => normalizeJob(j as unknown as Record<string, unknown>)),

	createRoutingRule: (body: Record<string, unknown>) =>
		vendorCoreFetch<RoutingRuleDto>(vendorCoreEndpoints.routingRulesCreate, {
			method: "POST",
			body: JSON.stringify(body),
		}),

	listVendors: async (params?: { status?: string; search?: string }) => {
		const results = await listAllPages(async ({ limit, offset }) => {
			const page = await vendorCoreFetch<
				PaginatedResult<Record<string, unknown>>
			>(vendorCoreEndpoints.vendorsList, {
				params: pageParams({ ...params, limit, offset }),
			});
			return mapPage(page, normalizeVendor);
		});
		return {
			limit: results.length,
			offset: 0,
			count: results.length,
			next: null,
			previous: null,
			results,
		} satisfies PaginatedResult<VendorDto>;
	},

	getVendor: async (id: string) => {
		const raw = await vendorCoreFetch<Record<string, unknown>>(
			vendorCoreEndpoints.vendor(id)
		);
		return normalizeVendor(raw);
	},

	listAccounts: async (params?: { vendor_id?: string }) => {
		const results = await listAllPages(async ({ limit, offset }) => {
			const page = await vendorCoreFetch<
				PaginatedResult<Record<string, unknown>>
			>(vendorCoreEndpoints.accountsList, {
				params: pageParams({ ...params, limit, offset }),
			});
			return mapPage(page, normalizeAccount);
		});
		return {
			limit: results.length,
			offset: 0,
			count: results.length,
			next: null,
			previous: null,
			results,
		} satisfies PaginatedResult<AccountDto>;
	},

	listCredentials: async () => {
		const results = await listAllPages(async ({ limit, offset }) => {
			const page = await vendorCoreFetch<
				PaginatedResult<Record<string, unknown>>
			>(vendorCoreEndpoints.credentialsList, {
				params: pageParams({ limit, offset }),
			});
			return mapPage(page, (raw) => raw as unknown as CredentialDto);
		});
		return {
			limit: results.length,
			offset: 0,
			count: results.length,
			next: null,
			previous: null,
			results,
		} satisfies PaginatedResult<CredentialDto>;
	},

	listEligibilityFiles: async () => {
		const results = await listAllPages(async ({ limit, offset }) => {
			const page = await vendorCoreFetch<
				PaginatedResult<Record<string, unknown>>
			>(vendorCoreEndpoints.eligibilityFilesList, {
				params: pageParams({ limit, offset }),
			});
			return mapPage(page, normalizeEligibilityFile);
		});
		return {
			limit: results.length,
			offset: 0,
			count: results.length,
			next: null,
			previous: null,
			results,
		} satisfies PaginatedResult<EligibilityFileDto>;
	},

	createEligibilityFile: (body: {
		vendor_id?: string;
		original_filename?: string;
		received_at?: string;
		member_count?: number;
	}) =>
		vendorCoreFetch<Record<string, unknown>>(
			vendorCoreEndpoints.eligibilityFilesCreate,
			{ method: "POST", body: JSON.stringify(body) }
		).then(normalizeEligibilityFile),

	listConnections: async (params?: {
		method?: string;
		status?: string;
		vendor_id?: string;
	}) => {
		const results = await listAllPages(async ({ limit, offset }) => {
			const page = await vendorCoreFetch<
				PaginatedResult<Record<string, unknown>>
			>(vendorCoreEndpoints.connectionsList, {
				params: pageParams({ ...params, limit, offset }),
			});
			return mapPage(page, normalizeConnection);
		});
		return {
			limit: results.length,
			offset: 0,
			count: results.length,
			next: null,
			previous: null,
			results,
		} satisfies PaginatedResult<ConnectionDto>;
	},

	testConnection: (id: string) =>
		vendorCoreFetch<Record<string, unknown>>(
			vendorCoreEndpoints.connectionTest(id),
			{ method: "POST" }
		),

	listIntakeJobs: async (params?: { status?: string; vendor_id?: string }) => {
		// Intake jobs clamp page size (~50); page through until exhausted.
		const results = await listAllPages(async ({ limit, offset }) => {
			const page = await vendorCoreFetch<
				PaginatedResult<Record<string, unknown>>
			>(vendorCoreEndpoints.intakeJobs, {
				params: pageParams({ ...params, limit, offset }),
			});
			return mapPage(page, normalizeJob);
		}, 50);
		return {
			limit: results.length,
			offset: 0,
			count: results.length,
			next: null,
			previous: null,
			results,
		} satisfies PaginatedResult<IntakeJobDto>;
	},

	getIntakeJob: async (id: string) => {
		const raw = await vendorCoreFetch<Record<string, unknown>>(
			vendorCoreEndpoints.intakeJob(id)
		);
		return normalizeJob(raw);
	},

	updateIntakeJob: (id: string, body: Record<string, unknown>) =>
		vendorCoreFetch<IntakeJobDto>(vendorCoreEndpoints.intakeJob(id), {
			method: "PATCH",
			body: JSON.stringify(body),
		}).then((j) => normalizeJob(j as unknown as Record<string, unknown>)),

	runIntakeJob: (id: string) =>
		vendorCoreFetch<{ task_id: string; job_id: string }>(
			vendorCoreEndpoints.intakeJobRun(id),
			{ method: "POST" }
		),

	listIntakeJobRuns: async (params?: {
		job_id?: string;
		stage?: string;
		limit?: number;
		offset?: number;
	}) => {
		// Runs grow quickly; return one page (UI can filter / refresh).
		const page = await vendorCoreFetch<
			PaginatedResult<Record<string, unknown>>
		>(vendorCoreEndpoints.intakeJobRunsList, {
			params: pageParams({
				job_id: params?.job_id,
				stage: params?.stage,
				limit: params?.limit ?? 100,
				offset: params?.offset ?? 0,
			}),
		});
		return mapPage(page, normalizeJobRun);
	},

	listMemberCoverages: async (params?: { search?: string }) => {
		const results = await listAllPages(async ({ limit, offset }) => {
			const page = await vendorCoreFetch<
				PaginatedResult<Record<string, unknown>>
			>(vendorCoreEndpoints.memberCoveragesList, {
				params: pageParams({ ...params, limit, offset }),
			});
			return mapPage(page, normalizeMemberCoverage);
		});
		return {
			limit: results.length,
			offset: 0,
			count: results.length,
			next: null,
			previous: null,
			results,
		} satisfies PaginatedResult<MemberCoverageDto>;
	},

	/** Single page — use for directory pagination. */
	listMembersPage: async (params?: MemberListQuery) => {
		const page = await vendorCoreFetch<PaginatedResult<MemberListDto>>(
			vendorCoreEndpoints.membersList,
			{
				params: pageParams({
					...params,
					limit: params?.limit ?? 50,
					offset: params?.offset ?? 0,
				}),
			}
		);
		return {
			...page,
			results: (page.results ?? []).map((row) => ({
				...row,
				id: String(row.id),
			})),
		} satisfies PaginatedResult<MemberListDto>;
	},

	/** All pages (ops / fallback). Prefer `listMembersPage` for UI tables. */
	listMembers: async (params?: MemberListQuery) => {
		const { limit: _l, offset: _o, ...filters } = params ?? {};
		const results = await listAllPages(async ({ limit, offset }) => {
			const page = await vendorCoreFetch<PaginatedResult<MemberListDto>>(
				vendorCoreEndpoints.membersList,
				{
					params: pageParams({ ...filters, limit, offset }),
				}
			);
			return {
				...page,
				results: (page.results ?? []).map((row) => ({
					...row,
					id: String(row.id),
				})),
			};
		}, 50);
		return {
			limit: results.length,
			offset: 0,
			count: results.length,
			next: null,
			previous: null,
			results,
		} satisfies PaginatedResult<MemberListDto>;
	},

	getMember: (id: string) =>
		vendorCoreFetch<MemberDetailDto>(vendorCoreEndpoints.member(id)),

	listMemberSourceRecords: async (
		memberId: string,
		params?: { record_status?: string }
	) => {
		const page = await vendorCoreFetch<
			PaginatedResult<Record<string, unknown>>
		>(vendorCoreEndpoints.memberSourceRecordsList(memberId), {
			params: pageParams(params),
		});
		return page;
	},

	getMemberSourceRecord: (memberId: string, recordId: string) =>
		vendorCoreFetch<Record<string, unknown>>(
			vendorCoreEndpoints.memberSourceRecord(memberId, recordId)
		),

	listMemberEligibilityHistory: (memberId: string) =>
		vendorCoreFetch<PaginatedResult<Record<string, unknown>>>(
			vendorCoreEndpoints.memberEligibilityHistoryList(memberId),
			{ params: pageParams() }
		),

	listMemberPlanHistory: (memberId: string) =>
		vendorCoreFetch<PaginatedResult<Record<string, unknown>>>(
			vendorCoreEndpoints.memberPlanHistoryList(memberId),
			{ params: pageParams() }
		),

	listMemberExceptions: (memberId: string) =>
		vendorCoreFetch<PaginatedResult<Record<string, unknown>>>(
			vendorCoreEndpoints.memberExceptionsList(memberId),
			{ params: pageParams() }
		),

	createMemberException: (memberId: string, body: Record<string, unknown>) =>
		vendorCoreFetch<Record<string, unknown>>(
			vendorCoreEndpoints.memberExceptionsCreate(memberId),
			{ method: "POST", body: JSON.stringify(body) }
		),

	listMemberAccumulators: (memberId: string) =>
		vendorCoreFetch<PaginatedResult<Record<string, unknown>>>(
			vendorCoreEndpoints.memberAccumulatorsList(memberId),
			{ params: pageParams() }
		),

	createMemberAccumulator: (memberId: string, body: Record<string, unknown>) =>
		vendorCoreFetch<Record<string, unknown>>(
			vendorCoreEndpoints.memberAccumulatorsCreate(memberId),
			{ method: "POST", body: JSON.stringify(body) }
		),

	listMemberClaims: (memberId: string, params?: { claim_kind?: string }) =>
		vendorCoreFetch<PaginatedResult<Record<string, unknown>>>(
			vendorCoreEndpoints.memberClaimsList(memberId),
			{ params: pageParams(params) }
		),

	createMemberClaim: (memberId: string, body: Record<string, unknown>) =>
		vendorCoreFetch<Record<string, unknown>>(
			vendorCoreEndpoints.memberClaimsCreate(memberId),
			{ method: "POST", body: JSON.stringify(body) }
		),

	listMemberChangeEvents: (memberId: string) =>
		vendorCoreFetch<PaginatedResult<Record<string, unknown>>>(
			vendorCoreEndpoints.memberChangeEventsList(memberId),
			{ params: pageParams() }
		),

	listMemberFamilyLinks: (memberId: string) =>
		vendorCoreFetch<PaginatedResult<Record<string, unknown>>>(
			vendorCoreEndpoints.memberFamilyLinksList(memberId),
			{ params: pageParams() }
		),

	exportMemberListCsv: (params?: MemberListQuery) => {
		const { limit: _l, offset: _o, ...filters } = params ?? {};
		return vendorCoreFetchBlob(vendorCoreEndpoints.membersListExportCsv, {
			params: filters,
		});
	},

	exportMemberDetailCsv: (memberId: string) =>
		vendorCoreFetchBlob(vendorCoreEndpoints.memberDetailExportCsv(memberId)),

	exportMemberDetailPdf: (
		memberId: string,
		params?: { variant?: "full" | "summary" }
	) =>
		vendorCoreFetchBlob(vendorCoreEndpoints.memberDetailExportPdf(memberId), {
			params,
		}),

	exportMemberPrintHtml: (memberId: string) =>
		vendorCoreFetchBlob(vendorCoreEndpoints.memberPrint(memberId)),

	exportMemberDocumentPdf: (
		memberId: string,
		document: "summary" | "eligibility-letter" | "coverage-card"
	) => {
		const path =
			document === "summary"
				? vendorCoreEndpoints.memberDocumentSummaryPdf(memberId)
				: document === "eligibility-letter"
					? vendorCoreEndpoints.memberDocumentEligibilityLetterPdf(memberId)
					: vendorCoreEndpoints.memberDocumentCoverageCardPdf(memberId);
		return vendorCoreFetchBlob(path);
	},

	createMemberCoverage: (body: {
		eligibility_file_id: string;
		subscriber_id: string;
		group_or_policy_number?: string;
		member_first_name?: string;
		member_last_name?: string;
		maintenance_type_code?: string;
		raw_object_id?: string;
	}) =>
		vendorCoreFetch<MemberCoverageDto>(
			vendorCoreEndpoints.memberCoveragesCreate,
			{ method: "POST", body: JSON.stringify(body) }
		).then((row) =>
			normalizeMemberCoverage(row as unknown as Record<string, unknown>)
		),

	seedMemberCoverages: (body?: { vendor_id?: string; count?: number }) =>
		vendorCoreFetch<{
			created: number;
			skipped?: boolean;
			existing?: number;
			eligibility_file_id?: string | null;
		}>(vendorCoreEndpoints.memberCoveragesSeed, {
			method: "POST",
			body: JSON.stringify(body ?? {}),
		}),

	listInboundFiles: async (params?: {
		stage?: string;
		vendor_id?: string;
		search?: string;
	}) => {
		const results = await listAllPages(async ({ limit, offset }) => {
			const page = await vendorCoreFetch<
				PaginatedResult<Record<string, unknown>>
			>(vendorCoreEndpoints.inboundFiles, {
				params: pageParams({ ...params, limit, offset }),
			});
			return mapPage(page, normalizeInboundFile);
		}, 50);
		return {
			limit: results.length,
			offset: 0,
			count: results.length,
			next: null,
			previous: null,
			results,
		} satisfies PaginatedResult<InboundFileDto>;
	},

	getInboundFile: async (id: string) => {
		const raw = await vendorCoreFetch<Record<string, unknown>>(
			vendorCoreEndpoints.inboundFile(id)
		);
		return normalizeInboundFile(raw);
	},

	reprocessInboundFile: (id: string) =>
		vendorCoreFetch<
			{ task_id?: string; id?: string } | Record<string, unknown>
		>(vendorCoreEndpoints.inboundFileReprocess(id), { method: "POST" }),

	seedInboundProcessing: (body?: { vendor_id?: string; force?: boolean }) =>
		vendorCoreFetch<{
			created: number;
			skipped?: boolean;
			existing_inbound_files?: number;
			inbound_file_ids?: string[];
		}>(vendorCoreEndpoints.inboundFilesSeed, {
			method: "POST",
			body: JSON.stringify(body ?? {}),
		}),

	listInboundFileEvents: async (inboundFileId: string) => {
		const data = await vendorCoreFetch<
			PaginatedResult<Record<string, unknown>> | Record<string, unknown>[]
		>(vendorCoreEndpoints.inboundFileEvents(inboundFileId));

		const rows = Array.isArray(data)
			? data
			: ((data as PaginatedResult<Record<string, unknown>>).results ?? []);
		return rows.map((row) => normalizeProcessingEvent(row));
	},

	listValidationResults: async (params?: {
		inbound_file_id?: string;
		search?: string;
	}) => {
		const results = await listAllPages(async ({ limit, offset }) => {
			const page = await vendorCoreFetch<
				PaginatedResult<Record<string, unknown>>
			>(vendorCoreEndpoints.validationResultsList, {
				params: pageParams({ ...params, limit, offset }),
			});
			return mapPage(page, normalizeValidationResult);
		});
		return {
			limit: results.length,
			offset: 0,
			count: results.length,
			next: null,
			previous: null,
			results,
		} satisfies PaginatedResult<ValidationResultDto>;
	},

	uploadInboundFile: async (input: {
		file: File;
		connection_id?: string;
		job_id?: string;
	}) => {
		const form = new FormData();
		form.append("file", input.file);
		if (input.connection_id) form.append("connection_id", input.connection_id);
		if (input.job_id) form.append("job_id", input.job_id);
		const raw = await vendorCoreFetch<Record<string, unknown>>(
			vendorCoreEndpoints.uploads,
			{
				method: "POST",
				body: form,
				headers: {}, // let browser set multipart boundary
			}
		);
		return normalizeInboundFile(raw);
	},

	getMonitoring: () =>
		vendorCoreFetch<MonitoringDashboardDto>(vendorCoreEndpoints.monitoring),

	listErrors: async (params?: { status?: string; category?: string }) => {
		const results = await listAllPages(async ({ limit, offset }) => {
			const page = await vendorCoreFetch<
				PaginatedResult<Record<string, unknown>>
			>(vendorCoreEndpoints.errorsList, {
				params: pageParams({ ...params, limit, offset }),
			});
			return mapPage(page, normalizeErrorRecord);
		});
		return {
			limit: results.length,
			offset: 0,
			count: results.length,
			next: null,
			previous: null,
			results,
		} satisfies PaginatedResult<ErrorRecordDto>;
	},

	getError: (id: string) =>
		vendorCoreFetch<Record<string, unknown>>(
			vendorCoreEndpoints.error(id)
		).then((row) => normalizeErrorRecord(row)),

	retryError: (id: string) =>
		vendorCoreFetch<Record<string, unknown>>(
			vendorCoreEndpoints.errorRetry(id),
			{
				method: "POST",
			}
		).then((row) => normalizeErrorRecord(row)),

	resolveError: (id: string, resolution_notes?: string) =>
		vendorCoreFetch<Record<string, unknown>>(
			vendorCoreEndpoints.errorResolve(id),
			{
				method: "POST",
				body: JSON.stringify({ resolution_notes: resolution_notes ?? "" }),
			}
		).then((row) => normalizeErrorRecord(row)),

	listProviders: async (params?: ProviderListQuery) => {
		const results = await listAllPages(async ({ limit, offset }) => {
			const page = await vendorCoreFetch<
				PaginatedResult<Record<string, unknown>>
			>(vendorCoreEndpoints.providersList, {
				params: pageParams({
					...params,
					limit,
					offset,
					is_visible:
						params?.is_visible === undefined
							? undefined
							: params.is_visible
								? "true"
								: "false",
					is_deleted:
						params?.is_deleted === undefined
							? undefined
							: params.is_deleted
								? "true"
								: "false",
				}),
			});
			return mapPage(page, normalizeProvider);
		});
		return {
			limit: results.length,
			offset: 0,
			count: results.length,
			next: null,
			previous: null,
			results,
		} satisfies PaginatedResult<ProviderDto>;
	},

	getProvider: async (id: string) => {
		const raw = await vendorCoreFetch<Record<string, unknown>>(
			vendorCoreEndpoints.provider(id)
		);
		return normalizeProvider(raw);
	},

	/** Single page — use for npi lookup / directory pagination. */
	listProvidersPage: async (params?: ProviderListQuery) => {
		const page = await vendorCoreFetch<
			PaginatedResult<Record<string, unknown>>
		>(vendorCoreEndpoints.providersList, {
			params: pageParams({
				...params,
				limit: params?.limit ?? 50,
				offset: params?.offset ?? 0,
				is_visible:
					params?.is_visible === undefined
						? undefined
						: params.is_visible
							? "true"
							: "false",
				is_deleted:
					params?.is_deleted === undefined
						? undefined
						: params.is_deleted
							? "true"
							: "false",
			}),
		});
		return mapPage(page, normalizeProvider);
	},

	getProviderDashboardStats: async (params?: ProviderDashboardStatsQuery) => {
		const raw = await vendorCoreFetch<ProviderDashboardStatsDto>(
			vendorCoreEndpoints.providersStats,
			{
				params: pageParams({
					program: params?.program || undefined,
					vendor_id: params?.vendor_id || undefined,
					roster_file_id: params?.roster_file_id || undefined,
				}),
			}
		);
		return {
			total: Number(raw.total ?? 0),
			active: Number(raw.active ?? 0),
			pending: Number(raw.pending ?? 0),
			termed: Number(raw.termed ?? 0),
			inactive: Number(raw.inactive ?? 0),
			program: raw.program ?? "",
			vendor_id: raw.vendor_id ?? null,
			roster_file_id: raw.roster_file_id ?? null,
		} satisfies ProviderDashboardStatsDto;
	},

	createProvider: (body: ProviderCreateInput) =>
		vendorCoreFetch<ProviderDto>(vendorCoreEndpoints.providersCreate, {
			method: "POST",
			body: JSON.stringify(body),
		}).then((row) =>
			normalizeProvider(row as unknown as Record<string, unknown>)
		),

	updateProvider: (id: string, body: ProviderUpdateInput) =>
		vendorCoreFetch<ProviderDto>(vendorCoreEndpoints.providerUpdate(id), {
			method: "PATCH",
			body: JSON.stringify(body),
		}).then((row) =>
			normalizeProvider(row as unknown as Record<string, unknown>)
		),

	deleteProvider: (id: string) =>
		vendorCoreFetch<void>(vendorCoreEndpoints.providerDelete(id), {
			method: "DELETE",
		}),

	restoreProvider: (id: string) =>
		vendorCoreFetch<ProviderDto>(vendorCoreEndpoints.providerRestore(id), {
			method: "POST",
		}).then((row) =>
			normalizeProvider(row as unknown as Record<string, unknown>)
		),

	setProviderStatus: (id: string, body: ProviderStatusInput) =>
		vendorCoreFetch<ProviderDto>(vendorCoreEndpoints.providerStatus(id), {
			method: "POST",
			body: JSON.stringify(body),
		}).then((row) =>
			normalizeProvider(row as unknown as Record<string, unknown>)
		),

	listProviderRosters: async (params?: ProviderRosterListQuery) => {
		const results = await listAllPages(async ({ limit, offset }) => {
			const page = await vendorCoreFetch<
				PaginatedResult<Record<string, unknown>>
			>(vendorCoreEndpoints.providerRostersList, {
				params: pageParams({
					...params,
					limit,
					offset,
					is_visible:
						params?.is_visible === undefined
							? undefined
							: params.is_visible
								? "true"
								: "false",
					is_deleted:
						params?.is_deleted === undefined
							? undefined
							: params.is_deleted
								? "true"
								: "false",
				}),
			});
			return mapPage(page, normalizeProviderRoster);
		});
		return {
			limit: results.length,
			offset: 0,
			count: results.length,
			next: null,
			previous: null,
			results,
		} satisfies PaginatedResult<ProviderRosterDto>;
	},

	getProviderRoster: async (id: string) => {
		const raw = await vendorCoreFetch<Record<string, unknown>>(
			vendorCoreEndpoints.providerRoster(id)
		);
		return normalizeProviderRoster(raw);
	},

	createProviderRoster: (body: ProviderRosterCreateInput) =>
		vendorCoreFetch<ProviderRosterDto>(
			vendorCoreEndpoints.providerRostersCreate,
			{
				method: "POST",
				body: JSON.stringify(body),
			}
		).then((row) =>
			normalizeProviderRoster(row as unknown as Record<string, unknown>)
		),

	updateProviderRoster: (id: string, body: ProviderRosterUpdateInput) =>
		vendorCoreFetch<ProviderRosterDto>(
			vendorCoreEndpoints.providerRosterUpdate(id),
			{
				method: "PATCH",
				body: JSON.stringify(body),
			}
		).then((row) =>
			normalizeProviderRoster(row as unknown as Record<string, unknown>)
		),

	deleteProviderRoster: (id: string) =>
		vendorCoreFetch<void>(vendorCoreEndpoints.providerRosterDelete(id), {
			method: "DELETE",
		}),

	restoreProviderRoster: (id: string) =>
		vendorCoreFetch<ProviderRosterDto>(
			vendorCoreEndpoints.providerRosterRestore(id),
			{ method: "POST" }
		).then((row) =>
			normalizeProviderRoster(row as unknown as Record<string, unknown>)
		),

	recountProviderRoster: (id: string) =>
		vendorCoreFetch<ProviderRosterDto>(
			vendorCoreEndpoints.providerRosterRecount(id),
			{ method: "POST" }
		).then((row) =>
			normalizeProviderRoster(row as unknown as Record<string, unknown>)
		),

	seedProviders: (body?: {
		vendor_id?: string;
		count?: number;
		force?: boolean;
	}) =>
		vendorCoreFetch<{
			created: number;
			skipped?: boolean;
			existing_providers?: number;
			roster_file_id?: string | null;
			provider_ids?: string[];
		}>(vendorCoreEndpoints.providersSeed, {
			method: "POST",
			body: JSON.stringify(body ?? {}),
		}),

	listClaimLines: async () => {
		const results = await listAllPages(async ({ limit, offset }) => {
			const page = await vendorCoreFetch<
				PaginatedResult<Record<string, unknown>>
			>(vendorCoreEndpoints.claimLinesList, {
				params: pageParams({ limit, offset }),
			});
			return mapPage(page, normalizeClaimLine);
		});
		return {
			limit: results.length,
			offset: 0,
			count: results.length,
			next: null,
			previous: null,
			results,
		} satisfies PaginatedResult<ClaimLineDto>;
	},

	getClaimLine: (id: string) =>
		vendorCoreFetch<Record<string, unknown>>(
			vendorCoreEndpoints.claimLine(id)
		).then((row) => normalizeClaimLine(row)),

	createClaimLine: (body: Record<string, unknown>) =>
		vendorCoreFetch<Record<string, unknown>>(
			vendorCoreEndpoints.claimLinesCreate,
			{
				method: "POST",
				body: JSON.stringify(body),
			}
		).then((row) => normalizeClaimLine(row)),

	updateClaimLine: (id: string, body: Record<string, unknown>) =>
		vendorCoreFetch<Record<string, unknown>>(
			vendorCoreEndpoints.claimLineUpdate(id),
			{
				method: "PATCH",
				body: JSON.stringify(body),
			}
		).then((row) => normalizeClaimLine(row)),

	deleteClaimLine: (id: string) =>
		vendorCoreFetch<{ id: string }>(vendorCoreEndpoints.claimLineDelete(id), {
			method: "DELETE",
		}),

	hardDeleteClaimLine: (id: string) =>
		vendorCoreFetch<{ id: string }>(
			vendorCoreEndpoints.claimLineHardDelete(id),
			{
				method: "DELETE",
			}
		),

	restoreClaimLine: (id: string) =>
		vendorCoreFetch<Record<string, unknown>>(
			vendorCoreEndpoints.claimLineRestore(id),
			{ method: "POST" }
		).then((row) => normalizeClaimLine(row)),

	seedClaimLines: (body?: { vendor_id?: string; force?: boolean }) =>
		vendorCoreFetch<{
			created: number;
			skipped?: boolean;
			existing_claim_lines?: number;
			batch_id?: string | null;
			claim_line_ids?: string[];
		}>(vendorCoreEndpoints.claimLinesSeed, {
			method: "POST",
			body: JSON.stringify(body ?? {}),
		}),

	listRoutingRules: () =>
		vendorCoreFetch<PaginatedResult<RoutingRuleDto>>(
			vendorCoreEndpoints.routingRulesList,
			{ params: pageParams() }
		),

	listAudit: (params?: { resource_type?: string; action?: string }) =>
		vendorCoreFetch<PaginatedResult<AuditRecordDto>>(
			vendorCoreEndpoints.auditList,
			{ params: pageParams(params) }
		),

	updateVendor: (id: string, body: Record<string, unknown>) =>
		vendorCoreFetch<VendorDto>(vendorCoreEndpoints.vendorUpdate(id), {
			method: "PATCH",
			body: JSON.stringify(body),
		}).then((v) => normalizeVendor(v as unknown as Record<string, unknown>)),

	deleteVendor: (id: string) =>
		vendorCoreFetch<unknown>(vendorCoreEndpoints.vendorDelete(id), {
			method: "DELETE",
		}),

	hardDeleteVendor: (id: string) =>
		vendorCoreFetch<unknown>(vendorCoreEndpoints.vendorHardDelete(id), {
			method: "DELETE",
		}),

	restoreVendor: (id: string) =>
		vendorCoreFetch<VendorDto>(vendorCoreEndpoints.vendorRestore(id), {
			method: "POST",
		}).then((v) => normalizeVendor(v as unknown as Record<string, unknown>)),

	listUsers: async (params?: { search?: string }) => {
		const results = await listAllPages(async ({ limit, offset }) =>
			vendorCoreFetch<PaginatedResult<CoreUserDto>>(vendorCoreEndpoints.users, {
				params: pageParams({ ...params, limit, offset }),
			})
		);
		return {
			limit: results.length,
			offset: 0,
			count: results.length,
			next: null,
			previous: null,
			results,
		} satisfies PaginatedResult<CoreUserDto>;
	},

	updateUser: (id: string, body: Record<string, unknown>) =>
		vendorCoreFetch<CoreUserDto>(vendorCoreEndpoints.userUpdate(id), {
			method: "PATCH",
			body: JSON.stringify(body),
		}),

	listLoginEvents: async (params?: { username?: string }) => {
		const results = await listAllPages(async ({ limit, offset }) =>
			vendorCoreFetch<PaginatedResult<LoginEventDto>>(
				vendorCoreEndpoints.loginEvents,
				{ params: pageParams({ ...params, limit, offset }) }
			)
		);
		return {
			limit: results.length,
			offset: 0,
			count: results.length,
			next: null,
			previous: null,
			results,
		} satisfies PaginatedResult<LoginEventDto>;
	},

	listUserLoginEvents: async (userId: string) => {
		const results = await listAllPages(async ({ limit, offset }) =>
			vendorCoreFetch<PaginatedResult<LoginEventDto>>(
				vendorCoreEndpoints.userLoginEvents(userId),
				{ params: pageParams({ limit, offset }) }
			)
		);
		return {
			limit: results.length,
			offset: 0,
			count: results.length,
			next: null,
			previous: null,
			results,
		} satisfies PaginatedResult<LoginEventDto>;
	},

	listMyLoginEvents: async () => {
		const results = await listAllPages(async ({ limit, offset }) =>
			vendorCoreFetch<PaginatedResult<LoginEventDto>>(
				vendorCoreEndpoints.myLoginEvents,
				{ params: pageParams({ limit, offset }) }
			)
		);
		return {
			limit: results.length,
			offset: 0,
			count: results.length,
			next: null,
			previous: null,
			results,
		} satisfies PaginatedResult<LoginEventDto>;
	},

	listIdentityGroups: async (params?: IdentityGroupListQuery) => {
		const page = await vendorCoreFetch<PaginatedResult<IdentityGroupDto>>(
			vendorCoreEndpoints.identityGroupsList,
			{
				params: pageParams({
					search: params?.search,
					limit: params?.limit,
					offset: params?.offset,
					is_active:
						params?.is_active === undefined
							? undefined
							: params.is_active
								? "true"
								: "false",
				}),
			}
		);
		return page;
	},

	listAllIdentityGroups: async (
		params?: Omit<IdentityGroupListQuery, "limit" | "offset">
	) => {
		const results = await listAllPages(async ({ limit, offset }) =>
			vendorCoreFetch<PaginatedResult<IdentityGroupDto>>(
				vendorCoreEndpoints.identityGroupsList,
				{
					params: pageParams({
						search: params?.search,
						is_active:
							params?.is_active === undefined
								? undefined
								: params.is_active
									? "true"
									: "false",
						limit,
						offset,
					}),
				}
			)
		);
		return {
			limit: results.length,
			offset: 0,
			count: results.length,
			next: null,
			previous: null,
			results,
		} satisfies PaginatedResult<IdentityGroupDto>;
	},

	getIdentityGroup: (id: string) =>
		vendorCoreFetch<IdentityGroupDto>(vendorCoreEndpoints.identityGroup(id)),

	createIdentityGroup: (body: IdentityGroupCreateInput) =>
		vendorCoreFetch<IdentityGroupDto>(
			vendorCoreEndpoints.identityGroupsCreate,
			{
				method: "POST",
				body: JSON.stringify(body),
			}
		),

	updateIdentityGroup: (id: string, body: IdentityGroupUpdateInput) =>
		vendorCoreFetch<IdentityGroupDto>(
			vendorCoreEndpoints.identityGroupUpdate(id),
			{
				method: "PATCH",
				body: JSON.stringify(body),
			}
		),

	deleteIdentityGroup: (id: string) =>
		vendorCoreFetch<void>(vendorCoreEndpoints.identityGroupDelete(id), {
			method: "DELETE",
		}),

	restoreIdentityGroup: (id: string) =>
		vendorCoreFetch<IdentityGroupDto>(
			vendorCoreEndpoints.identityGroupRestore(id),
			{ method: "POST" }
		),

	addIdentityGroupMembers: (
		id: string,
		members: IdentityGroupCreateInput["members"]
	) =>
		vendorCoreFetch<IdentityGroupDto>(
			vendorCoreEndpoints.identityGroupMembersAdd(id),
			{
				method: "POST",
				body: JSON.stringify({ members }),
			}
		),

	removeIdentityGroupMembers: (
		id: string,
		body: { member_ids?: string[]; external_ids?: string[] }
	) =>
		vendorCoreFetch<IdentityGroupDto>(
			vendorCoreEndpoints.identityGroupMembersRemove(id),
			{
				method: "POST",
				body: JSON.stringify(body),
			}
		),

	linkIdentityGroupMemberUser: (
		id: string,
		body: { member_id: string; user_id: string }
	) =>
		vendorCoreFetch<IdentityGroupDto>(
			vendorCoreEndpoints.identityGroupMemberLinkUser(id),
			{
				method: "POST",
				body: JSON.stringify(body),
			}
		),

	listRoles: async (params?: RoleListQuery) =>
		vendorCoreFetch<PaginatedResult<RoleDto>>(vendorCoreEndpoints.rolesList, {
			params: pageParams(params),
		}),

	listAllRoles: async () => {
		const results = await listAllPages(async ({ limit, offset }) =>
			vendorCoreFetch<PaginatedResult<RoleDto>>(vendorCoreEndpoints.rolesList, {
				params: pageParams({ limit, offset }),
			})
		);
		return {
			limit: results.length,
			offset: 0,
			count: results.length,
			next: null,
			previous: null,
			results,
		} satisfies PaginatedResult<RoleDto>;
	},

	getRole: (id: string) =>
		vendorCoreFetch<RoleDto>(vendorCoreEndpoints.role(id)),

	createRole: (body: RoleCreateInput) =>
		vendorCoreFetch<RoleDto>(vendorCoreEndpoints.rolesCreate, {
			method: "POST",
			body: JSON.stringify(body),
		}),

	updateRole: (id: string, body: RoleUpdateInput) =>
		vendorCoreFetch<RoleDto>(vendorCoreEndpoints.roleUpdate(id), {
			method: "PATCH",
			body: JSON.stringify(body),
		}),

	deleteRole: (id: string) =>
		vendorCoreFetch<void>(vendorCoreEndpoints.roleDelete(id), {
			method: "DELETE",
		}),

	restoreRole: (id: string) =>
		vendorCoreFetch<RoleDto>(vendorCoreEndpoints.roleRestore(id), {
			method: "POST",
		}),

	assignRoleUsers: (id: string, user_ids: string[]) =>
		vendorCoreFetch<RoleDto>(vendorCoreEndpoints.roleUsersAssign(id), {
			method: "POST",
			body: JSON.stringify({ user_ids }),
		}),

	unassignRoleUsers: (id: string, user_ids: string[]) =>
		vendorCoreFetch<RoleDto>(vendorCoreEndpoints.roleUsersUnassign(id), {
			method: "POST",
			body: JSON.stringify({ user_ids }),
		}),

	listAppSettings: async (params?: AppSettingListQuery) =>
		vendorCoreFetch<PaginatedResult<AppSettingDto>>(
			vendorCoreEndpoints.settingsList,
			{ params: pageParams(params) }
		),

	listAllAppSettings: async () => {
		const results = await listAllPages(async ({ limit, offset }) =>
			vendorCoreFetch<PaginatedResult<AppSettingDto>>(
				vendorCoreEndpoints.settingsList,
				{ params: pageParams({ limit, offset }) }
			)
		);
		return {
			limit: results.length,
			offset: 0,
			count: results.length,
			next: null,
			previous: null,
			results,
		} satisfies PaginatedResult<AppSettingDto>;
	},

	getAppSetting: (id: string) =>
		vendorCoreFetch<AppSettingDto>(vendorCoreEndpoints.setting(id)),

	createAppSetting: (body: AppSettingCreateInput) =>
		vendorCoreFetch<AppSettingDto>(vendorCoreEndpoints.settingsCreate, {
			method: "POST",
			body: JSON.stringify(body),
		}),

	updateAppSetting: (id: string, body: AppSettingUpdateInput) =>
		vendorCoreFetch<AppSettingDto>(vendorCoreEndpoints.settingUpdate(id), {
			method: "PATCH",
			body: JSON.stringify(body),
		}),

	deleteAppSetting: (id: string) =>
		vendorCoreFetch<void>(vendorCoreEndpoints.settingDelete(id), {
			method: "DELETE",
		}),

	restoreAppSetting: (id: string) =>
		vendorCoreFetch<AppSettingDto>(vendorCoreEndpoints.settingRestore(id), {
			method: "POST",
		}),
};
