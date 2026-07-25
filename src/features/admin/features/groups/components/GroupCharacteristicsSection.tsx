"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { GroupModel } from "../types/group.types";

export function GroupCharacteristicsSection({ group }: { group: GroupModel }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Characteristics ({group.characteristics.length})</CardTitle>
			</CardHeader>
			<CardContent>
				{group.characteristics.length === 0 ? (
					<p className="text-sm text-muted-foreground">
						No characteristic rules defined.
					</p>
				) : (
					<ul className="space-y-2 text-sm font-mono">
						{group.characteristics.map((rule) => (
							<li key={rule.id}>
								{rule.key} {rule.operator} {JSON.stringify(rule.value)}
							</li>
						))}
					</ul>
				)}
			</CardContent>
		</Card>
	);
}
