import type { ProgramFileType } from "@/types/UI/system.types";

export type ClaimFileStatus =
	| "accepted"
	| "rejected"
	| "pending"
	| "partial"
	| "exception"
	| "paid"
	| "denied";

export type ClaimVendorFile = {
	id: string;
	fileId: string;
	vendor: string;
	direction: "inbound" | "outbound";
	program: ProgramFileType;
	fileTypeLabel: string;
	transactionType: "837" | "835" | "277CA" | "999" | "TA1";
	fileName: string;
	receivedAt: string;
	records: number;
	submitted: number;
	accepted: number;
	rejected: number;
	partial: number;
	paid: number;
	denied: number;
	status: ClaimFileStatus;
	responseCode: string | null;
	notes: string | null;
	avgResponseMinutes: number | null;
};

export type ClaimResponse = {
	id: string;
	responseId: string;
	responseFile: string;
	submissionBatch: string;
	relatedFileId: string;
	vendor: string;
	program: ProgramFileType;
	claimType: string;
	responseType: "277CA" | "999" | "TA1" | "835";
	receivedAt: string;
	totalSubmitted: number;
	paid: number;
	rejected: number;
	partialPaid: number;
	pending: number;
	acceptedCount: number;
	rejectedCount: number;
	status: ClaimFileStatus;
	summary: string;
	direction: "inbound" | "outbound";
};

export type ClaimException = {
	id: string;
	exceptionId: string;
	fileId: string;
	vendor: string;
	program: ProgramFileType;
	severity: "error" | "warning";
	code: string;
	message: string;
	claimId: string | null;
	status: "open" | "in_progress" | "resolved";
	detectedAt: string;
};

export type VendorPerformanceRow = {
	vendor: string;
	fileType: string;
	filesReceived: number;
	submittedToGainwell: number;
	accepted: number;
	rejected: number;
	partial: number;
	acceptanceRate: number;
	program: ProgramFileType;
};

const VENDORS = [
	{ name: "UST", fileType: "Medical Claims" },
	{ name: "CVS", fileType: "Pharmacy Claims" },
	{ name: "Avesis", fileType: "Vision/Dental" },
	{ name: "Beacon Health", fileType: "Medical Claims" },
	{ name: "Cascade Net", fileType: "Encounter" },
];

function seedFiles(): ClaimVendorFile[] {
	const rows: ClaimVendorFile[] = [];
	const statuses: ClaimFileStatus[] = [
		"accepted",
		"rejected",
		"pending",
		"partial",
		"paid",
		"denied",
	];

	for (let i = 0; i < 28; i++) {
		const program: ProgramFileType =
			i % 3 === 0 ? "MDH" : i % 3 === 1 ? "DHCF" : "BHP";
		const direction = i % 3 === 0 ? "outbound" : "inbound";
		const vendorMeta = VENDORS[i % VENDORS.length]!;
		const transactionType: ClaimVendorFile["transactionType"] =
			direction === "inbound"
				? i % 4 === 3
					? "999"
					: "837"
				: (["835", "277CA", "999", "TA1"] as const)[i % 4]!;
		const records = 800 + ((i * 137) % 4200);
		const submitted = Math.max(records - (i % 5), Math.floor(records * 0.97));
		const rejected = i % 5 === 0 ? Math.floor(submitted * 0.035) : (i % 11) * 8;
		const partial = i % 4 === 0 ? Math.floor(submitted * 0.012) : (i % 6) * 5;
		const accepted = Math.max(0, submitted - rejected - partial);
		const paid = Math.floor(accepted * (0.82 + (i % 5) * 0.03));
		const denied = Math.max(0, accepted - paid);
		const day = String(20 + (i % 8)).padStart(2, "0");
		const hour = String(7 + (i % 10)).padStart(2, "0");

		rows.push({
			id: `cf-${i + 1}`,
			fileId: `CE-2026-07${day}-${String(100 + i).padStart(3, "0")}`,
			vendor: vendorMeta.name,
			direction,
			program,
			fileTypeLabel: vendorMeta.fileType,
			transactionType: transactionType as ClaimVendorFile["transactionType"],
			fileName: `${program}_${vendorMeta.name.toUpperCase()}_${vendorMeta.fileType.replace(/\s|\//g, "")}_202607${day}.edi`,
			receivedAt: `2026-07-${day} ${hour}:${String((i * 7) % 60).padStart(2, "0")}`,
			records,
			submitted,
			accepted,
			rejected,
			partial,
			paid,
			denied,
			status: statuses[i % statuses.length]!,
			responseCode: i % 4 === 0 ? null : `R-${9000 + i}`,
			notes:
				i % 6 === 0
					? "Awaiting Gainwell acknowledgement"
					: i % 5 === 0
						? "Segment-level rejections present"
						: null,
			avgResponseMinutes: 18 + (i % 9) * 7,
		});
	}
	return rows;
}

