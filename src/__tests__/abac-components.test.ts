import { PolicyEngine } from "@/permissions/abac/engine";
import type { AttributeContext } from "@/permissions/abac/types";

function componentContext(
	userId: string,
	userRoles: string[],
	componentName: string,
	action: "view" | "delete" = "view"
): AttributeContext {
	return {
		action,
		user: {
			id: userId,
			roles: userRoles,
			attributes: {},
		},
		resource: {
			type: "component",
			attributes: { name: componentName },
		},
		environment: {
			time: "12:00:00",
		},
	};
}

describe("ABAC admin components", () => {
	beforeEach(() => {
		PolicyEngine.clearCache();
		PolicyEngine.initialize();
	});

	it("admin can view groups-create and delete groups-delete", () => {
		expect(
			PolicyEngine.evaluate(
				componentContext("admin-user", ["admin"], "groups-create", "view")
			)
		).toBe(true);
		expect(
			PolicyEngine.evaluate(
				componentContext("admin-user", ["admin"], "groups-delete", "delete")
			)
		).toBe(true);
	});

	it("manager can view groups-list but not groups-create or groups-delete", () => {
		expect(
			PolicyEngine.evaluate(
				componentContext("manager-user", ["manager"], "groups-list", "view")
			)
		).toBe(true);
		expect(
			PolicyEngine.evaluate(
				componentContext("manager-user", ["manager"], "groups-create", "view")
			)
		).toBe(false);
		expect(
			PolicyEngine.evaluate(
				componentContext("manager-user", ["manager"], "groups-delete", "delete")
			)
		).toBe(false);
	});

	it("manager can view groups-edit denied", () => {
		expect(
			PolicyEngine.evaluate(
				componentContext("manager-user", ["manager"], "groups-edit", "view")
			)
		).toBe(false);
	});
});
