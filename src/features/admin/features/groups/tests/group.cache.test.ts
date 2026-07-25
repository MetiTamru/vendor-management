import "fake-indexeddb/auto";

import {
	listCachedGroups,
	putCachedGroup,
	replaceAllCachedGroups,
} from "../offline/group.cache";
import type { GroupModel } from "../types/group.types";

const sample: GroupModel = {
	id: "grp-1",
	name: "Alpha",
	description: null,
	membershipMode: "enumerated",
	members: [],
	characteristics: [],
	periodStart: null,
	periodEnd: null,
	isActive: true,
	syncStatus: "synced",
	updatedAt: new Date().toISOString(),
};

describe("group.cache", () => {
	it("round-trips a cached group", async () => {
		await putCachedGroup(sample);
		const list = await listCachedGroups();
		expect(list).toHaveLength(1);
		expect(list[0]?.name).toBe("Alpha");
	});

	it("replaceAllCachedGroups replaces remote snapshot", async () => {
		await replaceAllCachedGroups([sample]);
		const list = await listCachedGroups();
		expect(list).toHaveLength(1);
	});
});
