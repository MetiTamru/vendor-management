import { groupBusinessSchema } from "../validation/group-business.schema";

describe("groupBusinessSchema", () => {
	it("requires members for enumerated mode", () => {
		const result = groupBusinessSchema.safeParse({
			name: "Enum group",
			membershipMode: "enumerated",
			members: [],
			characteristics: [],
		});
		expect(result.success).toBe(false);
	});

	it("requires characteristics for definitional mode", () => {
		const result = groupBusinessSchema.safeParse({
			name: "Def group",
			membershipMode: "definitional",
			members: [],
			characteristics: [],
		});
		expect(result.success).toBe(false);
	});

	it("validates period range", () => {
		const result = groupBusinessSchema.safeParse({
			name: "Dates",
			membershipMode: "enumerated",
			members: [{ displayName: "Bob" }],
			characteristics: [],
			periodStart: "2025-12-01",
			periodEnd: "2025-01-01",
		});
		expect(result.success).toBe(false);
	});
});
