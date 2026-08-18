import { FILE_RUNS } from "@/features/admin/features/file-management/mock-data";
import type { ProgramFileType } from "@/types/UI/system.types";

import { toSlaMonitoringModel } from "../mappers/slaMonitoringMappers";
import type { SlaMonitoringModel } from "../types/slaMonitoringModel";

/** Builds the frontend-only SLA view from file-run fixtures. */
export async function getSlaMonitoring(
	program: ProgramFileType
): Promise<SlaMonitoringModel> {
	return toSlaMonitoringModel(
		program,
		FILE_RUNS.filter((run) => run.program === program)
	);
}
