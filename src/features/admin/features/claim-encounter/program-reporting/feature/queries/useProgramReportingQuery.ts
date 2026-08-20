"use client";

import { featureQueryKey } from "@/features/admin/shared/feature-contract";

import {
	getAuditData,
	getOverviewData,
	getProgramScale,
	getSubmissionsData,
} from "../api/program-reportingApi";

const domain = "program-reporting";

export * from "../types/program-reportingModel";
export type { ProgramType } from "../types/program-reportingModel";
