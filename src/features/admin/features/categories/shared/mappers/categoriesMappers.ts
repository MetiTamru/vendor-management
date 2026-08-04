import type { ApiCategoriesRecordDto } from "../dto/categoriesRecordDto";
import type { CategoriesModel } from "../../feature/types/categoriesModel";

export function toCategoriesModel(
	row: ApiCategoriesRecordDto,
	index = 0
): CategoriesModel {
	const id = row.id != null ? String(row.id) : `categories-${index}`;
	const name =
		typeof row.name === "string" && row.name.length > 0 ? row.name : "—";
	return { id, name };
}
