"use client";

import { Archive, CheckCircle2, Download, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BulkActionsToolbarProps = {
	selectedCount: number;
	entityLabel: string;
	onClear: () => void;
	/** Real export handler only — omit the button when not wired. */
	onExport?: () => void;
	onApprove?: () => void;
	onReject?: () => void;
	onArchive?: () => void;
	className?: string;
};

export function BulkActionsToolbar({
	selectedCount,
	entityLabel,
	onClear,
	onExport,
	onApprove,
	onReject,
	onArchive,
	className,
}: BulkActionsToolbarProps) {
	if (selectedCount === 0) return null;

	return (
		<div
			className={cn(
				"flex flex-wrap items-center justify-between gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2",
				className
			)}
		>
			<p className="text-xs font-medium">
				{selectedCount} {entityLabel}
				{selectedCount === 1 ? "" : "s"} selected
				<button
					type="button"
					className="ml-2 text-primary underline-offset-2 hover:underline"
					onClick={onClear}
				>
					Clear
				</button>
			</p>
			<div className="flex flex-wrap items-center gap-1.5">
				{onApprove ? (
					<Button
						size="sm"
						variant="outline"
						className="h-8 text-xs"
						onClick={onApprove}
					>
						<CheckCircle2 className="mr-1.5 size-3.5" />
						Approve
					</Button>
				) : null}
				{onReject ? (
					<Button
						size="sm"
						variant="outline"
						className="h-8 text-xs"
						onClick={onReject}
					>
						<XCircle className="mr-1.5 size-3.5" />
						Reject
					</Button>
				) : null}
				{onArchive ? (
					<Button
						size="sm"
						variant="outline"
						className="h-8 text-xs"
						onClick={onArchive}
					>
						<Archive className="mr-1.5 size-3.5" />
						Archive
					</Button>
				) : null}
				{onExport ? (
					<Button
						size="sm"
						variant="outline"
						className="h-8 text-xs"
						onClick={onExport}
					>
						<Download className="mr-1.5 size-3.5" />
						Export
					</Button>
				) : null}
			</div>
		</div>
	);
}
