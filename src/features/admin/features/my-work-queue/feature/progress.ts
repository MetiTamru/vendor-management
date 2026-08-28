/** Milestone ladder for TPA/TPV migration progress %. */

export type MigrationProgressMilestones = {
	initialContactSentAt: string;
	secondContactSentAt: string;
	responseReceivedAt: string;
	ipAddressesWhitelistedAt: string;
	credentialsProvidedAt: string;
	sftpConnectionConfirmedAt: string;
};

export const MIGRATION_PROGRESS_STEPS: {
	key: keyof MigrationProgressMilestones;
	label: string;
	percent: number;
}[] = [
	{ key: "initialContactSentAt", label: "Initial Contact Sent", percent: 10 },
	{ key: "secondContactSentAt", label: "Second Contact Sent", percent: 20 },
	{ key: "responseReceivedAt", label: "Response Received", percent: 30 },
	{
		key: "ipAddressesWhitelistedAt",
		label: "IP Addresses Whitelisted",
		percent: 50,
	},
	{ key: "credentialsProvidedAt", label: "Credentials Provided", percent: 75 },
	{
		key: "sftpConnectionConfirmedAt",
		label: "SFTP Connection Confirmed",
		percent: 100,
	},
];

function hasDate(value: string | null | undefined): boolean {
	return Boolean(value && String(value).trim());
}

/** Highest completed milestone wins (later step overrides earlier). */
export function computeMigrationProgressPercent(
	milestones: MigrationProgressMilestones
): number {
	let pct = 0;
	for (const step of MIGRATION_PROGRESS_STEPS) {
		if (hasDate(milestones[step.key])) pct = step.percent;
	}
	return pct;
}

export function computeOverallMigrationProgress(
	rows: { progressPercent: number }[]
): number {
	if (rows.length === 0) return 0;
	const sum = rows.reduce((acc, row) => acc + (row.progressPercent || 0), 0);
	return Math.round(sum / rows.length);
}
