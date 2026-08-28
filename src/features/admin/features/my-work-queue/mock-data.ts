import {
	type MigrationProgressMilestones,
	computeMigrationProgressPercent,
} from "./feature/progress";

export type WhitelistStatus = "complete" | "pending" | "not_started";

export type MigrationStatus =
	| "waiting_on_vendor"
	| "testing"
	| "need_testing"
	| "ready"
	| "production_ready"
	| "not_started"
	| "exception";

export type VendorType = "TPA" | "TPV";

export type HistoryEvent = {
	id: string;
	at: string;
	message: string;
	tone: "orange" | "purple" | "green" | "blue" | "red";
};

export type TpaTpvRow = {
	id: string;
	wave: number;
	name: string;
	code: string;
	type: VendorType;
	serverType: string;
	contactEmail: string;
	whitelistStatus: WhitelistStatus;
	lastCommunication: string;
	status: MigrationStatus;
	assignedAnalyst: string;
	lastUpdated: string;
	notes: string;
	primaryContact: string;
	primaryEmail: string;
	primaryPhone: string;
	secondaryContact: string;
	secondaryEmail: string;
	secondaryPhone: string;
	migrationStartDate: string;
	waitingOnVendorDate: string;
	currentStage: string;
	nextStep: string;
	history: HistoryEvent[];
	/** Milestone completion dates (MM/DD/YYYY). Empty = not completed. */
	initialContactSentAt: string;
	secondContactSentAt: string;
	responseReceivedAt: string;
	ipAddressesWhitelistedAt: string;
	credentialsProvidedAt: string;
	sftpConnectionConfirmedAt: string;
	progressPercent: number;
	progressUpdatedBy: string;
	progressUpdatedAt: string;
};

export const MIGRATION_STATUS_LABEL: Record<MigrationStatus, string> = {
	waiting_on_vendor: "Waiting on Vendor",
	testing: "Testing",
	need_testing: "Need Testing",
	ready: "Ready",
	production_ready: "Production Ready",
	not_started: "Not Started",
	exception: "Exception",
};

export const WHITELIST_STATUS_LABEL: Record<WhitelistStatus, string> = {
	complete: "Complete",
	pending: "Pending",
	not_started: "Not Started",
};

export const WORK_QUEUE_KPI = [
	{
		id: "assigned",
		label: "Assigned TPA/TPV",
		count: 12,
		tone: "blue" as const,
	},
	{
		id: "connected",
		label: "Connected",
		count: 9,
		tone: "green" as const,
	},
	{
		id: "migration",
		label: "In Migration",
		count: 5,
		tone: "orange" as const,
	},
	{
		id: "testing",
		label: "Testing",
		count: 3,
		tone: "purple" as const,
	},
	{
		id: "exceptions",
		label: "Exceptions",
		count: 2,
		tone: "red" as const,
	},
	{
		id: "not_started",
		label: "Not Started",
		count: 1,
		tone: "slate" as const,
	},
];

function historyFor(
	status: MigrationStatus,
	analyst: string,
	createdBy: string
): HistoryEvent[] {
	return [
		{
			id: "h1",
			at: "08/19/2026 9:15 AM",
			message: `Status updated to ${MIGRATION_STATUS_LABEL[status]} by ${analyst}`,
			tone:
				status === "waiting_on_vendor" || status === "exception"
					? "orange"
					: status === "testing" || status === "need_testing"
						? "purple"
						: status === "ready" || status === "production_ready"
							? "green"
							: "blue",
		},
		{
			id: "h2",
			at: "08/18/2026 4:30 PM",
			message: `Status updated to In Migration by ${analyst}`,
			tone: "purple",
		},
		{
			id: "h3",
			at: "08/17/2026 11:20 AM",
			message: `Status updated to Ready by ${analyst}`,
			tone: "green",
		},
		{
			id: "h4",
			at: "08/16/2026 10:05 AM",
			message: `Status updated to Waiting on Vendor by ${createdBy}`,
			tone: "orange",
		},
		{
			id: "h5",
			at: "08/01/2026 2:10 PM",
			message: `Vendor record created by ${createdBy}`,
			tone: "blue",
		},
	];
}

export const TPA_TPV_ROWS_BASE: Omit<
	TpaTpvRow,
	| "initialContactSentAt"
	| "secondContactSentAt"
	| "responseReceivedAt"
	| "ipAddressesWhitelistedAt"
	| "credentialsProvidedAt"
	| "sftpConnectionConfirmedAt"
	| "progressPercent"
	| "progressUpdatedBy"
	| "progressUpdatedAt"
