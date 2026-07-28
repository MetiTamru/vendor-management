import { cn } from "@/lib/utils";

export type VendorAvatar = {
	vendorId: string;
	name: string;
	/** Short mark shown in the circular logo */
	mark: string;
	/** Tailwind background class */
	bg: string;
	/** Tailwind text class */
	fg: string;
	category: string;
};

/** Mock branded avatars for file-monitoring vendor surfaces */
export const VENDOR_AVATARS: VendorAvatar[] = [
	{
		vendorId: "vnd-1",
		name: "Apex Industrial Supply",
		mark: "AX",
		bg: "bg-[#13446c]",
		fg: "text-white",
		category: "Materials",
	},
	{
		vendorId: "vnd-2",
		name: "Horizon Logistics",
		mark: "HZ",
		bg: "bg-[#c2410c]",
		fg: "text-white",
		category: "Logistics",
	},
	{
		vendorId: "vnd-3",
		name: "NovaTech Components",
		mark: "NV",
		bg: "bg-[#1d4ed8]",
		fg: "text-white",
		category: "IT Hardware",
	},
	{
		vendorId: "vnd-4",
		name: "GreenField Organics",
		mark: "GF",
		bg: "bg-[#15803d]",
		fg: "text-white",
		category: "Food & Bev",
	},
	{
		vendorId: "vnd-1",
		name: "Summit Packaging Co.",
		mark: "SP",
		bg: "bg-[#7c3aed]",
		fg: "text-white",
		category: "Packaging",
	},
	{
		vendorId: "vnd-5",
		name: "BluePeak Medical",
		mark: "BP",
		bg: "bg-[#0e7490]",
		fg: "text-white",
		category: "TPA",
	},
	{
		vendorId: "vnd-6",
		name: "Cedar Freight Partners",
		mark: "CF",
		bg: "bg-[#b45309]",
		fg: "text-white",
		category: "Logistics",
	},
	{
		vendorId: "vnd-7",
		name: "Orbit Dental Network",
		mark: "OD",
		bg: "bg-[#0369a1]",
		fg: "text-white",
		category: "Dental",
	},
	{
		vendorId: "vnd-8",
		name: "Riverbank Pharma",
		mark: "RP",
		bg: "bg-[#be123c]",
		fg: "text-white",
		category: "PBM",
	},
];

const BY_ID = new Map(
	[
		...VENDOR_AVATARS.filter((a) => a.name !== "Summit Packaging Co."),
	].map((a) => [a.vendorId, a] as const)
);

const BY_NAME = new Map(VENDOR_AVATARS.map((a) => [a.name.toLowerCase(), a]));

export function getVendorAvatar(opts: {
	vendorId?: string | null;
	vendorName?: string | null;
}): VendorAvatar {
	if (opts.vendorId) {
		const byId = BY_ID.get(opts.vendorId);
		if (byId) return byId;
	}
	if (opts.vendorName) {
		const key = opts.vendorName.toLowerCase();
		const exact = BY_NAME.get(key);
		if (exact) return exact;
		for (const [name, avatar] of BY_NAME) {
			if (key.startsWith(name) || name.startsWith(key)) return avatar;
		}
	}
	const fallbackName = opts.vendorName ?? "Vendor";
	const mark = fallbackName
		.split(/\s+/)
		.slice(0, 2)
		.map((p) => p[0]?.toUpperCase() ?? "")
		.join("");
	return {
		vendorId: opts.vendorId ?? "unknown",
		name: fallbackName,
		mark: mark || "V",
		bg: "bg-primary",
		fg: "text-primary-foreground",
		category: "Supplier",
	};
}

export function VendorAvatarBadge({
	vendorId,
	vendorName,
	size = "md",
	className,
}: {
	vendorId?: string | null;
	vendorName?: string | null;
	size?: "sm" | "md" | "lg";
	className?: string;
}) {
	const avatar = getVendorAvatar({ vendorId, vendorName });
	const sizeClass =
		size === "lg"
			? "size-12 text-sm"
			: size === "sm"
				? "size-8 text-[10px]"
				: "size-10 text-xs";

	return (
		<div
			className={cn(
				"inline-flex shrink-0 items-center justify-center rounded-full font-bold tracking-wide",
				sizeClass,
				avatar.bg,
				avatar.fg,
				className
			)}
			aria-hidden
		>
			{avatar.mark}
		</div>
	);
}
