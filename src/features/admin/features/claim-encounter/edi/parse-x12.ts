/**
 * Lightweight X12 EDI parser for professional viewing (837 / 835 focused).
 */

export type X12Delimiters = {
	element: string;
	segment: string;
	composite: string;
};

export type X12Segment = {
	index: number;
	tag: string;
	raw: string;
	elements: string[];
	/** Composite-split elements (element index → parts). */
	composites: string[][];
};

export type X12Document = {
	raw: string;
	delimiters: X12Delimiters;
	segments: X12Segment[];
	transactionSet: string | null;
	guide: string | null;
	functionalId: string | null;
};

export function detectDelimiters(raw: string): X12Delimiters {
	const trimmed = raw.trim();
	if (trimmed.startsWith("ISA") && trimmed.length >= 106) {
		return {
			element: trimmed[3] ?? "*",
			composite: trimmed[104] ?? ":",
			segment: trimmed[105] ?? "~",
		};
	}
	return { element: "*", segment: "~", composite: ":" };
}

export function parseX12(raw: string): X12Document {
	const delimiters = detectDelimiters(raw);
	const parts = raw
		.replace(/\r\n/g, "\n")
		.replace(/\r/g, "\n")
		.split(delimiters.segment)
		.map((s) => s.replace(/^\n+|\n+$/g, "").trim())
		.filter(Boolean);

	const segments: X12Segment[] = parts.map((rawSeg, index) => {
		const elements = rawSeg.split(delimiters.element);
		const tag = elements[0] ?? "";
		const composites = elements.map((el) =>
			el.includes(delimiters.composite)
				? el.split(delimiters.composite)
				: [el]
		);
		return { index, tag, raw: rawSeg, elements, composites };
	});

	const st = segments.find((s) => s.tag === "ST");
	const gs = segments.find((s) => s.tag === "GS");
	let transactionSet = st?.elements[1] ?? null;
	const guide = gs?.elements[8] ?? st?.elements[2] ?? null;
	const functionalId = gs?.elements[1] ?? null;

	// Distinguish 837I vs 837P when possible
	if (transactionSet === "837") {
		const hasSv2 = segments.some((s) => s.tag === "SV2");
		const hasSv1 = segments.some((s) => s.tag === "SV1");
		if (hasSv2 && !hasSv1) transactionSet = "837I";
		else if (hasSv1 && !hasSv2) transactionSet = "837P";
	}

	return {
		raw,
		delimiters,
		segments,
		transactionSet,
		guide,
		functionalId,
	};
}

export type EdiSummary = {
	transactionSet: string;
	guide: string | null;
	segmentCount: number;
	claimCount: number;
	serviceLineCount: number;
	paymentTotal: number | null;
	paidClaims: number;
	deniedOrSecondary: number;
	topCasCodes: { code: string; count: number }[];
};

export function summarizeX12(doc: X12Document): EdiSummary {
	const segs = doc.segments;
	const clm = segs.filter((s) => s.tag === "CLM");
	const clp = segs.filter((s) => s.tag === "CLP");
	const svc = segs.filter(
		(s) => s.tag === "SVC" || s.tag === "SV1" || s.tag === "SV2"
	);
	const bpr = segs.find((s) => s.tag === "BPR");
	const paymentTotal = bpr?.elements[2] ? Number(bpr.elements[2]) : null;

	let paidClaims = 0;
	let deniedOrSecondary = 0;
	for (const c of clp) {
		const status = c.elements[2];
		if (status === "1" || status === "2" || status === "3") paidClaims += 1;
		else deniedOrSecondary += 1;
	}

	const casCounts = new Map<string, number>();
	for (const s of segs) {
		if (s.tag !== "CAS") continue;
		const group = s.elements[1] ?? "";
		const reason = s.elements[2] ?? "";
		const key = `${group}*${reason}`;
		casCounts.set(key, (casCounts.get(key) ?? 0) + 1);
	}
	const topCasCodes = Array.from(casCounts.entries())
		.map(([code, count]) => ({ code, count }))
		.sort((a, b) => b.count - a.count)
		.slice(0, 5);

	return {
		transactionSet: doc.transactionSet ?? "Unknown",
		guide: doc.guide,
		segmentCount: segs.length,
		claimCount: Math.max(clm.length, clp.length),
		serviceLineCount: svc.length,
		paymentTotal: Number.isFinite(paymentTotal) ? paymentTotal : null,
		paidClaims,
		deniedOrSecondary,
		topCasCodes,
	};
}

export function findSegmentIndexes(
	doc: X12Document,
	query: string
): number[] {
	const q = query.trim().toLowerCase();
	if (!q) return [];
	const hits: number[] = [];
	for (const seg of doc.segments) {
		if (seg.raw.toLowerCase().includes(q)) hits.push(seg.index);
	}
	return hits;
}
