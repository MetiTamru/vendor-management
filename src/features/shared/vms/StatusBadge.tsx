import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
	success: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
	failed: "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200",
	late: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
	missing: "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200",
	warning: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
	inbound: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
	outbound: "bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-200",
	processing: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
	// vendor
	prospect: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
	invited: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
	onboarding: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
	under_review: "bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-200",
	active: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
	suspended: "bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-200",
	offboarded: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
	// shared
	draft: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
	pending: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
	pending_approval: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
	approved: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
	rejected: "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200",
	expired: "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200",
	expiring: "bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-200",
	valid: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
	published: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
	closed: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
	evaluating: "bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-200",
	awarded: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
	cancelled: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
	sent: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
	acknowledged: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
	partially_received: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
	received: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
	submitted: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
	matched: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
	exception: "bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-200",
	disputed: "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200",
	paid: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
	in_progress: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
	not_started: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
	changes_requested: "bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-200",
	terminated: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
	low: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
	medium: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
	high: "bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-200",
	critical: "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200",
};

function formatLabel(status: string) {
	return status.replace(/_/g, " ");
}

type StatusBadgeProps = {
	status: string;
	className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
	const style = STATUS_STYLES[status] ?? STATUS_STYLES.draft;
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium capitalize",
				style,
				className
			)}
		>
			{formatLabel(status)}
		</span>
	);
}
