import type { ApiIntegrationIntakeRecordDto } from "../dto/integrationIntakeRecordDto";
import type { IntegrationIntakeModel } from "../../feature/types/integrationIntakeModel";

export function toIntegrationIntakeModel(
	row: ApiIntegrationIntakeRecordDto,
	index = 0
): IntegrationIntakeModel {
	const id = row.id != null ? String(row.id) : `integration-intake-${index}`;
	const name =
		typeof row.name === "string" && row.name.length > 0 ? row.name : "—";
	return { id, name };
}
