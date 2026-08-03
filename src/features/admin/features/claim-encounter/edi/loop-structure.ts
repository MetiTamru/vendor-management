import type { X12Document, X12Segment } from "./parse-x12";

export type LoopKind =
	| "ISA"
	| "GS"
	| "ST"
	| "HL"
	| "CLM"
	| "CLP"
	| "LX"
	| "SVC"
	| "N1"
	| "NM1"
	| "other";

export type StructuredSegment = {
	segment: X12Segment;
	depth: number;
	loopKind: LoopKind;
	/** True when this segment starts a collapsible group. */
	isCollapseRoot: boolean;
	/** Inclusive end index of this collapse group (segment.index). */
	groupEnd: number;
	label: string;
};

const COLLAPSE_TAGS = new Set([
	"ISA",
	"GS",
	"ST",
	"HL",
	"CLM",
	"CLP",
	"LX",
	"SVC",
	"SV1",
	"SV2",
	"N1",
	"NM1",
]);

function loopKindFor(tag: string): LoopKind {
	if (tag === "SV1" || tag === "SV2") return "SVC";
	if (
		tag === "ISA" ||
		tag === "GS" ||
		tag === "ST" ||
		tag === "HL" ||
		tag === "CLM" ||
		tag === "CLP" ||
		tag === "LX" ||
		tag === "SVC" ||
		tag === "N1" ||
		tag === "NM1"
	) {
		return tag;
	}
	return "other";
}

function depthFor837(tag: string, hlLevel: number): number {
	if (tag === "ISA") return 0;
	if (tag === "GS" || tag === "GE" || tag === "IEA") return 1;
	if (tag === "ST" || tag === "SE") return 2;
	if (tag === "BHT" || tag === "NM1" || tag === "PER") return 3;
	if (tag === "HL") return 3 + Math.min(hlLevel, 3);
	if (tag === "CLM") return 5;
	if (tag === "LX") return 6;
	if (tag === "SV1" || tag === "SV2" || tag === "SVC") return 7;
	if (tag === "CAS" || tag === "SVD" || tag === "AMT") return 8;
	return 4;
}

function depthFor835(tag: string): number {
	if (tag === "ISA") return 0;
	if (tag === "GS" || tag === "GE" || tag === "IEA") return 1;
	if (tag === "ST" || tag === "SE") return 2;
	if (
		tag === "BPR" ||
		tag === "TRN" ||
		tag === "REF" ||
		tag === "DTM"
	)
		return 3;
	if (tag === "N1" || tag === "N3" || tag === "N4" || tag === "PER") return 3;
	if (tag === "LX") return 3;
	if (tag === "CLP") return 4;
	if (tag === "NM1") return 5;
	if (tag === "SVC" || tag === "SV1" || tag === "SV2") return 5;
	if (tag === "CAS" || tag === "AMT" || tag === "LQ") return 6;
	return 4;
}

function findGroupEnd(
	segments: X12Segment[],
	start: number,
	rootTag: string
): number {
	const closerFor: Record<string, string | null> = {
		ISA: "IEA",
		GS: "GE",
		ST: "SE",
		HL: null,
		CLM: null,
		CLP: null,
		LX: null,
		SVC: null,
		SV1: null,
		SV2: null,
		N1: null,
		NM1: null,
	};

	const peerBreakers: Record<string, string[]> = {
		HL: ["HL", "ST", "SE", "GE", "IEA"],
		CLM: ["CLM", "HL", "ST", "SE"],
		CLP: ["CLP", "LX", "ST", "SE", "GE"],
		LX: ["LX", "ST", "SE", "GE", "CLP"],
		SVC: ["SVC", "SV1", "SV2", "CLP", "CLM", "LX", "ST", "SE"],
		SV1: ["SVC", "SV1", "SV2", "CLP", "CLM", "LX", "ST", "SE"],
		SV2: ["SVC", "SV1", "SV2", "CLP", "CLM", "LX", "ST", "SE"],
		N1: ["N1", "LX", "CLP", "ST", "SE", "GE"],
		NM1: ["NM1", "CLM", "CLP", "HL", "LX", "SVC", "SV1", "SV2", "ST", "SE"],
	};

	const closer = closerFor[rootTag];
	if (closer) {
		for (let i = start + 1; i < segments.length; i++) {
			if (segments[i]!.tag === closer) return i;
		}
		return segments.length - 1;
	}

	const breakers = peerBreakers[rootTag] ?? [];
	for (let i = start + 1; i < segments.length; i++) {
		const tag = segments[i]!.tag;
		if (breakers.includes(tag)) return i - 1;
	}
	return segments.length - 1;
}

function groupLabel(seg: X12Segment): string {
	const tag = seg.tag;
	if (tag === "ST") return `ST ${seg.elements[1] ?? ""} #${seg.elements[2] ?? ""}`.trim();
	if (tag === "HL")
		return `HL ${seg.elements[1] ?? ""} lvl ${seg.elements[3] ?? ""}`;
	if (tag === "CLM") return `Claim ${seg.elements[1] ?? ""}`;
	if (tag === "CLP") return `Payment ${seg.elements[1] ?? ""}`;
	if (tag === "LX") return `LX ${seg.elements[1] ?? ""}`;
	if (tag === "SVC" || tag === "SV1" || tag === "SV2")
		return `Service ${seg.elements[1] ?? ""}`;
	if (tag === "N1") return `N1 ${seg.elements[1] ?? ""} ${seg.elements[2] ?? ""}`.trim();
	if (tag === "NM1")
		return `NM1 ${seg.elements[1] ?? ""} ${seg.elements[3] ?? ""}`.trim();
	if (tag === "GS") return `GS ${seg.elements[1] ?? ""}`;
	if (tag === "ISA") return "Interchange";
	return tag;
}

