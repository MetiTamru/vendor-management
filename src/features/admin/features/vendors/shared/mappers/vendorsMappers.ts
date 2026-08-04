import type { ApiVendorsRecordDto } from "../dto/vendorsRecordDto";
import type { VendorsModel } from "../../feature/types/vendorsModel";

export function toVendorsModel(
	row: ApiVendorsRecordDto,
	index = 0
): VendorsModel {
	const id = row.id != null ? String(row.id) : `vendors-${index}`;
	const name =
		typeof row.name === "string" && row.name.length > 0 ? row.name : "—";
	return { id, name };
}
