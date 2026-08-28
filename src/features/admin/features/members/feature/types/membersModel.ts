export type MembersModel = {
	id: string;
	name: string;
};

export type MembersListResult = {
	items: MembersModel[];
	total: number;
};

/** UI models for Member Accumulators tab (camelCase). */
export type {
	AccumulatorAmountTriple,
	AccumulatorKpi,
	AccumulatorRow,
	AccumulatorSummary,
	AccumulatorTableRow,
	AccumulatorTransaction,
} from "@/features/admin/features/members/mock-data";
