import type { ApiUserDto } from "../../dto/user.dto";

export const MOCK_USERS: ApiUserDto[] = [
	{
		id: "usr-1",
		email: "alice@example.com",
		name: "Alice Admin",
		roles: ["admin"],
		is_active: true,
	},
	{
		id: "usr-2",
		email: "bob@example.com",
		name: "Bob Manager",
		roles: ["manager"],
		is_active: true,
	},
	{
		id: "usr-3",
		email: "carol@example.com",
		name: "Carol User",
		roles: ["user"],
		is_active: false,
	},
];
