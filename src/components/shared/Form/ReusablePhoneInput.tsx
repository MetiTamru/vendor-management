import React from "react";

import { Info } from "lucide-react";
import { useTranslations } from "next-intl";

import { PhoneInput } from "@/components/ui/custom/phone-input";
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

type CountryCode = any; // Add more country codes as needed

// Your custom PhoneInput component

interface ReusablePhoneInputFieldProps {
	id?: string;
	name: string;
	labelKey: string; // Key for the label in the translation file
	placeholderKey?: string; // Key for the placeholder in the translation file
	descriptionKey?: string; // Key for the description in the translation file
	local?: string;
	required?: boolean; // Indicates if the field is required
	control: any; // Control object from react-hook-form or similar
	value?: string; // Optional value to control the field's value
	disabled?: boolean; // Optional flag to disable the input field
	isRequired?: boolean; // Optional flag to indicate if the field is required
	onChange?: (value: string) => void; // Custom onChange handler
	defaultCountry?: CountryCode; // Use CountryCode type here
}

const ReusablePhoneInputField: React.FC<ReusablePhoneInputFieldProps> = ({
	id,
	name,
	labelKey,
	local,
	placeholderKey,
	descriptionKey,
	required = false,
	control,
	value,
	disabled = false,
	isRequired = false,
	onChange,
	defaultCountry = "ET", // Default to US
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
						<PhoneInput
							value={value || field.value}
							disabled={disabled}
							placeholder={placeholderKey ? t(placeholderKey) : undefined}
							onChange={(newValue) => {
								field.onChange(newValue); // Update form value
								if (onChange) {
									onChange(newValue); // Trigger custom onChange handler
								}
							}}
							defaultCountry={defaultCountry}
							className="bg-background"
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

export default ReusablePhoneInputField;
