import type { ProgramFileType } from "@/types/UI/system.types";

export type ClaimFileStatus =
	| "accepted"
	| "rejected"
	| "pending"
	| "partial"
	| "exception"
	| "paid"
	| "denied";

export type MfcReviewStatus = "pending" | "accepted" | "rejected" | "denied";

export type RejectReason = {
	code: string;
	description: string;
};

/** Catalog of MFC reject reasons shown in review + exceptions. */
export const REJECT_REASON_CATALOG: RejectReason[] = [
	{ code: "CLM-4010", description: "Invalid member ID for program" },
	{ code: "NM1-2100", description: "Billing provider NPI missing or mismatched" },
	{ code: "CLM-4022", description: "Duplicate claim submission" },
	{ code: "DTP-4720", description: "Service date outside coverage window" },
	{ code: "HI-ABK0", description: "Missing or invalid principal diagnosis" },
	{ code: "SV2-1200", description: "Service line units exceed expected range" },
	{ code: "CLM-4031", description: "Claim charge does not balance to service lines" },
];

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
	/** MFC review lifecycle */
	reviewStatus: MfcReviewStatus;
	rejectReasons: RejectReason[];
	reviewedAt: string | null;
	reviewedBy: string | null;
	/** For outbound rows: the inbound file this was reviewed from */
	sourceInboundFileId: string | null;
	/** Queued / sent for accepted outbound; notified for rejected */
	outboundSendStatus: "queued" | "sent" | "notified" | null;
	/** EDI fixture key used by the viewer */
	ediFixture: "837I" | "835";
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
	ediFixture: "837I" | "835";
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
	const reviewers = ["A. Mensah", "J. Okonkwo", "S. Diallo", "M. Abebe"];

	// Inbound: pending review + MFC-rejected (stay inbound for vendor rework)
	for (let i = 0; i < 14; i++) {
		const program: ProgramFileType =
			i % 3 === 0 ? "MDH" : i % 3 === 1 ? "DHCF" : "BHP";
		const vendorMeta = VENDORS[i % VENDORS.length]!;
		const records = 40 + ((i * 17) % 120);
		const day = String(20 + (i % 8)).padStart(2, "0");
		const hour = String(7 + (i % 10)).padStart(2, "0");
		const isRejected = i % 5 === 0 && i > 0;
		const reasons = isRejected
			? [
					REJECT_REASON_CATALOG[i % REJECT_REASON_CATALOG.length]!,
					REJECT_REASON_CATALOG[(i + 2) % REJECT_REASON_CATALOG.length]!,
				]
			: [];
		rows.push({
			id: `cf-in-${i + 1}`,
			fileId: `CE-IN-2026-07${day}-${String(100 + i).padStart(3, "0")}`,
			vendor: vendorMeta.name,
			direction: "inbound",
			program,
			fileTypeLabel: vendorMeta.fileType,
			transactionType: "837",
			fileName:
				i === 0
					? "837I_Magellan_sample.txt"
					: isRejected
						? `${program}_${vendorMeta.name.toUpperCase()}_837_REJECTED_202607${day}.edi`
						: `${program}_${vendorMeta.name.toUpperCase()}_837_202607${day}.edi`,
			receivedAt: `2026-07-${day} ${hour}:${String((i * 7) % 60).padStart(2, "0")}`,
			records,
			submitted: records,
			accepted: 0,
			rejected: isRejected ? records : 0,
			partial: 0,
			paid: 0,
			denied: 0,
			status: isRejected ? "rejected" : "pending",
			responseCode: isRejected ? `RJ-${9000 + i}` : null,
			notes: isRejected
				? "MFC rejected — returned to inbound for vendor correction"
				: "Awaiting MFC claim review",
			avgResponseMinutes: isRejected ? 18 + (i % 5) * 4 : null,
			reviewStatus: isRejected ? "rejected" : "pending",
			rejectReasons: reasons,
			reviewedAt: isRejected
				? `2026-07-${day} ${String(11 + (i % 5)).padStart(2, "0")}:${String((i * 9) % 60).padStart(2, "0")}`
				: null,
			reviewedBy: isRejected ? reviewers[i % reviewers.length]! : null,
			sourceInboundFileId: null,
			outboundSendStatus: isRejected ? "notified" : null,
			ediFixture: "837I",
		});
	}

	// Outbound: accepted (to Gainwell) + denied (Gainwell/payer denials)
	for (let i = 0; i < 12; i++) {
		const program: ProgramFileType =
			i % 3 === 0 ? "MDH" : i % 3 === 1 ? "DHCF" : "BHP";
		const vendorMeta = VENDORS[i % VENDORS.length]!;
		const records = 35 + ((i * 13) % 90);
		const isDeniedPackage = i % 4 === 0;
		const deniedCount = isDeniedPackage
			? records
			: i % 3 === 0
				? Math.max(2, Math.floor(records * 0.1))
				: 0;
		const accepted = records - deniedCount;
		const day = String(18 + (i % 10)).padStart(2, "0");
		const hour = String(9 + (i % 8)).padStart(2, "0");
		const reasons = isDeniedPackage
			? [
					REJECT_REASON_CATALOG[i % REJECT_REASON_CATALOG.length]!,
					REJECT_REASON_CATALOG[(i + 1) % REJECT_REASON_CATALOG.length]!,
				]
			: deniedCount > 0
				? [REJECT_REASON_CATALOG[i % REJECT_REASON_CATALOG.length]!]
				: [];
		const sourceId = `CE-IN-2026-07${day}-${String(200 + i).padStart(3, "0")}`;
		rows.push({
			id: `cf-out-${i + 1}`,
			fileId: `CE-OUT-2026-07${day}-${String(300 + i).padStart(3, "0")}`,
			vendor: vendorMeta.name,
			direction: "outbound",
			program,
			fileTypeLabel: vendorMeta.fileType,
			transactionType: "837",
			fileName: isDeniedPackage
				? `${program}_${vendorMeta.name.toUpperCase()}_DENIED_202607${day}.edi`
				: `${program}_${vendorMeta.name.toUpperCase()}_837_ACCEPTED_202607${day}.edi`,
			receivedAt: `2026-07-${day} ${hour}:${String((i * 11) % 60).padStart(2, "0")}`,
			records,
			submitted: records,
			accepted: isDeniedPackage ? 0 : accepted,
			rejected: 0,
			partial: 0,
			paid: isDeniedPackage ? 0 : Math.floor(accepted * 0.85),
			denied: deniedCount,
			status: isDeniedPackage ? "denied" : "accepted",
			responseCode: isDeniedPackage ? `DN-${9100 + i}` : `AC-${9200 + i}`,
			notes: isDeniedPackage
				? "Gainwell denied — denial codes returned to vendor"
				: "MFC accepted — queued/sent to Gainwell",
			avgResponseMinutes: 22 + (i % 6) * 5,
			reviewStatus: isDeniedPackage ? "denied" : "accepted",
			rejectReasons: reasons,
			reviewedAt: `2026-07-${day} ${String(10 + (i % 6)).padStart(2, "0")}:${String((i * 13) % 60).padStart(2, "0")}`,
			reviewedBy: reviewers[i % reviewers.length]!,
			sourceInboundFileId: sourceId,
			outboundSendStatus: isDeniedPackage
				? "notified"
				: i % 2 === 0
					? "sent"
					: "queued",
			ediFixture: "837I",
		});
	}

	return rows;
}

