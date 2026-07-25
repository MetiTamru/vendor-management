"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { GroupModel } from "../types/group.types";

export function GroupDetailCard({ group }: { group: GroupModel }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Overview</CardTitle>
			</CardHeader>
			<CardContent className="grid gap-2 text-sm">
				<p>
					<span className="font-medium">Mode:</span>{" "}
					<span className="capitalize">{group.membershipMode}</span>
				</p>
				<p>
					<span className="font-medium">Period:</span>{" "}
					{group.periodStart ?? "—"} → {group.periodEnd ?? "—"}
				</p>
				<p>
					<span className="font-medium">Active:</span>{" "}
					{group.isActive ? "Yes" : "No"}
				</p>
				<p>
					<span className="font-medium">Updated:</span>{" "}
					{new Date(group.updatedAt).toLocaleString()}
				</p>
			</CardContent>
		</Card>
	);
}
