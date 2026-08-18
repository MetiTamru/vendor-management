"use client";

import { useQuery } from "@tanstack/react-query";

import { featureQueryKey } from "@/features/admin/shared/feature-contract";
import type { ProgramFileType } from "@/types/UI/system.types";

import { getSlaMonitoring } from "../api/slaMonitoringApi";

export function useSlaMonitoringQuery(program: ProgramFileType) {
	return useQuery({
		queryKey: featureQueryKey("sla-monitoring", "dashboard", program),
		queryFn: () => getSlaMonitoring(program),
	});
}

export const useSlaMonitoringDetailQuery = useSlaMonitoringQuery;