>[] = [
	{
		id: "tpa-1",
		wave: 1,
		name: "Horizon Logistics",
		code: "TPA-1001",
		type: "TPA",
		serverType: "New SFTP",
		contactEmail: "ops@horizonlogistics.com",
		whitelistStatus: "complete",
		lastCommunication: "08/18/2026",
		status: "waiting_on_vendor",
		assignedAnalyst: "Sarah Johnson",
		lastUpdated: "08/19/2026 9:15 AM",
		notes: "Primary eligibility and claim files.",
		primaryContact: "Lisa Walker",
		primaryEmail: "lisa.w@horizon.com",
		primaryPhone: "(410) 555-1122",
		secondaryContact: "Mark Benson",
		secondaryEmail: "mark.b@horizon.com",
		secondaryPhone: "(410) 555-1199",
		migrationStartDate: "08/01/2026",
		waitingOnVendorDate: "08/15/2026",
		currentStage: "Data Exchange",
		nextStep: "Awaiting test file from vendor.",
		history: historyFor("waiting_on_vendor", "Sarah Johnson", "Michael Lee"),
	},
	{
		id: "tpa-2",
		wave: 1,
		name: "Apex Benefits Admin",
		code: "TPA-1002",
		type: "TPA",
		serverType: "Legacy SFTP",
		contactEmail: "integration@apexbenefits.com",
		whitelistStatus: "complete",
		lastCommunication: "08/17/2026",
		status: "testing",
		assignedAnalyst: "Michael Lee",
		lastUpdated: "08/19/2026 8:42 AM",
		notes: "Legacy SFTP cutover in progress.",
		primaryContact: "Nina Cruz",
		primaryEmail: "nina.c@apexbenefits.com",
		primaryPhone: "(202) 555-2201",
		secondaryContact: "Omar Reid",
		secondaryEmail: "omar.r@apexbenefits.com",
		secondaryPhone: "(202) 555-2202",
		migrationStartDate: "07/20/2026",
		waitingOnVendorDate: "08/10/2026",
		currentStage: "Connectivity Testing",
		nextStep: "Validate 837 sample batch.",
		history: historyFor("testing", "Michael Lee", "Sarah Johnson"),
	},
	{
		id: "tpa-3",
		wave: 2,
		name: "Gateway Management",
		code: "TPV-2001",
		type: "TPV",
		serverType: "New SFTP",
		contactEmail: "support@gatewaymgmt.com",
		whitelistStatus: "pending",
		lastCommunication: "08/16/2026",
		status: "need_testing",
		assignedAnalyst: "Sarah Johnson",
		lastUpdated: "08/18/2026 4:20 PM",
		notes: "Waiting on IP whitelist confirmation.",
		primaryContact: "Elena Park",
		primaryEmail: "elena.p@gatewaymgmt.com",
		primaryPhone: "(301) 555-4400",
		secondaryContact: "Chris Dodd",
		secondaryEmail: "chris.d@gatewaymgmt.com",
		secondaryPhone: "(301) 555-4401",
		migrationStartDate: "08/05/2026",
		waitingOnVendorDate: "08/12/2026",
		currentStage: "Whitelist Review",
		nextStep: "Confirm vendor firewall rules.",
		history: historyFor("need_testing", "Sarah Johnson", "Michael Lee"),
	},
	{
		id: "tpa-4",
		wave: 2,
		name: "Summit Care Partners",
		code: "TPA-1004",
		type: "TPA",
		serverType: "API Feed",
		contactEmail: "feeds@summitcare.com",
		whitelistStatus: "complete",
		lastCommunication: "08/19/2026",
		status: "ready",
		assignedAnalyst: "Priya Patel",
		lastUpdated: "08/19/2026 11:05 AM",
		notes: "API credentials rotated last week.",
		primaryContact: "Jordan Hale",
		primaryEmail: "jordan.h@summitcare.com",
		primaryPhone: "(703) 555-8810",
		secondaryContact: "Ava Kim",
		secondaryEmail: "ava.k@summitcare.com",
		secondaryPhone: "(703) 555-8811",
		migrationStartDate: "07/01/2026",
		waitingOnVendorDate: "07/28/2026",
		currentStage: "Go-Live Readiness",
		nextStep: "Schedule production cutover.",
		history: historyFor("ready", "Priya Patel", "Sarah Johnson"),
	},
	{
		id: "tpa-5",
		wave: 1,
		name: "Northstar TPA",
		code: "TPA-1005",
		type: "TPA",
		serverType: "Legacy SFTP",
		contactEmail: "it@northstartpa.com",
		whitelistStatus: "not_started",
		lastCommunication: "08/12/2026",
		status: "not_started",
		assignedAnalyst: "Michael Lee",
		lastUpdated: "08/15/2026 2:10 PM",
		notes: "Kickoff pending vendor response.",
		primaryContact: "Ruth Allen",
		primaryEmail: "ruth.a@northstartpa.com",
		primaryPhone: "(240) 555-3000",
		secondaryContact: "Ted Moss",
		secondaryEmail: "ted.m@northstartpa.com",
		secondaryPhone: "(240) 555-3001",
		migrationStartDate: "",
		waitingOnVendorDate: "",
		currentStage: "Not Started",
		nextStep: "Send onboarding packet.",
		history: historyFor("not_started", "Michael Lee", "Michael Lee"),
	},
	{
		id: "tpa-6",
		wave: 3,
		name: "BlueRiver Administrators",
		code: "TPA-1006",
		type: "TPA",
		serverType: "New SFTP",
		contactEmail: "connect@blueriveradmin.com",
		whitelistStatus: "complete",
		lastCommunication: "08/18/2026",
		status: "production_ready",
		assignedAnalyst: "Sarah Johnson",
		lastUpdated: "08/19/2026 7:55 AM",
		notes: "Production folder structure verified.",
		primaryContact: "Sam Ortiz",
		primaryEmail: "sam.o@blueriveradmin.com",
		primaryPhone: "(410) 555-7700",
		secondaryContact: "Joy Chen",
		secondaryEmail: "joy.c@blueriveradmin.com",
		secondaryPhone: "(410) 555-7701",
		migrationStartDate: "06/15/2026",
		waitingOnVendorDate: "07/01/2026",
		currentStage: "Production",
		nextStep: "Monitor first production cycle.",
		history: historyFor("production_ready", "Sarah Johnson", "Priya Patel"),
	},
	{
		id: "tpa-7",
		wave: 2,
		name: "Cascade Vendor Services",
		code: "TPV-2002",
		type: "TPV",
		serverType: "API Feed",
		contactEmail: "api@cascadevs.com",
		whitelistStatus: "pending",
		lastCommunication: "08/14/2026",
		status: "waiting_on_vendor",
		assignedAnalyst: "James Okoro",
		lastUpdated: "08/17/2026 3:30 PM",
		notes: "Vendor reviewing API contract.",
		primaryContact: "Maya Brooks",
		primaryEmail: "maya.b@cascadevs.com",
		primaryPhone: "(571) 555-1600",
		secondaryContact: "Leo Grant",
		secondaryEmail: "leo.g@cascadevs.com",
		secondaryPhone: "(571) 555-1601",
		migrationStartDate: "08/02/2026",
		waitingOnVendorDate: "08/14/2026",
		currentStage: "Contract Review",
		nextStep: "Follow up on signed API addendum.",
		history: historyFor("waiting_on_vendor", "James Okoro", "Michael Lee"),
	},
	{
		id: "tpa-8",
		wave: 3,
		name: "Pinnacle Health Exchange",
		code: "TPA-1008",
		type: "TPA",
		serverType: "New SFTP",
		contactEmail: "edi@pinnaclehx.com",
		whitelistStatus: "complete",
		lastCommunication: "08/19/2026",
		status: "testing",
		assignedAnalyst: "Priya Patel",
		lastUpdated: "08/19/2026 10:22 AM",
		notes: "Parallel testing with production mirror.",
		primaryContact: "Hank Wells",
		primaryEmail: "hank.w@pinnaclehx.com",
		primaryPhone: "(202) 555-9901",
		secondaryContact: "Ivy Tran",
		secondaryEmail: "ivy.t@pinnaclehx.com",
		secondaryPhone: "(202) 555-9902",
		migrationStartDate: "07/25/2026",
		waitingOnVendorDate: "08/08/2026",
		currentStage: "Connectivity Testing",
		nextStep: "Compare acknowledgment rates.",
		history: historyFor("testing", "Priya Patel", "Sarah Johnson"),
	},
	{
		id: "tpa-9",
		wave: 1,
		name: "Evergreen Claims Hub",
		code: "TPA-1009",
		type: "TPA",
		serverType: "Legacy SFTP",
		contactEmail: "claims@evergreenhub.com",
		whitelistStatus: "complete",
		lastCommunication: "08/15/2026",
		status: "exception",
		assignedAnalyst: "Sarah Johnson",
		lastUpdated: "08/18/2026 1:05 PM",
		notes: "File naming convention mismatch.",
		primaryContact: "Dana Price",
		primaryEmail: "dana.p@evergreenhub.com",
		primaryPhone: "(301) 555-2100",
		secondaryContact: "Ben Cole",
		secondaryEmail: "ben.c@evergreenhub.com",
		secondaryPhone: "(301) 555-2101",
		migrationStartDate: "07/10/2026",
		waitingOnVendorDate: "08/15/2026",
		currentStage: "Exception Handling",
		nextStep: "Resolve naming convention with vendor.",
		history: historyFor("exception", "Sarah Johnson", "Michael Lee"),
	},
	{
		id: "tpa-10",
		wave: 2,
		name: "Atlas Provider Network",
		code: "TPV-2003",
		type: "TPV",
		serverType: "New SFTP",
		contactEmail: "network@atlaspn.com",
		whitelistStatus: "pending",
		lastCommunication: "08/13/2026",
		status: "waiting_on_vendor",
		assignedAnalyst: "Michael Lee",
		lastUpdated: "08/16/2026 9:40 AM",
		notes: "Roster feed path pending.",
		primaryContact: "Kara West",
		primaryEmail: "kara.w@atlaspn.com",
		primaryPhone: "(703) 555-4500",
		secondaryContact: "Neil Park",
		secondaryEmail: "neil.p@atlaspn.com",
		secondaryPhone: "(703) 555-4501",
		migrationStartDate: "08/03/2026",
		waitingOnVendorDate: "08/13/2026",
		currentStage: "Data Exchange",
		nextStep: "Confirm inbound roster directory.",
		history: historyFor("waiting_on_vendor", "Michael Lee", "James Okoro"),
	},
	{
		id: "tpa-11",
		wave: 3,
		name: "Meridian Benefits Group",
		code: "TPA-1011",
		type: "TPA",
		serverType: "API Feed",
		contactEmail: "tech@meridianbg.com",
		whitelistStatus: "complete",
		lastCommunication: "08/18/2026",
		status: "ready",
		assignedAnalyst: "James Okoro",
		lastUpdated: "08/19/2026 6:18 AM",
		notes: "Ready for production promotion.",
		primaryContact: "Quinn Adler",
		primaryEmail: "quinn.a@meridianbg.com",
		primaryPhone: "(240) 555-6600",
		secondaryContact: "Rita Fox",
		secondaryEmail: "rita.f@meridianbg.com",
		secondaryPhone: "(240) 555-6601",
		migrationStartDate: "06/28/2026",
		waitingOnVendorDate: "07/20/2026",
		currentStage: "Go-Live Readiness",
		nextStep: "Final UAT sign-off.",
		history: historyFor("ready", "James Okoro", "Priya Patel"),
	},
	{
		id: "tpa-12",
		wave: 1,
		name: "Frontier Eligibility Co",
		code: "TPV-2004",
		type: "TPV",
		serverType: "Legacy SFTP",
		contactEmail: "eligibility@frontierel.com",
		whitelistStatus: "not_started",
		lastCommunication: "08/10/2026",
		status: "exception",
		assignedAnalyst: "Priya Patel",
		lastUpdated: "08/14/2026 5:45 PM",
		notes: "Certificate expired on vendor side.",
		primaryContact: "Owen Blake",
		primaryEmail: "owen.b@frontierel.com",
		primaryPhone: "(410) 555-3300",
		secondaryContact: "Pam Diaz",
		secondaryEmail: "pam.d@frontierel.com",
		secondaryPhone: "(410) 555-3301",
		migrationStartDate: "07/05/2026",
		waitingOnVendorDate: "08/10/2026",
		currentStage: "Exception Handling",
		nextStep: "Receive renewed SFTP certificate.",
		history: historyFor("exception", "Priya Patel", "Sarah Johnson"),
	},
];

