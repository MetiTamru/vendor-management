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
import { Input } from "@/components/ui/input";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface ReusableFormFieldProps {
	id?: string;
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
	isRequired?: boolean; // Optional flag to indicate if the field is required
	onChange?: (value: string | number) => void; // Custom onChange handler, ensuring the value is a string
}

const ReusableFormField: React.FC<ReusableFormFieldProps> = ({
	id,
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
	isRequired = false,
	onChange, // Added custom onChange prop
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
						<Input
							type={type}
							value={value || field.value} // Use the provided value or the form's internal value
							disabled={disabled} // Control the disabled state
							placeholder={placeholderKey ? t(placeholderKey) : undefined}
							{...(field as any)} // Spread remaining necessary props like onChange, onBlur, etc.
							className="bg-background"
							required={isRequired}
							onChange={(e) => {
								// const value = e.target.value;
								// // Convert to number if type is "number"
								// field.onChange(type === "number" ? Number(value) : value);
								const inputValue = e.target.value;
								// Apply character limit

								const stringValue =
									type === "string"
										? String(inputValue)
										: type === "number"
											? Number(inputValue)
											: inputValue;
								field.onChange(stringValue); // Update form value
								if (onChange) {
									onChange(stringValue); // Trigger custom onChange handler with a string value
								}
							}}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

export default ReusableFormField;
