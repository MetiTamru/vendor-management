import { z } from "zod";

const memberSchema = z.object({
	externalId: z.string().nullable().optional(),
	displayName: z.string().min(1, "Member name is required"),
	role: z.string().nullable().optional(),
});

const characteristicSchema = z.object({
	key: z.string().min(1, "Characteristic key is required"),
	operator: z.enum(["eq", "neq", "in", "gte", "lte"]),
	value: z.union([z.string(), z.number(), z.array(z.string())]),
});

export const groupFormSchema = z
	.object({
		name: z.string().min(2, "Name must be at least 2 characters"),
		description: z.string().nullable().optional(),
		membershipMode: z.enum(["enumerated", "definitional"]),
		members: z.array(memberSchema),
		characteristics: z.array(characteristicSchema),
		periodStart: z.string().nullable().optional(),
		periodEnd: z.string().nullable().optional(),
	})
	.superRefine((data, ctx) => {
		if (
			data.periodStart &&
			data.periodEnd &&
			data.periodStart > data.periodEnd
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Period start must be before period end",
				path: ["periodEnd"],
			});
		}
	});

export type GroupFormValues = z.input<typeof groupFormSchema>;
export type GroupFormOutput = z.output<typeof groupFormSchema>;
