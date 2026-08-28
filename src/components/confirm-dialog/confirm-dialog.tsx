"use client";

import {
	type ReactNode,
	createContext,
	useCallback,
	useContext,
	useMemo,
	useRef,
	useState,
} from "react";

import { AlertTriangle, Archive, Info, Trash2 } from "lucide-react";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export type ConfirmVariant = "default" | "destructive" | "warning";

export type ConfirmOptions = {
	title: string;
	description?: ReactNode;
	confirmLabel?: string;
	cancelLabel?: string;
	variant?: ConfirmVariant;
	/** Visual cue — archive (box) vs delete (trash). Defaults from variant. */
	icon?: "info" | "warning" | "archive" | "delete";
};

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

export function useConfirm(): ConfirmFn {
	const ctx = useContext(ConfirmContext);
	if (!ctx) {
		throw new Error("useConfirm must be used within ConfirmDialogProvider");
	}
	return ctx;
}

/** Prefer `useConfirm`. Falls back to `window.confirm` outside the provider. */
export function useConfirmOptional(): ConfirmFn {
	const ctx = useContext(ConfirmContext);
	return (
		ctx ??
		((options) => {
			const text = [
				options.title,
				typeof options.description === "string" ? options.description : "",
			]
				.filter(Boolean)
				.join("\n\n");
			return Promise.resolve(window.confirm(text));
		})
	);
}

const VARIANT_UI: Record<
	ConfirmVariant,
	{
		iconWrap: string;
		icon: string;
		action: string;
		defaultIcon: NonNullable<ConfirmOptions["icon"]>;
		defaultConfirm: string;
	}
> = {
	default: {
		iconWrap: "bg-primary/10 text-primary",
		icon: "text-primary",
		action: "",
		defaultIcon: "info",
		defaultConfirm: "Continue",
	},
	warning: {
		iconWrap: "bg-amber-500/12 text-amber-700 dark:text-amber-400",
		icon: "text-amber-600 dark:text-amber-400",
		action:
			"bg-amber-600 text-white hover:bg-amber-600/90 focus-visible:ring-amber-600/30",
		defaultIcon: "warning",
		defaultConfirm: "Confirm",
	},
	destructive: {
		iconWrap: "bg-destructive/10 text-destructive",
		icon: "text-destructive",
		action:
			"bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
		defaultIcon: "archive",
		defaultConfirm: "Confirm",
	},
};

function ConfirmIcon({
	name,
	className,
}: {
	name: NonNullable<ConfirmOptions["icon"]>;
	className?: string;
}) {
	const Icon =
		name === "delete"
			? Trash2
			: name === "archive"
				? Archive
				: name === "warning"
					? AlertTriangle
					: Info;
	return <Icon className={cn("size-5", className)} aria-hidden />;
}

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
	const [open, setOpen] = useState(false);
	const [options, setOptions] = useState<ConfirmOptions | null>(null);
	const resolverRef = useRef<((value: boolean) => void) | null>(null);

	const finish = useCallback((value: boolean) => {
		const resolve = resolverRef.current;
		resolverRef.current = null;
		setOpen(false);
		resolve?.(value);
	}, []);

	const confirm = useCallback<ConfirmFn>((opts) => {
		// Resolve any prior pending confirm as cancelled (rare race).
		resolverRef.current?.(false);
		setOptions(opts);
		setOpen(true);
		return new Promise<boolean>((resolve) => {
			resolverRef.current = resolve;
		});
	}, []);

	const variant = options?.variant ?? "default";
	const ui = VARIANT_UI[variant];
	const iconName = options?.icon ?? ui.defaultIcon;

	const value = useMemo(() => confirm, [confirm]);

	return (
		<ConfirmContext.Provider value={value}>
			{children}
			<AlertDialog
				open={open}
				onOpenChange={(next) => {
					if (!next) finish(false);
				}}
			>
				<AlertDialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
					<div className="space-y-4 p-6 pb-5">
						<div
							className={cn(
								"flex size-11 items-center justify-center rounded-xl",
								ui.iconWrap
							)}
						>
							<ConfirmIcon name={iconName} className={ui.icon} />
						</div>
						<AlertDialogHeader className="gap-2 text-left">
							<AlertDialogTitle className="text-base leading-snug">
								{options?.title}
							</AlertDialogTitle>
							{options?.description ? (
								<AlertDialogDescription className="text-sm leading-relaxed">
									{options.description}
								</AlertDialogDescription>
							) : (
								<AlertDialogDescription className="sr-only">
									Confirm this action
								</AlertDialogDescription>
							)}
						</AlertDialogHeader>
					</div>
					<AlertDialogFooter className="border-t bg-muted/30 px-6 py-4 sm:justify-end">
						<AlertDialogCancel onClick={() => finish(false)} className="mt-0">
							{options?.cancelLabel ?? "Cancel"}
						</AlertDialogCancel>
						<AlertDialogAction
							className={cn(ui.action)}
							onClick={(e) => {
								e.preventDefault();
								finish(true);
							}}
						>
							{options?.confirmLabel ?? ui.defaultConfirm}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</ConfirmContext.Provider>
	);
}