type ProgressSeed = Partial<MigrationProgressMilestones> & {
	progressUpdatedBy?: string;
	progressUpdatedAt?: string;
};

/** Varied milestone seeds so Progress column / overall % look real. */
const PROGRESS_SEED: Record<string, ProgressSeed> = {
	"tpa-1": {
		initialContactSentAt: "08/01/2026",
		secondContactSentAt: "08/05/2026",
		responseReceivedAt: "08/08/2026",
		progressUpdatedBy: "Sarah Johnson",
		progressUpdatedAt: "08/08/2026 2:00 PM",
	},
	"tpa-2": {
		initialContactSentAt: "07/20/2026",
		secondContactSentAt: "07/22/2026",
		responseReceivedAt: "07/25/2026",
		ipAddressesWhitelistedAt: "08/01/2026",
		credentialsProvidedAt: "08/10/2026",
		progressUpdatedBy: "Michael Lee",
		progressUpdatedAt: "08/10/2026 11:30 AM",
	},
	"tpa-3": {
		initialContactSentAt: "08/05/2026",
		secondContactSentAt: "08/07/2026",
		responseReceivedAt: "08/09/2026",
		ipAddressesWhitelistedAt: "08/12/2026",
		progressUpdatedBy: "Sarah Johnson",
		progressUpdatedAt: "08/12/2026 4:00 PM",
	},
	"tpa-4": {
		initialContactSentAt: "07/01/2026",
		secondContactSentAt: "07/03/2026",
		responseReceivedAt: "07/05/2026",
		ipAddressesWhitelistedAt: "07/10/2026",
		credentialsProvidedAt: "07/15/2026",
		sftpConnectionConfirmedAt: "07/28/2026",
		progressUpdatedBy: "Priya Patel",
		progressUpdatedAt: "07/28/2026 9:00 AM",
	},
	"tpa-5": {},
	"tpa-6": {
		initialContactSentAt: "06/15/2026",
		secondContactSentAt: "06/17/2026",
		responseReceivedAt: "06/20/2026",
		ipAddressesWhitelistedAt: "06/25/2026",
		credentialsProvidedAt: "06/28/2026",
		sftpConnectionConfirmedAt: "07/01/2026",
		progressUpdatedBy: "Sarah Johnson",
		progressUpdatedAt: "07/01/2026 3:15 PM",
	},
	"tpa-7": {
		initialContactSentAt: "08/02/2026",
		secondContactSentAt: "08/04/2026",
		progressUpdatedBy: "James Okoro",
		progressUpdatedAt: "08/04/2026 10:00 AM",
	},
	"tpa-8": {
		initialContactSentAt: "07/25/2026",
		secondContactSentAt: "07/27/2026",
		responseReceivedAt: "07/30/2026",
		ipAddressesWhitelistedAt: "08/05/2026",
		credentialsProvidedAt: "08/08/2026",
		progressUpdatedBy: "Priya Patel",
		progressUpdatedAt: "08/08/2026 1:20 PM",
	},
	"tpa-9": {
		initialContactSentAt: "07/10/2026",
		secondContactSentAt: "07/12/2026",
		responseReceivedAt: "07/15/2026",
		ipAddressesWhitelistedAt: "07/20/2026",
		progressUpdatedBy: "Sarah Johnson",
		progressUpdatedAt: "07/20/2026 5:00 PM",
	},
	"tpa-10": {
		initialContactSentAt: "08/03/2026",
		secondContactSentAt: "08/05/2026",
		responseReceivedAt: "08/07/2026",
		progressUpdatedBy: "Michael Lee",
		progressUpdatedAt: "08/07/2026 8:45 AM",
	},
	"tpa-11": {
		initialContactSentAt: "06/28/2026",
		secondContactSentAt: "06/30/2026",
		responseReceivedAt: "07/02/2026",
		ipAddressesWhitelistedAt: "07/08/2026",
		credentialsProvidedAt: "07/12/2026",
		sftpConnectionConfirmedAt: "07/18/2026",
		progressUpdatedBy: "James Okoro",
		progressUpdatedAt: "07/18/2026 4:30 PM",
	},
	"tpa-12": {
		initialContactSentAt: "07/05/2026",
		secondContactSentAt: "07/08/2026",
		responseReceivedAt: "07/12/2026",
		progressUpdatedBy: "Priya Patel",
		progressUpdatedAt: "07/12/2026 12:00 PM",
	},
};

function withProgressSeed(row: (typeof TPA_TPV_ROWS_BASE)[number]): TpaTpvRow {
	const seed = PROGRESS_SEED[row.id] ?? {};
	const milestones: MigrationProgressMilestones = {
		initialContactSentAt: seed.initialContactSentAt ?? "",
		secondContactSentAt: seed.secondContactSentAt ?? "",
		responseReceivedAt: seed.responseReceivedAt ?? "",
		ipAddressesWhitelistedAt: seed.ipAddressesWhitelistedAt ?? "",
		credentialsProvidedAt: seed.credentialsProvidedAt ?? "",
		sftpConnectionConfirmedAt: seed.sftpConnectionConfirmedAt ?? "",
	};
	return {
		...row,
		...milestones,
		progressPercent: computeMigrationProgressPercent(milestones),
		progressUpdatedBy: seed.progressUpdatedBy ?? "",
		progressUpdatedAt: seed.progressUpdatedAt ?? "",
	};
}

export const TPA_TPV_ROWS: TpaTpvRow[] =
	TPA_TPV_ROWS_BASE.map(withProgressSeed);