export function structureDocument(doc: X12Document): StructuredSegment[] {
	const is835 = doc.transactionSet === "835" || doc.functionalId === "HP";
	const result: StructuredSegment[] = [];
	let currentHlLevel = 0;

	for (const seg of doc.segments) {
		if (seg.tag === "HL") {
			currentHlLevel = Number(seg.elements[3] ?? 0) || 0;
		}

		const depth = is835
			? depthFor835(seg.tag)
			: depthFor837(seg.tag, currentHlLevel);

		const isCollapseRoot = COLLAPSE_TAGS.has(seg.tag);
		const groupEnd = isCollapseRoot
			? findGroupEnd(doc.segments, seg.index, seg.tag)
			: seg.index;

		result.push({
			segment: seg,
			depth,
			loopKind: loopKindFor(seg.tag),
			isCollapseRoot,
			groupEnd,
			label: groupLabel(seg),
		});
	}

	return result;
}

export function defaultCollapsedIds(
	structured: StructuredSegment[],
	transactionSet: string | null
): Set<number> {
	const collapsed = new Set<number>();
	if (transactionSet === "835") {
		let clpCount = 0;
		for (const row of structured) {
			if (row.segment.tag === "CLP") {
				clpCount += 1;
				if (clpCount > 3) collapsed.add(row.segment.index);
			}
			if (row.segment.tag === "LX" || row.segment.tag === "SVC") {
				collapsed.add(row.segment.index);
			}
		}
	} else {
		for (const row of structured) {
			if (
				row.segment.tag === "HL" ||
				row.segment.tag === "CLM" ||
				row.segment.tag === "SV1" ||
				row.segment.tag === "SV2" ||
				row.segment.tag === "SVC" ||
				row.segment.tag === "NM1"
			) {
				collapsed.add(row.segment.index);
			}
		}
	}
	return collapsed;
}

/** Collapse every collapsible loop root (toolbar Collapse). */
export function allCollapsedIds(structured: StructuredSegment[]): Set<number> {
	const collapsed = new Set<number>();
	for (const row of structured) {
		if (row.isCollapseRoot && row.groupEnd > row.segment.index) {
			collapsed.add(row.segment.index);
		}
	}
	return collapsed;
}

export function visibleStructuredRows(
	structured: StructuredSegment[],
	collapsed: Set<number>
): StructuredSegment[] {
	if (collapsed.size === 0) return structured;

	const hidden = new Set<number>();
	for (const row of structured) {
		if (!row.isCollapseRoot || !collapsed.has(row.segment.index)) continue;
		if (row.groupEnd <= row.segment.index) continue;
		for (let i = row.segment.index + 1; i <= row.groupEnd; i++) {
			hidden.add(i);
		}
	}
	return structured.filter((row) => !hidden.has(row.segment.index));
}

/**
 * Extract raw X12 for a single claim loop (by 0-based claim order in the file).
 * Prefer ST…SE for 837 multi-transaction files; otherwise CLM/CLP…next peer.
 */
export function extractClaimRaw(
	doc: X12Document,
	claimOrdinal: number
): { raw: string; claimControlId: string; label: string } | null {
	const claimTags = new Set(["CLM", "CLP"]);
	const claimSegs = doc.segments.filter((s) => claimTags.has(s.tag));
	const claim = claimSegs[claimOrdinal];
	if (!claim) return null;

	const claimControlId = claim.elements[1] ?? `claim-${claimOrdinal + 1}`;

	// Prefer enclosing ST…SE
	let start = claim.index;
	let end = claim.index;
	for (let i = claim.index; i >= 0; i--) {
		if (doc.segments[i]!.tag === "ST") {
			start = i;
			break;
		}
	}
	for (let i = claim.index; i < doc.segments.length; i++) {
		if (doc.segments[i]!.tag === "SE") {
			end = i;
			break;
		}
		end = i;
	}

	// If no ST found near claim, use CLM/CLP group bounds
	if (doc.segments[start]!.tag !== "ST") {
		const structured = structureDocument(doc);
		const root = structured.find((r) => r.segment.index === claim.index);
		start = claim.index;
		end = root?.groupEnd ?? claim.index;
		// include a bit of header context: go back to HL or previous NM1 block start
		for (let i = claim.index; i >= 0; i--) {
			const tag = doc.segments[i]!.tag;
			if (tag === "HL" || tag === "LX") {
				start = i;
				break;
			}
		}
	}

	const slice = doc.segments.slice(start, end + 1);
	const segChar = doc.delimiters.segment;
	const raw = slice.map((s) => s.raw).join(segChar) + segChar;
	return {
		raw,
		claimControlId,
		label: `${claim.tag} ${claimControlId}`,
	};
}

export function listClaimControls(doc: X12Document): string[] {
	return doc.segments
		.filter((s) => s.tag === "CLM" || s.tag === "CLP")
		.map((s, i) => s.elements[1] ?? `claim-${i + 1}`);
}
