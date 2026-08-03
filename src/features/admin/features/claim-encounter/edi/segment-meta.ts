export type SegmentRole =
	| "envelope"
	| "money"
	| "party"
	| "clinical"
	| "adjustment"
	| "reference"
	| "hierarchy"
	| "default";

const ROLE_BY_TAG: Record<string, SegmentRole> = {
	ISA: "envelope",
	GS: "envelope",
	ST: "envelope",
	SE: "envelope",
	GE: "envelope",
	IEA: "envelope",
	BPR: "money",
	TRN: "money",
	CLP: "money",
	CLM: "money",
	AMT: "money",
	SVD: "money",
	NM1: "party",
	N1: "party",
	N3: "party",
	N4: "party",
	PER: "party",
	SVC: "clinical",
	SV1: "clinical",
	SV2: "clinical",
	HI: "clinical",
	CL1: "clinical",
	LQ: "clinical",
	CAS: "adjustment",
	REF: "reference",
	DTM: "reference",
	DTP: "reference",
	HL: "hierarchy",
	LX: "hierarchy",
	BHT: "hierarchy",
	SBR: "hierarchy",
	PRV: "party",
	DMG: "party",
	OI: "reference",
};

export function segmentRole(tag: string): SegmentRole {
	return ROLE_BY_TAG[tag] ?? "default";
}

export const SEGMENT_ROLE_CLASS: Record<SegmentRole, string> = {
	envelope: "text-muted-foreground",
	money: "text-primary font-semibold",
	party: "text-sky-700 dark:text-sky-300",
	clinical: "text-teal-700 dark:text-teal-300",
	adjustment: "text-amber-700 dark:text-amber-300",
	reference: "text-slate-500 dark:text-slate-400",
	hierarchy: "text-violet-700 dark:text-violet-300",
	default: "text-foreground",
};

export const SEGMENT_ROLE_BADGE: Record<SegmentRole, string> = {
	envelope: "bg-muted text-muted-foreground",
	money: "bg-primary/15 text-primary",
	party: "bg-sky-500/15 text-sky-800 dark:text-sky-200",
	clinical: "bg-teal-500/15 text-teal-800 dark:text-teal-200",
	adjustment: "bg-amber-500/15 text-amber-900 dark:text-amber-100",
	reference: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
	hierarchy: "bg-violet-500/15 text-violet-800 dark:text-violet-200",
	default: "bg-muted text-foreground",
};

export const SEGMENT_LABELS: Record<string, string> = {
	ISA: "Interchange Control Header",
	GS: "Functional Group Header",
	ST: "Transaction Set Header",
	SE: "Transaction Set Trailer",
	GE: "Functional Group Trailer",
	IEA: "Interchange Control Trailer",
	BHT: "Beginning of Hierarchical Transaction",
	BPR: "Financial Information",
	TRN: "Reassociation Trace Number",
	CLM: "Claim Information",
	CLP: "Claim Payment Info",
	SVC: "Service Payment Info",
	SV1: "Professional Service",
	SV2: "Institutional Service",
	CAS: "Claims Adjustment",
	NM1: "Individual or Org Name",
	N1: "Party Identification",
	HL: "Hierarchical Level",
	LX: "Transaction Set Line Number",
	HI: "Health Care Diagnosis Code",
	CL1: "Claim Codes (Institutional)",
	REF: "Reference Identification",
	DTM: "Date/Time Reference",
	DTP: "Date or Time Period",
	AMT: "Monetary Amount",
	SVD: "Service Line Adjudication",
	PRV: "Provider Information",
	SBR: "Subscriber Information",
	PER: "Admin Communications Contact",
};

export function segmentDescription(tag: string): string {
	return SEGMENT_LABELS[tag] ?? "X12 Segment";
}
