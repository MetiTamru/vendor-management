"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Spreadsheet-style record form: uppercase labels left, controls right.
 * Pair two {@link RecordFormField}s in one {@link RecordFormRow} for side-by-side.
 */
export function RecordForm({
	className,
	children,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="record-form"
			className={cn(
				"overflow-hidden rounded-md border border-border/70 bg-background",
				className
			)}
			{...props}
		>
			{children}
		</div>
	);
}

export function RecordFormSection({
	title,
	description,
	className,
	children,
}: {
	title?: string;
	description?: string;
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<div className={cn("space-y-2", className)}>
			{title ? (
				<div className="px-0.5">
					<p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
						{title}
					</p>
					{description ? (
						<p className="mt-0.5 text-[11px] text-muted-foreground/80">
							{description}
						</p>
					) : null}
				</div>
			) : null}
			<RecordForm>{children}</RecordForm>
		</div>
	);
}

/**
 * One row in the form.
 * - Single {@link RecordFormField}: label | full-width input
 * - Two {@link RecordFormField}s: label | input | label | input (equal halves)
 * - Legacy: `label` + `children` still works for a single field
 */
export function RecordFormRow({
	label,
	htmlFor,
	align = "center",
	required = false,
	className,
	children,
}: {
	label?: string;
	htmlFor?: string;
	align?: "center" | "start";
	required?: boolean;
	className?: string;
	children: React.ReactNode;
}) {
	const items = React.Children.toArray(children).filter(Boolean);
	const fieldCount = items.length;

	// New API: one or two RecordFormField children
	if (!label && fieldCount >= 1) {
		return (
			<div
				data-slot="record-form-row"
				className={cn(
					"grid border-b border-border/60 last:border-b-0",
					fieldCount >= 2
						? "grid-cols-1 sm:grid-cols-2"
						: "grid-cols-1",
					className
				)}
			>
				{items.slice(0, 2)}
			</div>
		);
	}

	// Legacy: label prop + raw control(s)
	return (
		<div
			data-slot="record-form-row"
			className={cn(
				"grid grid-cols-1 border-b border-border/60 last:border-b-0 sm:grid-cols-[minmax(9.5rem,12rem)_minmax(0,1fr)]",
				className
			)}
		>
			<div
				className={cn(
					"flex border-border/60 bg-muted/40 px-3 py-2.5 sm:border-r",
					align === "start" ? "items-start pt-3" : "items-center"
				)}
			>
				<label
					htmlFor={htmlFor}
					aria-required={required || undefined}
					className="text-[11px] leading-none font-semibold tracking-[0.12em] text-muted-foreground uppercase"
				>
					{label}
					{required ? (
						<span className="ml-0.5 text-destructive" aria-hidden="true">
							*
						</span>
					) : null}
				</label>
			</div>
			<div
				className={cn(
					"flex min-w-0 items-center gap-2 bg-background px-3 py-2",
					align === "start" && "items-start"
				)}
			>
				{children}
			</div>
		</div>
	);
}

/** Label + control cell. Put two in a {@link RecordFormRow} for a paired row. */
export function RecordFormField({
	label,
	htmlFor,
	align = "center",
	required = false,
	className,
	children,
}: {
	label: string;
	htmlFor?: string;
	align?: "center" | "start";
	required?: boolean;
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<div
			data-slot="record-form-field"
			className={cn(
				"grid min-w-0 grid-cols-[minmax(9.5rem,12rem)_minmax(0,1fr)]",
				"border-b border-border/60 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0",
				className
			)}
		>
			<div
				className={cn(
					"flex border-border/60 bg-muted/40 px-3 py-2.5 sm:border-r",
					align === "start" ? "items-start pt-3" : "items-center"
				)}
			>
				<label
					htmlFor={htmlFor}
					aria-required={required || undefined}
					className="text-[11px] leading-none font-semibold tracking-[0.12em] text-muted-foreground uppercase"
				>
					{label}
					{required ? (
						<span className="ml-0.5 text-destructive" aria-hidden="true">
							*
						</span>
					) : null}
				</label>
			</div>
			<div
				className={cn(
					"flex min-w-0 bg-background px-3 py-2",
					align === "start" ? "items-start" : "items-center"
				)}
			>
				<div className="min-w-0 w-full">{children}</div>
			</div>
		</div>
	);
}

/** @deprecated Prefer two {@link RecordFormField}s inside {@link RecordFormRow}. */
export function RecordFormInlineField({
	label,
	htmlFor,
	className,
	children,
}: {
	label: string;
	htmlFor?: string;
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<div
			className={cn(
				"grid min-w-0 flex-1 grid-cols-[auto_minmax(0,1fr)] items-center gap-2.5",
				className
			)}
		>
			<label
				htmlFor={htmlFor}
				className="shrink-0 text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase"
			>
				{label}
			</label>
			<div className="min-w-0">{children}</div>
		</div>
	);
}

export function RecordFormChoice({
	value,
	onChange,
	options,
	className,
	tone = "default",
}: {
	value: string;
	onChange: (value: string) => void;
	options: { value: string; label: string }[];
	className?: string;
	/** Selected chip style. `primary` matches relationship toggles. */
	tone?: "default" | "primary";
}) {
	return (
		<div
			role="group"
			className={cn(
				"inline-flex flex-wrap overflow-hidden rounded-md border border-border/80",
				className
			)}
		>
			{options.map((opt, i) => {
				const selected = opt.value === value;
				return (
					<button
						key={opt.value}
						type="button"
						onClick={() => onChange(opt.value)}
						className={cn(
							"px-3 py-1.5 text-xs font-medium transition-colors",
							i > 0 && "border-l border-border/80",
							selected
								? tone === "primary"
									? "bg-primary text-primary-foreground"
									: "bg-muted text-foreground"
								: "bg-background text-muted-foreground hover:bg-muted/50 hover:text-foreground"
						)}
					>
						{opt.label}
					</button>
				);
			})}
		</div>
	);
}
