import type { ComponentProps, ReactNode } from "react";

import type { LucideIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const authLabelClass =
	"text-[11px] font-bold uppercase tracking-[0.1em] text-foreground";

export const authPrimaryButtonClass =
	"group h-auto w-full rounded-sm px-4 py-3.5 text-sm font-semibold tracking-wide shadow-none";

export const authOutlineButtonClass =
	"h-auto w-full rounded-sm border-foreground/15 px-4 py-3 text-sm font-medium shadow-none";

export const authFieldClass = cn(
	"h-12 rounded-md border border-foreground/15 bg-background pl-12 pr-3 text-sm shadow-none",
	"placeholder:text-muted-foreground/70",
	"transition-[border-color,box-shadow,background-color] duration-150",
	"hover:border-foreground/25",
	"focus-visible:border-primary focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/15"
);

type AuthFieldFrameProps = {
	icon: LucideIcon;
	children: ReactNode;
	className?: string;
	trailing?: ReactNode;
};

/** Icon rail + input frame for auth forms. */
export function AuthFieldFrame({
	icon: Icon,
	children,
	className,
	trailing,
}: AuthFieldFrameProps) {
	return (
		<div className={cn("relative", className)}>
			<span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-muted-foreground">
				<Icon className="size-[1.05rem]" strokeWidth={1.75} />
			</span>
			{children}
			{trailing}
		</div>
	);
}

type AuthTextInputProps = ComponentProps<typeof Input> & {
	icon: LucideIcon;
	trailing?: ReactNode;
	inputClassName?: string;
};

export function AuthTextInput({
	icon,
	trailing,
	className,
	inputClassName,
	...props
}: AuthTextInputProps) {
	return (
		<AuthFieldFrame icon={icon} className={className} trailing={trailing}>
			<Input
				className={cn(authFieldClass, trailing && "pr-11", inputClassName)}
				{...props}
			/>
		</AuthFieldFrame>
	);
}