export const CLAIM_VENDOR_FILES: ClaimVendorFile[] = seedFiles();

export const CLAIM_RESPONSES: ClaimResponse[] = CLAIM_VENDOR_FILES.filter(
	(f) => f.direction === "outbound" && f.reviewStatus === "accepted"
).map((file, i) => {
	const pending = Math.max(
		0,
		file.submitted - file.paid - file.denied - file.partial
	);
	const paid = Math.floor(file.accepted * 0.88);
	const rejected = Math.max(
		0,
		file.accepted - paid - Math.floor(file.accepted * 0.05)
	);
	const partialPaid = Math.max(0, file.accepted - paid - rejected);
	const tabStatus: ClaimFileStatus =
		i % 5 === 0
			? "partial"
			: i % 4 === 0
				? "denied"
				: i % 3 === 0
					? "pending"
					: "paid";
	return {
		id: `cr-${i + 1}`,
		responseId: `RESP-${file.fileId}`,
		responseFile:
			i === 0
				? "835_P_sample.txt"
				: `GW_RSP_${file.vendor.toUpperCase()}_202607${file.receivedAt.slice(8, 10)}_${String(i + 1).padStart(3, "0")}.edi`,
		submissionBatch: `GW_SUB_202607${file.receivedAt.slice(8, 10)}_${String(i + 1).padStart(3, "0")}`,
		relatedFileId: file.fileId,
		vendor: file.vendor,
		program: file.program,
		claimType: file.fileTypeLabel,
		responseType: (["835", "277CA", "999", "TA1"] as const)[i % 4]!,
		receivedAt: file.reviewedAt ?? file.receivedAt,
		totalSubmitted: file.accepted || file.submitted,
		paid,
		rejected,
		partialPaid,
		pending,
		acceptedCount: file.accepted,
		rejectedCount: rejected,
		status: tabStatus,
		summary:
			rejected > 0
				? `${rejected} claims denied; ${paid} paid`
				: `All ${paid} claims paid`,
		direction: "outbound",
		ediFixture: "835",
	};
});