export const CLAIM_VENDOR_FILES: ClaimVendorFile[] = seedFiles();

export const CLAIM_RESPONSES: ClaimResponse[] = CLAIM_VENDOR_FILES.map(
	(file, i) => {
		const pending = Math.max(
			0,
			file.submitted - file.paid - file.rejected - file.partial
		);
		const tabStatus: ClaimFileStatus =
			i % 6 === 0
				? "exception"
				: i % 5 === 0
					? "pending"
					: i % 4 === 0
						? "partial"
						: i % 3 === 0
							? "rejected"
							: "paid";
		return {
			id: `cr-${i + 1}`,
			responseId: `RESP-${file.fileId}`,
			responseFile: `GW_RSP_${file.vendor.toUpperCase()}_202607${file.receivedAt.slice(8, 10)}_${String(i + 1).padStart(3, "0")}.edi`,
			submissionBatch: `GW_SUB_202607${file.receivedAt.slice(8, 10)}_${String(i + 1).padStart(3, "0")}`,
			relatedFileId: file.fileId,
			vendor: file.vendor,
			program: file.program,
			claimType: file.fileTypeLabel,
			responseType: (["277CA", "999", "TA1", "835"] as const)[i % 4]!,
			receivedAt: file.receivedAt,
			totalSubmitted: file.submitted,
			paid: file.paid,
			rejected: file.rejected,
			partialPaid: file.partial,
			pending,
			acceptedCount: file.accepted,
			rejectedCount: file.rejected,
			status: tabStatus,
			summary:
				file.rejected > 0
					? `${file.rejected} claims rejected; ${file.accepted} accepted`
					: `All ${file.accepted} claims accepted`,
			direction: file.direction,
		};
	}
);

export const CLAIM_EXCEPTIONS: ClaimException[] = CLAIM_VENDOR_FILES.filter(
	(f) =>
		f.status === "rejected" ||
		f.status === "exception" ||
		f.status === "denied" ||
		f.rejected > 0
).flatMap((file, i) => [
	{
		id: `ex-${i + 1}a`,
		exceptionId: `EX-${file.fileId}-01`,
		fileId: file.fileId,
		vendor: file.vendor,
		program: file.program,
		severity: "error" as const,
		code: i % 2 === 0 ? "CLM-4010" : "NM1-2100",
		message:
			i % 2 === 0
				? "Claim rejected: invalid member ID for program"
				: "Billing provider NPI missing or mismatched",
		claimId: `CLM-${800000 + i}`,
		status: (["open", "in_progress", "resolved"] as const)[i % 3]!,
		detectedAt: file.receivedAt,
	},
	...(i % 3 === 0
		? [
				{
					id: `ex-${i + 1}b`,
					exceptionId: `EX-${file.fileId}-02`,
					fileId: file.fileId,
					vendor: file.vendor,
					program: file.program,
					severity: "warning" as const,
					code: "SVC-1200",
					message: "Service line units exceed expected range",
					claimId: `CLM-${800100 + i}`,
					status: "open" as const,
					detectedAt: file.receivedAt,
				},
			]
		: []),
]);

export function filesForProgram(
	program: ProgramFileType,
	direction?: "inbound" | "outbound"
) {
	return CLAIM_VENDOR_FILES.filter(
		(f) =>
			f.program === program && (direction ? f.direction === direction : true)
	);
}

export function responsesForProgram(
	program: ProgramFileType,
	direction?: "inbound" | "outbound"
) {
	return CLAIM_RESPONSES.filter(
		(r) =>
			r.program === program && (direction ? r.direction === direction : true)
	);
}

export function exceptionsForProgram(program: ProgramFileType) {
	return CLAIM_EXCEPTIONS.filter((e) => e.program === program);
}

export function vendorPerformanceForProgram(
	program: ProgramFileType,
	direction: "inbound" | "outbound" = "inbound"
): VendorPerformanceRow[] {
	const files = filesForProgram(program, direction);
	const map = new Map<string, VendorPerformanceRow>();

	for (const file of files) {
		const key = `${file.vendor}::${file.fileTypeLabel}`;
		const current = map.get(key) ?? {
			vendor: file.vendor,
			fileType: file.fileTypeLabel,
			filesReceived: 0,
			submittedToGainwell: 0,
			accepted: 0,
			rejected: 0,
			partial: 0,
			acceptanceRate: 0,
			program,
		};
		current.filesReceived += 1;
		current.submittedToGainwell += file.submitted;
		current.accepted += file.accepted;
		current.rejected += file.rejected;
		current.partial += file.partial;
		map.set(key, current);
	}

	return Array.from(map.values())
		.map((row) => ({
			...row,
			acceptanceRate: row.submittedToGainwell
				? Math.round((row.accepted / row.submittedToGainwell) * 1000) / 10
				: 0,
		}))
		.sort((a, b) => a.vendor.localeCompare(b.vendor));
}

