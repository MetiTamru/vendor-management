import type { ScorecardModel } from "@/features/shared/vms/types";

import type { ApiPerformanceDto } from "../dto/performanceDto";

/** VMS records already use the frontend model shape. */
export function toPerformanceModel(dto: ApiPerformanceDto): ScorecardModel {
	return dto;
}
