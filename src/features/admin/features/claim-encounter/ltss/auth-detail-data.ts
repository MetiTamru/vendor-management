import type { AuthorizationRow } from "./feature/types/ltssModel";
import { LTSS_AUTHORIZATIONS } from "./feature/types/ltssModel";

export type AuthDetail = {
	id: string;
	authNumber: string;
	member: {
		name: string;
		memberId: string;
		plan: string;
		eligibility: "Eligible" | "Pending" | "Ineligible";
	};
	authorization: {
		type: string;
		status: AuthorizationRow["status"] | "ACTIVE";
		period: string;
		approvedOn: string;
		lastUpdated: string;
		authorizedBy: string;
		notes: string;
	};
	service: {
		name: string;
		code: string;
		modifiers: string;
		frequency: string;
		placeOfService: string;
	};
	utilization: {
		authorizedUnits: number;
		usedUnits: number;
		remainingUnits: number;
		utilizationPct: number;
		unitType: string;
		unitLimitPerDay: number;
		overLimitUnits: number;
	};
	provider: {
		name: string;
		npi: string;
		tin: string;
	};
	vendor: {
		name: string;
		vendorId: string;
		submissionMethod: string;
	};
	encounters: {
		id: string;
		serviceDate: string;
		units: number;
		provider: string;
		claimNumber: string;
		source: string;
		status: "Accepted" | "Pending" | "Rejected";
	}[];
	encounterTotal: number;
	exceptions: {
		ok: boolean;
		label: string;
	}[];
	warningCount: number;
	submissions: {
		date: string;
		period: string;
		fileName: string;
		records: number;
		status: "Accepted" | "Late" | "Partial";
		completeness: number;
	}[];
	auditNotes: {
		at: string;
		user: string;
		action: string;
		source: "System" | "Manual";
	}[];
};

const DETAIL_BY_ID: Record<string, AuthDetail> = {
	"auth-1": {
		id: "auth-1",
		authNumber: "AUTH-8801",
		member: {
			name: "John D.",
			memberId: "MBR-102845",
			plan: "MD Health Plan",
			eligibility: "Eligible",
		},
		authorization: {
			type: "Personal Care Services",
			status: "ACTIVE",
			period: "05/01/2026 – 07/31/2026",
			approvedOn: "04/28/2026",
			lastUpdated: "06/20/2026",
			authorizedBy: "MDH Care Management",
			notes: "Approved for in-home personal care; renew before end date.",
		},
		service: {
			name: "Personal Care",
			code: "T1019",
			modifiers: "--",
			frequency: "Daily",
			placeOfService: "Home",
		},
		utilization: {
			authorizedUnits: 120,
			usedUnits: 86,
			remainingUnits: 34,
			utilizationPct: 72,
			unitType: "15-Minute Units",
			unitLimitPerDay: 8,
			overLimitUnits: 0,
		},
		provider: {
			name: "CareWell Home Care, LLC",
			npi: "1234567890",
			tin: "12-3456789",
		},
		vendor: {
			name: "Vendor A",
			vendorId: "VND-2041",
			submissionMethod: "SFTP",
		},
		encounters: [
			{
				id: "enc-1",
				serviceDate: "07/18/2026",
				units: 6,
				provider: "CareWell Home Care",
				claimNumber: "CLM-552910",
				source: "837P",
				status: "Accepted",
			},
			{
				id: "enc-2",
				serviceDate: "07/17/2026",
				units: 8,
				provider: "CareWell Home Care",
				claimNumber: "CLM-552841",
				source: "837P",
				status: "Accepted",
			},
			{
				id: "enc-3",
				serviceDate: "07/16/2026",
				units: 4,
				provider: "CareWell Home Care",
				claimNumber: "CLM-552790",
				source: "Portal",
				status: "Accepted",
			},
			{
				id: "enc-4",
				serviceDate: "07/15/2026",
				units: 8,
				provider: "CareWell Home Care",
				claimNumber: "CLM-552701",
				source: "837P",
				status: "Accepted",
			},
		],
		encounterTotal: 14,
		exceptions: [
			{ ok: true, label: "No authorization issues" },
			{ ok: true, label: "Units within authorized limits" },
			{ ok: true, label: "No duplicate services found" },
			{ ok: false, label: "1 service awaiting encounter confirmation" },
			{ ok: true, label: "Member eligibility verified" },
		],
		warningCount: 1,
		submissions: [
			{
				date: "07/20/2026",
				period: "Jul 2026 W3",
				fileName: "ltss_apex_0720.edi",
				records: 128,
				status: "Accepted",
				completeness: 98.4,
			},
			{
				date: "07/13/2026",
				period: "Jul 2026 W2",
				fileName: "ltss_apex_0713.edi",
				records: 116,
				status: "Accepted",
				completeness: 97.1,
			},
			{
				date: "07/06/2026",
				period: "Jul 2026 W1",
				fileName: "ltss_apex_0706.edi",
				records: 109,
				status: "Accepted",
				completeness: 96.8,
			},
		],
		auditNotes: [
			{
				at: "06/20/2026 14:22",
				user: "A. Nguyen",
				action: "Utilization reviewed — near mid-period target",
				source: "Manual",
			},
			{
				at: "05/02/2026 09:10",
				user: "System",
				action: "Authorization activated",
				source: "System",
			},
			{
				at: "04/28/2026 16:45",
				user: "Care Manager",
				action: "Authorization created",
				source: "Manual",
			},
		],
	},
};

