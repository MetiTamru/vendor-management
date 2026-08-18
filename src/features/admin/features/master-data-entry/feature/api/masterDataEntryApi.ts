import { withMockOrRemote } from "@/lib/mock-mode";

import { SAVED_BASELINE_RECORDS } from "../../mock-data";
import type { ApiMasterDataEntryDto } from "../dto/masterDataEntryDto";

export async function listMasterDataEntry(): Promise<ApiMasterDataEntryDto[]> {
	return withMockOrRemote(
		() => SAVED_BASELINE_RECORDS,
		async () => []
	);
}
