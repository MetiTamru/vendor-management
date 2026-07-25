import { z } from "zod";

import adminComponentPolicies from "./policies/admin-components.json";
import documentAccessPolicy from "./policies/document-access.json";

// 1. Enhanced Type Definitions
export type Condition =
	| { type: "allOf"; conditions: Condition[] }
	| { type: "anyOf"; conditions: Condition[] }
	| { type: "not"; condition: Condition }
	| { type: "attribute"; attribute: string; operator: string; value?: any }; // `value` is optional

export type PolicyTarget = {
	roles?: string[];
	resources: string[];
	actions: string[];
};

export type Policy = {
	id: string;
	effect: "allow" | "deny";
	description?: string;
	priority: number;
	target: PolicyTarget;
	conditions: Condition;
};

export type AttributeContext = {
	action: string;
	user: {
		id: string;
		roles: string[];
		attributes: Record<string, any>;
		[key: string]: any; // Index signature
	};
	resource: {
		type: string;
		id?: string;
		attributes: Record<string, any>;
		[key: string]: any; // Index signature
	};
	environment: {
		time: string;
		ip?: string;
		location?: string;
		[key: string]: any; // Index signature
	};
	// Optional healthcare-specific contexts
	patient?: {
		id?: string;
		attributes?: Record<string, any>;
		[key: string]: any;
	};
	encounter?: {
		id?: string;
		attributes?: Record<string, any>;
		[key: string]: any;
	};
	organization?: {
		id?: string;
		attributes?: Record<string, any>;
		[key: string]: any;
	};
	consent?: {
		id?: string;
		attributes?: Record<string, any>;
		[key: string]: any;
	};
};

export type EvaluationResult = {
	allowed: boolean;
	decision: "allow" | "deny" | "none";
	matchedPolicies: Array<{
		id: string;
		effect: "allow" | "deny";
		description?: string;
	}>;
	allowedBy?: string;
	deniedBy?: string;
};

export const conditionSchema: z.ZodType<Condition> = z.lazy(() =>
	z.discriminatedUnion("type", [
		z.object({
			type: z.literal("allOf"),
			conditions: z.array(conditionSchema),
		}),
		z.object({
			type: z.literal("anyOf"),
			conditions: z.array(conditionSchema),
		}),
		z.object({
			type: z.literal("not"),
			condition: conditionSchema,
		}),
		z.object({
			type: z.literal("attribute"),
			attribute: z.string(),
			operator: z.string(),
			value: z.any(), // `value` is required
		}),
	])
);

export const policySchema = z.object({
	id: z.string(),
	effect: z.enum(["allow", "deny"]),
	description: z.string().optional(),
	priority: z.number().int().positive(),
	target: z.object({
		roles: z.array(z.string()).optional(),
		resources: z.array(z.string()).nonempty(),
		actions: z.array(z.string()).nonempty(),
	}),
	conditions: conditionSchema,
});

function parsePolicyFile(raw: unknown): Policy[] {
	if (Array.isArray(raw)) {
		return z.array(policySchema).parse(raw);
	}

	if (raw && typeof raw === "object" && "policies" in raw) {
		return z.array(policySchema).parse((raw as { policies: unknown }).policies);
	}

	return z.array(policySchema).parse([raw]);
}

export const parsedPolicies = [
	...parsePolicyFile(documentAccessPolicy),
	...parsePolicyFile(adminComponentPolicies),
];
