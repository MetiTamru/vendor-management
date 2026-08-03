"use client";

import { useCallback } from "react";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	type EdiFixtureKey,
	EdiViewerLoader,
	loadEdiFixture,
} from "@/features/admin/features/claim-encounter/edi";

export function EdiViewerDialog({
	open,
	onOpenChange,
	fixture,
	fileName,
	title = "EDI Viewer",
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	fixture: EdiFixtureKey;
	fileName?: string;
	title?: string;
}) {
	const load = useCallback(() => loadEdiFixture(fixture), [fixture]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="flex max-h-[90vh] max-w-5xl flex-col gap-3 overflow-hidden p-4 sm:max-w-5xl">
				<DialogHeader>
					<DialogTitle className="text-base">{title}</DialogTitle>
				</DialogHeader>
				<div className="min-h-0 flex-1 overflow-hidden">
					{open ? (
						<EdiViewerLoader
							load={load}
							fileName={fileName}
							className="h-[70vh]"
						/>
					) : null}
				</div>
			</DialogContent>
		</Dialog>
	);
}
