export type ProgressTrack = "sftp" | "edi";

export type MilestoneDefinition = {
	key: string;
	label: string;
	weightPercent: number;
};

export type MilestoneState = MilestoneDefinition & {
	completedAt: string | null;
};

export type ConnectionProgress = {
	percent: number;
	currentMilestone: string;
	currentMilestoneKey: string;
	lastUpdated: string;
	milestones: MilestoneState[];
	notes: string;
	updatedBy: string;
	updatedAt: string;
};

export const SFTP_MILESTONE_DEFS: MilestoneDefinition[] = [
	{
		key: "initial_contact_sent",
		label: "Initial Contact Sent",
		weightPercent: 10,
	},
	{
		key: "second_contact_sent",
		label: "Second Contact Sent",
		weightPercent: 20,
	},
	{ key: "response_received", label: "Response Received", weightPercent: 30 },
	{ key: "ip_whitelisted", label: "IP Whitelisted", weightPercent: 50 },
	{
		key: "credentials_provided",
		label: "Credentials Provided",
		weightPercent: 75,
	},
	{ key: "sftp_confirmed", label: "SFTP Confirmed", weightPercent: 100 },
];

export const EDI_MILESTONE_DEFS: MilestoneDefinition[] = [
	{ key: "sftp_complete", label: "SFTP Complete (≥100%)", weightPercent: 25 },
	{
		key: "vendor_mgmt_configured",
		label: "Vendor Mgmt Configured",
		weightPercent: 50,
	},
	{ key: "testing_complete", label: "Testing Complete", weightPercent: 75 },
	{ key: "edi_complete", label: "EDI Complete", weightPercent: 100 },
];

export type ProgressSummary = {
	percent: number;
	completeCount: number;
	totalCount: number;
};

/** Zeroed summary when no cases match filters or API has no aggregate KPIs yet. */
export function emptyProgressSummary(): {
	sftp: ProgressSummary;
	edi: ProgressSummary;
} {
	return {
		sftp: { percent: 0, completeCount: 0, totalCount: 0 },
		edi: { percent: 0, completeCount: 0, totalCount: 0 },
	};
}

export type GuideMilestone = { percent: string; label: string };

export type GuideTrack = {
	name: string;
	color: "blue" | "green";
	milestones: GuideMilestone[];
};

export const WORK_QUEUE_GUIDE_TRACKS: GuideTrack[] = [
	{
		name: "SFTP Completion",
		color: "blue",
		milestones: SFTP_MILESTONE_DEFS.map((d) => ({
			percent: `${d.weightPercent}%`,
			label: d.label,
		})),
	},
	{
		name: "EDI Completion",
		color: "green",
		milestones: EDI_MILESTONE_DEFS.map((d) => ({
			percent: `${d.weightPercent}%`,
			label: d.label,
		})),
	},
];

export function emptyMilestones(defs: MilestoneDefinition[]): MilestoneState[] {
	return defs.map((d) => ({ ...d, completedAt: null }));
}

/** Build progress snapshot from milestone completion dates (uses highest completed weight). */
export function progressFromMilestones(
	milestones: MilestoneState[],
	opts: { updatedBy: string; updatedAt: string; notes?: string }
): ConnectionProgress {
	const completed = milestones.filter((m) => m.completedAt);
	const latest = completed.reduce<MilestoneState | null>((best, m) => {
		if (!best || m.weightPercent > best.weightPercent) return m;
		return best;
	}, null);

	const lastUpdated =
		completed
			.map((m) => m.completedAt)
			.filter(Boolean)
			.sort()
			.reverse()[0] ?? "";

	return {
		percent: latest?.weightPercent ?? 0,
		currentMilestone: latest?.label ?? "Not Started",
		currentMilestoneKey: latest?.key ?? "",
		lastUpdated,
		milestones,
		notes: opts.notes ?? "",
		updatedBy: opts.updatedBy,
		updatedAt: opts.updatedAt,
	};
}

export function buildMilestones(
	defs: MilestoneDefinition[],
	completedKeys: string[],
	dates: Partial<Record<string, string>> = {}
): MilestoneState[] {
	return defs.map((d) => ({
		...d,
		completedAt: completedKeys.includes(d.key) ? (dates[d.key] ?? "") : null,
	}));
}

export const EMPTY_SFTP_PROGRESS = progressFromMilestones(
	emptyMilestones(SFTP_MILESTONE_DEFS),
	{ updatedBy: "", updatedAt: "", notes: "" }
);

export const EMPTY_EDI_PROGRESS = progressFromMilestones(
	emptyMilestones(EDI_MILESTONE_DEFS),
	{ updatedBy: "", updatedAt: "", notes: "" }
);

/** Aggregate SFTP/EDI completion from visible work-queue rows (e.g. wave-filtered). */
export function summarizeProgressFromRows(
	rows: Array<{
		sftpProgress: ConnectionProgress;
		ediProgress: ConnectionProgress;
	}>
): { sftp: ProgressSummary; edi: ProgressSummary } {
	const total = rows.length;
	if (total === 0) {
		return {
			sftp: { percent: 0, completeCount: 0, totalCount: 0 },
			edi: { percent: 0, completeCount: 0, totalCount: 0 },
		};
	}

	const sftpComplete = rows.filter((r) => r.sftpProgress.percent >= 100).length;
	const ediComplete = rows.filter((r) => r.ediProgress.percent >= 100).length;
	const sftpPercent = Math.round(
		rows.reduce((sum, r) => sum + r.sftpProgress.percent, 0) / total
	);
	const ediPercent = Math.round(
		rows.reduce((sum, r) => sum + r.ediProgress.percent, 0) / total
	);

	return {
		sftp: {
			percent: sftpPercent,
			completeCount: sftpComplete,
			totalCount: total,
		},
		edi: {
			percent: ediPercent,
			completeCount: ediComplete,
			totalCount: total,
		},
	};
}