export type ClaimLine = {
	id: string;
	claimId: string;
	memberId: string;
	provider: string;
	vendor: string;
	account: string;
	claimType: string;
	dateOfService: string;
	amountBilled: number;
	amountPaid: number;
	submissionStatus:
		| "submitted"
		| "accepted"
		| "rejected"
		| "partial"
		| "pending";
	gainwellStatus: "paid" | "rejected" | "partial" | "pending" | "denied";
	rejectReason: string | null;
	responseFileName: string;
	traceId: string;
	batchId: string;
	fileId: string;
	responseId: string;
	program: ProgramFileType;
	direction: "inbound" | "outbound";
};

export type SubmissionBatch = {
	id: string;
	batchId: string;
	vendor: string;
	program: ProgramFileType;
	direction: "inbound" | "outbound";
	claimType: string;
	claimsSubmitted: number;
	responseReceived: boolean;
	accepted: number;
	rejected: number;
	partial: number;
	paid: number;
	pending: number;
	submittedAt: string;
	responseFile: string | null;
	relatedFileId: string;
	responseId: string;
};

const PROVIDERS = [
	"Capitol Family Practice",
	"Metro Specialty Clinic",
	"Riverside Urgent Care",
	"Harbor Pediatrics",
	"Summit Orthopedics",
];

const REJECT_REASONS = [
	"Invalid member ID for program",
	"Billing provider NPI mismatched",
	"Duplicate claim submission",
	"Service date outside coverage",
	null,
	null,
	null,
];

function seedClaimLines(): ClaimLine[] {
	const lines: ClaimLine[] = [];
	let seq = 0;
	for (const response of CLAIM_RESPONSES) {
		const count = 8 + (seq % 5);
		for (let j = 0; j < count; j++) {
			seq += 1;
			const billed = 120 + ((seq * 37) % 2800);
			const gainwellStatus =
				j % 7 === 0
					? "rejected"
					: j % 5 === 0
						? "partial"
						: j % 4 === 0
							? "pending"
							: j % 6 === 0
								? "denied"
								: "paid";
			const paid =
				gainwellStatus === "paid"
					? billed
					: gainwellStatus === "partial"
						? Math.round(billed * 0.62)
						: 0;
			lines.push({
				id: `cl-${seq}`,
				claimId: `CLM-${900000 + seq}`,
				memberId: `MBR-${440000 + seq}`,
				provider: PROVIDERS[seq % PROVIDERS.length]!,
				vendor: response.vendor,
				account: `${response.vendor.slice(0, 3).toUpperCase()}-ACC-${(seq % 4) + 1}`,
				claimType: response.claimType,
				dateOfService: `2026-07-${String(10 + (seq % 18)).padStart(2, "0")}`,
				amountBilled: billed,
				amountPaid: paid,
				submissionStatus:
					gainwellStatus === "rejected"
						? "rejected"
						: gainwellStatus === "pending"
							? "pending"
							: gainwellStatus === "partial"
								? "partial"
								: "accepted",
				gainwellStatus,
				rejectReason:
					gainwellStatus === "rejected" || gainwellStatus === "denied"
						? REJECT_REASONS[seq % REJECT_REASONS.length]!
						: null,
				responseFileName: response.responseFile,
				traceId: `TRC-${response.submissionBatch}-${String(j + 1).padStart(4, "0")}`,
				batchId: response.submissionBatch,
				fileId: response.relatedFileId,
				responseId: response.id,
				program: response.program,
				direction: response.direction,
			});
		}
	}
	return lines;
}

export const CLAIM_LINES: ClaimLine[] = seedClaimLines();

export const SUBMISSION_BATCHES: SubmissionBatch[] = CLAIM_RESPONSES.map(
	(response) => ({
		id: response.submissionBatch,
		batchId: response.submissionBatch,
		vendor: response.vendor,
		program: response.program,
		direction: response.direction,
		claimType: response.claimType,
		claimsSubmitted: response.totalSubmitted,
		responseReceived: response.status !== "pending",
		accepted: response.acceptedCount,
		rejected: response.rejected,
		partial: response.partialPaid,
		paid: response.paid,
		pending: response.pending,
		submittedAt: response.receivedAt,
		responseFile: response.status === "pending" ? null : response.responseFile,
		relatedFileId: response.relatedFileId,
		responseId: response.id,
	})
);

