"use client";

import type React from "react";
import { useState } from "react";

import { Check, ChevronsUpDown, Info } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface SelectOption {
	value: string;
	label?: string;
}
interface SearchableSelectFieldProps {
	id?: string;
	control: any;
	name: string;
	labelKey: string;
	placeholderKey?: string;
	descriptionKey?: string;
	options: string[] | SelectOption[];
	onValueChange: (value: string) => void;
	onInputChange?: (inputValue: string) => void;
	local?: string;
	required?: boolean;
	defaultValue?: string;
	save?: boolean;
	disable?: boolean;
}
const SearchableSelectField: React.FC<SearchableSelectFieldProps> = ({
	id,
	control,
	name,
	labelKey,
	placeholderKey,
	descriptionKey,
	options,
	onValueChange,
	onInputChange,
	local,
	required = false,
	defaultValue = "",
	save = false,
	disable = false,
}) => {
	const namespace = local || "";
	const t = useTranslations(namespace);
	const [open, setOpen] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const [showSaveDialog, setShowSaveDialog] = useState(false);
	const isObjectOptions = typeof options[0] === "object";
	const formattedOptions = isObjectOptions
		? (options as SelectOption[])
		: (options as string[]).map((option) => ({ value: option, label: option }));
	// Handle when the user presses Enter
	const handleEnterPress = () => {
		const exists = formattedOptions.some(
			(option) => option.value === inputValue
		);
		if (!exists && inputValue.trim()) {
			if (save) {
				setShowSaveDialog(true);
			} else {
				// Force user to select from the list if save is false
				setInputValue("");
			}
		}
	};
	// Handle saving the new value
	const [savedValue, setSavedValue] = useState(defaultValue || "");
	const handleSave = () => {
		onValueChange(inputValue);
		setSavedValue(inputValue); // Store the saved value
		setShowSaveDialog(false);
		setOpen(false);
	};
	return (
		<FormField
			control={control}
			name={name}
			disabled={disable}
			render={({ field }) => (
				<FormItem className="flex flex-col w-full">
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
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<FormControl>
								<Button
									variant="outline"
									role="combobox"
									aria-expanded={open}
									disabled={disable}
									className={cn(
										"w-full  justify-between",
										!field.value && !savedValue && "text-muted-foreground"
									)}
								>
									{savedValue ||
										(field.value
											? formattedOptions.find(
													(option) => option.value === field.value
												)?.label
											: placeholderKey
												? t(placeholderKey)
												: "Select an option")}
									<ChevronsUpDown className="ml-2 h-4 w-4" />
								</Button>
							</FormControl>
						</PopoverTrigger>
						<PopoverContent className="max-w-full p-0">
							<Command>
								{/* Handle input change */}
								<CommandInput
									placeholder={t("Search")}
									onValueChange={(input) => {
										setInputValue(input);
										if (onInputChange) onInputChange(input);
									}}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											handleEnterPress();
										}
									}}
								/>
								<CommandList>
									<CommandEmpty>
										{t("No option found")}
										{save && (
											<p>
												{t("Do you want to add")} &quot;
												{inputValue}&quot; ? click enter to add
											</p>
										)}
									</CommandEmpty>
									<CommandGroup>
										{formattedOptions.map((option) => (
											<CommandItem
												key={option.value}
												value={option.value}
												onSelect={(currentValue) => {
													const value =
														currentValue === field.value ? "" : currentValue;
													field.onChange(value);
													onValueChange(value);
													setOpen(false);
												}}
											>
												<Check
													className={cn(
														"mr-2 h-4 w-4",
														field.value === option.value
															? "opacity-100"
															: "opacity-0"
													)}
												/>
												{option.label}
											</CommandItem>
										))}
									</CommandGroup>
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>
					<FormMessage />
					{/* Save Dialog */}
					{save && (
						<Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>
										{t("Add New Option")} for {t(labelKey)}{" "}
									</DialogTitle>
								</DialogHeader>
								<p>
									{t("Do you want to add")} &quot;{inputValue}&quot; ?
								</p>
								<DialogFooter>
									<Button
										variant="outline"
										onClick={() => setShowSaveDialog(false)}
									>
										{t("No")}
									</Button>
									<Button onClick={handleSave} type="submit">
										{t("Yes")}
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					)}
				</FormItem>
			)}
		/>
	);
};
export default SearchableSelectField;
