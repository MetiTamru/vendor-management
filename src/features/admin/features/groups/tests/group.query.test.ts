import { filterGroups } from "../hooks/filter-groups";
import type { GroupModel } from "../types/group.types";

const sample: GroupModel[] = [
	{
		id: "1",
		name: "Alpha Team",
		description: "First",
		membershipMode: "enumerated",
		members: [],
		characteristics: [],
		periodStart: null,
		periodEnd: null,
		isActive: true,
		syncStatus: "synced",
		updatedAt: new Date().toISOString(),
	},
	{
		id: "2",
		name: "Beta Segment",
		description: null,
		membershipMode: "definitional",
		members: [],
		characteristics: [],
		periodStart: null,
		periodEnd: null,
		isActive: true,
		syncStatus: "pending",
		updatedAt: new Date().toISOString(),
	},
];

describe("filterGroups", () => {
	it("filters by search term", () => {
		const result = filterGroups(sample, {
			search: "alpha",
			membershipMode: "all",
		});
		expect(result).toHaveLength(1);
		expect(result[0]?.id).toBe("1");
	});

	it("filters by membership mode", () => {
		const result = filterGroups(sample, {
			search: "",
			membershipMode: "definitional",
		});
		expect(result).toHaveLength(1);
		expect(result[0]?.membershipMode).toBe("definitional");
	});
});
