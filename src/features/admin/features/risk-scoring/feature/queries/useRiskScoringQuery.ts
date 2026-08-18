"use client";

import { useQuery } from "@tanstack/react-query";

import { featureQueryKey } from "@/features/admin/shared/feature-contract";
import type { ProgramFileType } from "@/types/UI/system.types";

import { getRiskScoring } from "../api/riskScoringApi";

export function useRiskScoringQuery(program: ProgramFileType) {
	return useQuery({
		queryKey: featureQueryKey("risk-scoring", "dashboard", program),
		queryFn: () => getRiskScoring(program),
	});
}

export const useRiskScoringDetailQuery = useRiskScoringQuery;