export function getClaimResponse(id: string) {
	return CLAIM_RESPONSES.find(
		(r) => r.id === id || r.responseId === id || r.responseFile === id
	);
}

export function getSubmissionBatch(batchId: string) {
	const decoded = decodeURIComponent(batchId);
	return SUBMISSION_BATCHES.find(
		(b) => b.id === decoded || b.batchId === decoded
	);
}

export function getVendorFile(fileId: string) {
	return CLAIM_VENDOR_FILES.find((f) => f.id === fileId || f.fileId === fileId);
}

export function claimsForBatch(batchId: string) {
	const decoded = decodeURIComponent(batchId);
	return CLAIM_LINES.filter((c) => c.batchId === decoded);
}

export function claimsForResponse(responseId: string) {
	return CLAIM_LINES.filter(
		(c) =>
			c.responseId === responseId || c.responseFileName.includes(responseId)
	);
}

export function formatCurrency(value: number) {
	return value.toLocaleString("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	});
}

export function downloadTextFile(filename: string, content: string) {
	const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = filename;
	anchor.click();
	anchor.remove();
	URL.revokeObjectURL(url);
}

export function exportRowsAsCsv(
	filename: string,
	headers: string[],
	rows: Array<Array<string | number>>
) {
	const escape = (value: string | number) => {
		const text = String(value);
		if (text.includes(",") || text.includes('"') || text.includes("\n")) {
			return `"${text.replaceAll('"', '""')}"`;
		}
		return text;
	};
	const body = [
		headers.map(escape).join(","),
		...rows.map((row) => row.map(escape).join(",")),
	].join("\n");
	downloadTextFile(filename, body);
}

export function displayClaimStatus(status: ClaimFileStatus) {
	if (status === "accepted") return "Accepted";
	if (status === "rejected") return "Rejected";
	if (status === "pending") return "Pending";
	if (status === "partial") return "Partial";
	if (status === "paid") return "Paid";
	if (status === "denied") return "Denied";
	return "Exception";
}

export function formatCount(value: number) {
	return value.toLocaleString("en-US");
}

const CLAIM_COMPARE_AVATARS = [
	"bg-[#13446c]",
	"bg-[#c2410c]",
	"bg-[#1d4ed8]",
	"bg-[#15803d]",
	"bg-[#7c3aed]",
	"bg-[#0e7490]",
	"bg-[#b45309]",
] as const;

/** Build comparable vendor rows for the Claim & Encounter comparison page. */
export function claimVendorsForComparison(program: ProgramFileType) {
	const files = filesForProgram(program);
	const exceptions = exceptionsForProgram(program);
	const byVendor = new Map<
		string,
		{
			name: string;
			files: number;
			submitted: number;
			accepted: number;
			rejected: number;
			lastFileReceived: string;
			alerts: number;
		}
	>();

	for (const file of files) {
		const current = byVendor.get(file.vendor) ?? {
			name: file.vendor,
			files: 0,
			submitted: 0,
			accepted: 0,
			rejected: 0,
			lastFileReceived: file.receivedAt,
			alerts: 0,
		};
		current.files += 1;
		current.submitted += file.submitted;
		current.accepted += file.accepted;
		current.rejected += file.rejected;
		if (file.receivedAt > current.lastFileReceived) {
			current.lastFileReceived = file.receivedAt;
		}
		byVendor.set(file.vendor, current);
	}

	for (const ex of exceptions) {
		const current = byVendor.get(ex.vendor);
		if (!current) continue;
		if (ex.status === "open" || ex.status === "in_progress") {
			current.alerts += 1;
		}
	}

	return Array.from(byVendor.values())
		.sort((a, b) => a.name.localeCompare(b.name))
		.map((row, index) => {
			const acceptance = row.submitted
				? Math.round((row.accepted / row.submitted) * 1000) / 10
				: 0;
			const health =
				acceptance >= 97
					? ("healthy" as const)
					: acceptance >= 92
						? ("warning" as const)
						: ("critical" as const);
			return {
				id: `ce-${row.name.toLowerCase().replace(/\s+/g, "-")}`,
				name: row.name,
				mark: row.name.charAt(0).toUpperCase(),
				avatarBg: CLAIM_COMPARE_AVATARS[index % CLAIM_COMPARE_AVATARS.length]!,
				health,
				linkedAccounts: row.files,
				activeJobs: Math.max(1, Math.round(row.submitted / 2500)),
				slaPercent: acceptance,
				alertsCount: row.alerts,
				lastFileReceived: row.lastFileReceived,
				vendorCode: `CE-${String(index + 1).padStart(3, "0")}`,
				vendorType: "Claim / Encounter",
			};
		});
}
