import type { ApiClaimEncounterRecordDto } from "../dto/claimEncounterRecordDto";
import type { ClaimEncounterModel } from "../../feature/types/claimEncounterModel";

export function toClaimEncounterModel(
	row: ApiClaimEncounterRecordDto,
	index = 0
): ClaimEncounterModel {
	const id = row.id != null ? String(row.id) : `claim-encounter-${index}`;
	const name =
		typeof row.name === "string" && row.name.length > 0 ? row.name : "—";
	return { id, name };
}