export const CLAIM_EXCEPTIONS: ClaimException[] = CLAIM_VENDOR_FILES.filter(
	(f) =>
		f.reviewStatus === "rejected" ||
		f.reviewStatus === "denied" ||
		f.rejectReasons.length > 0 ||
		f.status === "rejected" ||
		f.status === "denied"
).flatMap((file, i) => {
	const reasons =
		file.rejectReasons.length > 0
			? file.rejectReasons
			: [REJECT_REASON_CATALOG[i % REJECT_REASON_CATALOG.length]!];
	return reasons.map((reason, ri) => ({
		id: `ex-${file.id}-${ri}`,
		exceptionId: `EX-${file.fileId}-${String(ri + 1).padStart(2, "0")}`,
		fileId: file.fileId,
		vendor: file.vendor,
		program: file.program,
		severity: (ri === 0 ? "error" : "warning") as "error" | "warning",
		code: reason.code,
		message: reason.description,
		claimId: `CLM-${800000 + i * 10 + ri}`,
		status: (["open", "in_progress", "resolved"] as const)[(i + ri) % 3]!,
		detectedAt: file.reviewedAt ?? file.receivedAt,
	}));
});

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
	/** MFC review decision at claim level */
	mfcReviewStatus: MfcReviewStatus;
	rejectReason: string | null;
	rejectReasons: RejectReason[];
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

