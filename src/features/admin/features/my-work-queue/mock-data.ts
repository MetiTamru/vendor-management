import type { ConnectionProgress } from "./progress-data";
import {
	EDI_MILESTONE_DEFS,
	EMPTY_EDI_PROGRESS,
	EMPTY_SFTP_PROGRESS,
	SFTP_MILESTONE_DEFS,
	buildMilestones,
	progressFromMilestones,
} from "./progress-data";

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
	sftpProgress: ConnectionProgress;
	ediProgress: ConnectionProgress;
};

function mockSftp(
	completedKeys: string[],
	dates: Partial<Record<string, string>>,
	meta: { updatedBy: string; updatedAt: string; notes?: string }
): ConnectionProgress {
	return progressFromMilestones(
		buildMilestones(SFTP_MILESTONE_DEFS, completedKeys, dates),
		meta
	);
}

function mockEdi(
	completedKeys: string[],
	dates: Partial<Record<string, string>>,
	meta: { updatedBy: string; updatedAt: string; notes?: string }
): ConnectionProgress {
	return progressFromMilestones(
		buildMilestones(EDI_MILESTONE_DEFS, completedKeys, dates),
		meta
	);
}

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

export const TPA_TPV_ROWS: TpaTpvRow[] = [
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
		sftpProgress: mockSftp(
			[
				"initial_contact_sent",
				"second_contact_sent",
				"response_received",
				"ip_whitelisted",
				"credentials_provided",
				"sftp_confirmed",
			],
			{
				initial_contact_sent: "08/01/2026",
				second_contact_sent: "08/05/2026",
				response_received: "08/08/2026",
				ip_whitelisted: "08/12/2026",
				credentials_provided: "08/15/2026",
				sftp_confirmed: "08/18/2026",
			},
			{
				updatedBy: "Sarah Johnson",
				updatedAt: "08/19/2026 9:15 AM",
				notes: "Vendor confirmed public IPs are whitelisted on their firewall.",
			}
		),
		ediProgress: mockEdi(
			["sftp_complete", "vendor_mgmt_configured"],
			{
				sftp_complete: "08/18/2026",
				vendor_mgmt_configured: "08/19/2026",
			},
			{ updatedBy: "Sarah Johnson", updatedAt: "08/19/2026 9:15 AM" }
		),
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
		sftpProgress: mockSftp(
			[
				"initial_contact_sent",
				"second_contact_sent",
				"response_received",
				"ip_whitelisted",
				"credentials_provided",
				"sftp_confirmed",
			],
			{
				sftp_confirmed: "08/17/2026",
				credentials_provided: "08/14/2026",
				ip_whitelisted: "08/10/2026",
				response_received: "08/06/2026",
				second_contact_sent: "08/03/2026",
				initial_contact_sent: "07/28/2026",
			},
			{ updatedBy: "Michael Lee", updatedAt: "08/19/2026 8:42 AM" }
		),
		ediProgress: mockEdi(
			["sftp_complete", "vendor_mgmt_configured", "testing_complete"],
			{
				testing_complete: "08/19/2026",
				vendor_mgmt_configured: "08/18/2026",
				sftp_complete: "08/17/2026",
			},
			{ updatedBy: "Michael Lee", updatedAt: "08/19/2026 8:42 AM" }
		),
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
		sftpProgress: mockSftp(
			["initial_contact_sent", "second_contact_sent", "response_received"],
			{
				response_received: "08/16/2026",
				second_contact_sent: "08/12/2026",
				initial_contact_sent: "08/08/2026",
			},
			{ updatedBy: "Sarah Johnson", updatedAt: "08/18/2026 4:20 PM" }
		),
		ediProgress: EMPTY_EDI_PROGRESS,
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
		sftpProgress: mockSftp(
			[
				"initial_contact_sent",
				"second_contact_sent",
				"response_received",
				"ip_whitelisted",
				"credentials_provided",
				"sftp_confirmed",
			],
			{ sftp_confirmed: "08/15/2026" },
			{ updatedBy: "Priya Patel", updatedAt: "08/19/2026 11:05 AM" }
		),
		ediProgress: mockEdi(
			[
				"sftp_complete",
				"vendor_mgmt_configured",
				"testing_complete",
				"edi_complete",
			],
			{ edi_complete: "08/19/2026" },
			{ updatedBy: "Priya Patel", updatedAt: "08/19/2026 11:05 AM" }
		),
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
		sftpProgress: EMPTY_SFTP_PROGRESS,
		ediProgress: EMPTY_EDI_PROGRESS,
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
		sftpProgress: mockSftp(
			[
				"initial_contact_sent",
				"second_contact_sent",
				"response_received",
				"ip_whitelisted",
				"credentials_provided",
				"sftp_confirmed",
			],
			{ sftp_confirmed: "08/10/2026" },
			{ updatedBy: "Sarah Johnson", updatedAt: "08/19/2026 7:55 AM" }
		),
		ediProgress: mockEdi(
			[
				"sftp_complete",
				"vendor_mgmt_configured",
				"testing_complete",
				"edi_complete",
			],
			{ edi_complete: "08/18/2026" },
			{ updatedBy: "Sarah Johnson", updatedAt: "08/19/2026 7:55 AM" }
		),
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
		sftpProgress: mockSftp(
			["initial_contact_sent", "second_contact_sent"],
			{
				second_contact_sent: "08/12/2026",
				initial_contact_sent: "08/05/2026",
			},
			{ updatedBy: "James Okoro", updatedAt: "08/17/2026 3:30 PM" }
		),
		ediProgress: EMPTY_EDI_PROGRESS,
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
		sftpProgress: mockSftp(
			[
				"initial_contact_sent",
				"second_contact_sent",
				"response_received",
				"ip_whitelisted",
				"credentials_provided",
				"sftp_confirmed",
			],
			{ sftp_confirmed: "08/14/2026" },
			{ updatedBy: "Priya Patel", updatedAt: "08/19/2026 10:22 AM" }
		),
		ediProgress: mockEdi(
			["sftp_complete", "vendor_mgmt_configured"],
			{ vendor_mgmt_configured: "08/18/2026", sftp_complete: "08/14/2026" },
			{ updatedBy: "Priya Patel", updatedAt: "08/19/2026 10:22 AM" }
		),
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
		sftpProgress: mockSftp(
			[
				"initial_contact_sent",
				"second_contact_sent",
				"response_received",
				"ip_whitelisted",
			],
			{ ip_whitelisted: "08/14/2026" },
			{ updatedBy: "Sarah Johnson", updatedAt: "08/18/2026 1:05 PM" }
		),
		ediProgress: EMPTY_EDI_PROGRESS,
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
		sftpProgress: mockSftp(
			["initial_contact_sent", "second_contact_sent", "response_received"],
			{ response_received: "08/13/2026" },
			{ updatedBy: "Michael Lee", updatedAt: "08/16/2026 9:40 AM" }
		),
		ediProgress: EMPTY_EDI_PROGRESS,
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
		sftpProgress: mockSftp(
			[
				"initial_contact_sent",
				"second_contact_sent",
				"response_received",
				"ip_whitelisted",
				"credentials_provided",
				"sftp_confirmed",
			],
			{ sftp_confirmed: "08/12/2026" },
			{ updatedBy: "James Okoro", updatedAt: "08/19/2026 6:18 AM" }
		),
		ediProgress: mockEdi(
			[
				"sftp_complete",
				"vendor_mgmt_configured",
				"testing_complete",
				"edi_complete",
			],
			{ edi_complete: "08/17/2026" },
			{ updatedBy: "James Okoro", updatedAt: "08/19/2026 6:18 AM" }
		),
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
		sftpProgress: mockSftp(
			["initial_contact_sent", "second_contact_sent"],
			{ second_contact_sent: "08/08/2026", initial_contact_sent: "08/01/2026" },
			{ updatedBy: "Priya Patel", updatedAt: "08/14/2026 5:45 PM" }
		),
		ediProgress: EMPTY_EDI_PROGRESS,
	},
];
