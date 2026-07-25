import type { ApiRoleDto } from "../../dto/role.dto";

export const MOCK_ROLES: ApiRoleDto[] = [
	{ id: "role-admin", name: "Admin", permissions: ["*"] },
	{
		id: "role-manager",
		name: "Manager",
		permissions: ["groups:read", "users:read"],
	},
	{ id: "role-user", name: "User", permissions: ["profile:read"] },
];
