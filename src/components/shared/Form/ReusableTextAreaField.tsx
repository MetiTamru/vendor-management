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
import { Textarea } from "@/components/ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface ReusableTeaxtAreaFieldProps {
	name: string;
	type?: string; // Input type (e.g., text, email, password, etc.)
	labelKey: string; // Key for the label in the translation file
	placeholderKey?: string; // Key for the placeholder in the translation file
	descriptionKey?: string; // Key for the description in the translation file
	local?: string;
	required?: boolean; // Indicates if the field is required
	control: any; // Control object from react-hook-form or similar
	value?: string; // Optional value to control the field's value
	disabled?: boolean; // Optional flag to disable the input field
}

const ReusableTeaxtAreaField: React.FC<ReusableTeaxtAreaFieldProps> = ({
	name,
	type = "text",
	labelKey,
	local,
	placeholderKey,
	descriptionKey,
	required = false,
	control,
	value,
	disabled = false,
}) => {
	const namespace = local || ""; // Optional namespace if needed
	const t = useTranslations(namespace); // Hook to fetch translation strings

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
						<Textarea
							type={type}
							value={value || field.value} // Use the provided value or the form's internal value
							disabled={disabled} // Control the disabled state
							placeholder={placeholderKey ? t(placeholderKey) : undefined}
							// Spread all fields except for `value` and `disabled`
							{...(field as any)} // Spread remaining necessary props like onChange, onBlur, etc.
							className="bg-background"
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

export default ReusableTeaxtAreaField;
