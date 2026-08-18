"use client";

import { useMockClaimLinesQuery } from "../../feature/queries/useClaimEncounterQuery";

export const useClaimEncounterQuery = useMockClaimLinesQuery;
export function useClaimEncounterDetailQuery(_id: string) {
	return useMockClaimLinesQuery();
}
