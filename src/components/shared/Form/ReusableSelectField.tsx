import React from "react";

import { Info } from "lucide-react";
import { useTranslations } from "next-intl";

import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface SelectOption {
	value: string;
	label?: string;
}
interface SelectFieldProps {
	id?: string;
	control: any; // Control object from react-hook-form or similar
	name: string;
	labelKey: string; // Key for the label in the translation file
	placeholderKey?: string; // Key for the placeholder in the translation file
	descriptionKey?: string; // Key for the description in the translation file
	options: string[] | SelectOption[]; // Can be strings or objects with value and optional label
	onValueChange: (value: string) => void;
	local?: string; // Optional namespace for localization
	required?: boolean; // Indicates if the field is required
	defaultValue?: string; // Default value for the select field
}

const ReusableSelectField: React.FC<SelectFieldProps> = ({
	id,
	control,
	name,
	labelKey,
	placeholderKey,
	descriptionKey,
	options,
	onValueChange,
	local,
	required = false,
	defaultValue = "", // Default to an empty string if not provided
}) => {
	const namespace = local || ""; // Optional namespace if needed
	const t = useTranslations(namespace); // Hook to fetch translation strings

	const isObjectOptions = typeof options[0] === "object";

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
						<Select
							value={field.value || defaultValue} // Use defaultValue if field value is empty
							onValueChange={(value) => {
								field.onChange(value); // Update form state
								onValueChange(value); // Custom change handler
							}}
						>
							<SelectTrigger className="items-start [&_[data-description]]:hidden w-full bg-background">
								<SelectValue
									placeholder={placeholderKey ? t(placeholderKey) : undefined}
								/>
							</SelectTrigger>
							<SelectContent>
								{isObjectOptions
									? (options as SelectOption[]).map((option) => (
											<SelectItem key={option.value} value={option.value}>
												<div className="flex items-start gap-3 text-muted-foreground">
													<p>{option.label || option.value}</p>
												</div>
											</SelectItem>
										))
									: (options as string[]).map((option) => (
											<SelectItem key={option} value={option}>
												<div className="flex items-start gap-3 text-muted-foreground">
													<p>{option}</p>
												</div>
											</SelectItem>
										))}
							</SelectContent>
						</Select>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

export default ReusableSelectField;
