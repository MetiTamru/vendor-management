import { z } from "zod";

export const apiMembersRecordSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional().nullable(),
		name: z.string().optional().nullable(),
		memberId: z.string().optional().nullable(),
		firstName: z.string().optional().nullable(),
		middleName: z.string().optional().nullable(),
		lastName: z.string().optional().nullable(),
		program: z.string().optional().nullable(),
		planName: z.string().optional().nullable(),
		status: z.string().optional().nullable(),
		eligibilityLabel: z.string().optional().nullable(),
		accountGroup: z.string().optional().nullable(),
		alternateId: z.string().optional().nullable(),
	})
	.passthrough();

export const membersCreateSchema = z.object({
	memberId: z.string().min(1, "Member ID is required"),
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	program: z.enum(["MDH", "DHCF", "BHP"]),
	planName: z.string().min(1, "Plan name is required"),
});

export const membersUpdateSchema = membersCreateSchema.partial().extend({
	status: z.enum(["active", "inactive", "pending", "termed"]).optional(),
	eligibilityLabel: z
		.enum(["Active", "Inactive", "Pending", "Termed"])
		.optional(),
	accountGroup: z.string().optional(),
	alternateId: z.string().optional(),
});

export function parseMembersList(payload: unknown): {
	data: z.infer<typeof apiMembersRecordSchema>[];
	total: number;
} {
	const paginated = z
		.object({
			results: z.array(apiMembersRecordSchema).optional(),
			data: z.array(apiMembersRecordSchema).optional(),
			count: z.number().optional(),
			total: z.number().optional(),
		})
		.safeParse(payload);

	if (paginated.success) {
		const rows = paginated.data.results ?? paginated.data.data ?? [];
		return {
			data: rows,
			total: paginated.data.count ?? paginated.data.total ?? rows.length,
		};
	}

	if (Array.isArray(payload)) {
		const rows = payload
			.map((row) => apiMembersRecordSchema.safeParse(row))
			.filter((r) => r.success)
			.map((r) => r.data);
		return { data: rows, total: rows.length };
	}

	return { data: [], total: 0 };
}
