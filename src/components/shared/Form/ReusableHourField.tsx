"use client";

import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { type Control, type FieldValues, type Path } from "react-hook-form";

import {
	HourPicker,
	type HourPickerValue,
} from "@/components/ui/custom/hour-picker";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface ReusableHourPickerFieldProps<TFieldValues extends FieldValues> {
	name: Path<TFieldValues>;
	labelKey: string;
	descriptionKey?: string;
	local?: string;
	required?: boolean;
	control: Control<TFieldValues>;
	disabled?: boolean;
}

export function ReusableHourPickerField<TFieldValues extends FieldValues>({
	name,
	labelKey,
	local,
	descriptionKey,
	required = false,
	control,
	disabled = false,
}: ReusableHourPickerFieldProps<TFieldValues>) {
	const namespace = local || "";
	const t = useTranslations(namespace);

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel className="flex gap-2 items-center">
						{descriptionKey && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger>
										<Info size={15} />
									</TooltipTrigger>
									<TooltipContent className="bg-secondary">
										<FormDescription className="text-black">
											{t(descriptionKey)}
										</FormDescription>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
						{t(labelKey)}
						{required && <p className="text-red-500">*</p>}
					</FormLabel>
					<FormControl>
						<HourPicker
							value={field.value as HourPickerValue}
							onChange={(value) => field.onChange(value)}
							disabled={disabled}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
