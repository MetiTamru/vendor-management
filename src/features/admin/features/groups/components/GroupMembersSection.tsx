"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { GroupModel } from "../types/group.types";

export function GroupMembersSection({ group }: { group: GroupModel }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Members ({group.members.length})</CardTitle>
			</CardHeader>
			<CardContent>
				{group.members.length === 0 ? (
					<p className="text-sm text-muted-foreground">No members defined.</p>
				) : (
					<ul className="space-y-2 text-sm">
						{group.members.map((member) => (
							<li key={member.id} className="flex justify-between">
								<span>{member.displayName}</span>
								<span className="text-muted-foreground">
									{member.role ?? "—"}
								</span>
							</li>
						))}
					</ul>
				)}
			</CardContent>
		</Card>
	);
}
