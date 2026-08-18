import type { ScorecardModel } from "@/features/shared/vms/types";

export type PerformanceModel = ScorecardModel;

export type PerformanceListResult = {
	items: ScorecardModel[];
	total: number;
};
