import type { ProgramFileType } from "@/types/UI/system.types";

import { toRiskScoringDashboardModel } from "../mappers/riskScoringMappers";
import type { RiskScoringDashboardModel } from "../types/riskScoringModel";

/** Computes frontend-only vendor risk scores from integration fixtures. */
export async function getRiskScoring(
	program: ProgramFileType
): Promise<RiskScoringDashboardModel> {
	return toRiskScoringDashboardModel(program);
}
