import { z } from "zod";

import { groupFormSchema } from "./group-form.schema";

export const groupBusinessSchema = groupFormSchema.superRefine((data, ctx) => {
	if (data.membershipMode === "enumerated" && data.members.length === 0) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: "Enumerated groups require at least one member",
			path: ["members"],
		});
	}

	if (
		data.membershipMode === "definitional" &&
		data.characteristics.length === 0
	) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: "Definitional groups require at least one characteristic rule",
			path: ["characteristics"],
		});
	}
});

export type GroupBusinessValues = z.output<typeof groupBusinessSchema>;