function buildFallbackDetail(row: AuthorizationRow): AuthDetail {
	const utilizationPct = row.authorizedUnits
		? Math.round((row.usedUnits / row.authorizedUnits) * 100)
		: 0;
	return {
		id: row.id,
		authNumber: `AUTH-${8800 + Number(row.id.replace(/\D/g, "") || 1)}`,
		member: {
			name: row.member,
			memberId: `MBR-${100000 + Number(row.id.replace(/\D/g, "") || 1)}`,
			plan: "MD Health Plan",
			eligibility: "Eligible",
		},
		authorization: {
			type: `${row.service} Services`,
			status: row.status === "Active" ? "ACTIVE" : row.status,
			period: row.period,
			approvedOn: "04/28/2026",
			lastUpdated: "06/20/2026",
			authorizedBy: "MDH Care Management",
			notes: "Standard LTSS authorization.",
		},
		service: {
			name: row.service,
			code: "T1019",
			modifiers: "--",
			frequency: "Daily",
			placeOfService: "Home",
		},
		utilization: {
			authorizedUnits: row.authorizedUnits,
			usedUnits: row.usedUnits,
			remainingUnits: row.remainingUnits,
			utilizationPct,
			unitType: "15-Minute Units",
			unitLimitPerDay: 8,
			overLimitUnits: 0,
		},
		provider: {
			name: "CareWell Home Care, LLC",
			npi: "1234567890",
			tin: "12-3456789",
		},
		vendor: {
			name: "Vendor A",
			vendorId: "VND-2041",
			submissionMethod: "SFTP",
		},
		encounters: [],
		encounterTotal: 0,
		exceptions: [
			{ ok: true, label: "No authorization issues" },
			{ ok: true, label: "Member eligibility verified" },
		],
		warningCount: 0,
		submissions: [],
		auditNotes: [
			{
				at: "04/28/2026 16:45",
				user: "Care Manager",
				action: "Authorization created",
				source: "Manual",
			},
		],
	};
}

export function getLtssAuthDetail(authId: string): AuthDetail | undefined {
	if (DETAIL_BY_ID[authId]) return DETAIL_BY_ID[authId];
	const row = LTSS_AUTHORIZATIONS.find((item) => item.id === authId);
	return row ? buildFallbackDetail(row) : undefined;
}

export const LTSS_LIST_HREF = "/admin/claim-encounter/program-monitoring/ltss";
