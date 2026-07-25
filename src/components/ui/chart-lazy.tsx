"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

import { Skeleton } from "@/components/ui/skeleton";

const ChartContainer = dynamic(
	() =>
		import("@/components/ui/chart").then((mod) => ({
			default: mod.ChartContainer,
		})),
	{
		loading: () => <Skeleton className="aspect-video w-full" />,
		ssr: false,
	}
);

export { ChartContainer };
export type ChartContainerProps = ComponentProps<typeof ChartContainer>;