function seedClaimLines(): ClaimLine[] {
	const lines: ClaimLine[] = [];
	let seq = 0;

	// Claims for inbound + outbound vendor files (MFC review)
	for (const file of CLAIM_VENDOR_FILES) {
		const count = Math.min(12, Math.max(4, Math.floor(file.records / 10)));
		for (let j = 0; j < count; j++) {
			seq += 1;
			const billed = 120 + ((seq * 37) % 2800);
			let mfcReviewStatus: MfcReviewStatus = file.reviewStatus;
			if (file.reviewStatus === "pending") mfcReviewStatus = "pending";
			else if (file.reviewStatus === "rejected") mfcReviewStatus = "rejected";
			else if (file.reviewStatus === "denied") mfcReviewStatus = "denied";
			else if (j % 7 === 0 && file.denied > 0) mfcReviewStatus = "denied";
			else mfcReviewStatus = "accepted";

			const reasons =
				mfcReviewStatus === "rejected" || mfcReviewStatus === "denied"
					? [
							file.rejectReasons[0] ??
								REJECT_REASON_CATALOG[seq % REJECT_REASON_CATALOG.length]!,
						]
					: [];

			const gainwellStatus =
				file.direction === "outbound" && mfcReviewStatus === "accepted"
					? j % 6 === 0
						? "partial"
						: j % 8 === 0
							? "pending"
							: "paid"
					: mfcReviewStatus === "denied"
						? "denied"
						: mfcReviewStatus === "rejected"
							? "rejected"
							: "pending";

			const paid =
				gainwellStatus === "paid"
					? billed
					: gainwellStatus === "partial"
						? Math.round(billed * 0.62)
						: 0;

			const relatedResponse = CLAIM_RESPONSES.find(
				(r) => r.relatedFileId === file.fileId
			);

			lines.push({
				id: `cl-${seq}`,
				claimId: `CLM-${900000 + seq}`,
				memberId: `MBR-${440000 + seq}`,
				provider: PROVIDERS[seq % PROVIDERS.length]!,
				vendor: file.vendor,
				account: `${file.vendor.slice(0, 3).toUpperCase()}-ACC-${(seq % 4) + 1}`,
				claimType: file.fileTypeLabel,
				dateOfService: `2026-07-${String(10 + (seq % 18)).padStart(2, "0")}`,
				amountBilled: billed,
				amountPaid: paid,
				submissionStatus:
					mfcReviewStatus === "rejected" || mfcReviewStatus === "denied"
						? "rejected"
						: mfcReviewStatus === "pending"
							? "pending"
							: "accepted",
				gainwellStatus,
				mfcReviewStatus,
				rejectReason: reasons[0]?.description ?? null,
				rejectReasons: reasons,
				responseFileName: relatedResponse?.responseFile ?? "",
				traceId: `TRC-${file.fileId}-${String(j + 1).padStart(4, "0")}`,
				batchId: relatedResponse?.submissionBatch ?? `MFC-${file.fileId}`,
				fileId: file.fileId,
				responseId: relatedResponse?.id ?? "",
				program: file.program,
				direction: file.direction,
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

export function claimsForFile(fileId: string) {
	const decoded = decodeURIComponent(fileId);
	return CLAIM_LINES.filter(
		(c) => c.fileId === decoded || c.fileId === getVendorFile(decoded)?.fileId
	);
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

/** Apply MFC accept/reject to claims in memory (mock). */
export function applyClaimReviews(
	fileId: string,
	updates: Array<{
		claimId: string;
		status: MfcReviewStatus;
		reasons?: RejectReason[];
	}>,
	reviewedBy = "Current User"
) {
	const file = getVendorFile(fileId);
	const now = new Date()
		.toISOString()
		.slice(0, 16)
		.replace("T", " ");
	for (const update of updates) {
		const line = CLAIM_LINES.find(
			(c) => c.claimId === update.claimId && (c.fileId === fileId || c.fileId === file?.fileId)
		);
		if (!line) continue;
		line.mfcReviewStatus = update.status;
		line.submissionStatus =
			update.status === "rejected"
				? "rejected"
				: update.status === "accepted"
					? "accepted"
					: "pending";
		line.rejectReasons = update.reasons ?? [];
		line.rejectReason = update.reasons?.[0]?.description ?? null;
	}
	if (file && updates.length > 0) {
		const fileClaims = claimsForFile(file.fileId);
		const allDecided = fileClaims.every((c) => c.mfcReviewStatus !== "pending");
		if (allDecided) {
			const anyRejected = fileClaims.some((c) => c.mfcReviewStatus === "rejected");
			const allRejected = fileClaims.every((c) => c.mfcReviewStatus === "rejected");
			const acceptedCount = fileClaims.filter(
				(c) => c.mfcReviewStatus === "accepted"
			).length;
			const rejectedCount = fileClaims.filter(
				(c) => c.mfcReviewStatus === "rejected"
			).length;
			file.reviewedAt = now;
			file.reviewedBy = reviewedBy;
			file.accepted = acceptedCount;
			file.rejected = rejectedCount;
			file.rejectReasons = fileClaims
				.flatMap((c) => c.rejectReasons)
				.filter(
					(r, idx, arr) => arr.findIndex((x) => x.code === r.code) === idx
				);

			if (allRejected) {
				// MFC rejects stay on inbound for vendor correction
				file.direction = "inbound";
				file.reviewStatus = "rejected";
				file.status = "rejected";
				file.outboundSendStatus = "notified";
				file.notes =
					"MFC rejected — returned to inbound for vendor correction";
			} else {
				// Accepted (or mixed with accepts) move to outbound
				file.direction = "outbound";
				file.reviewStatus = "accepted";
				file.status = anyRejected ? "partial" : "accepted";
				file.outboundSendStatus = "queued";
				file.sourceInboundFileId = file.sourceInboundFileId ?? file.fileId;
				file.notes = anyRejected
					? "MFC accepted with some claim rejects — queued for Gainwell"
					: "MFC accepted — queued for Gainwell";
			}
		}
	}
	return claimsForFile(fileId);
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
