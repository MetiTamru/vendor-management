"use client";

import * as React from "react";

import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { formatToMMDDYYYY, parseMMDDYYYY } from "@/lib/utils/dateUtils";

import { FormDescription } from "../form";
import { Input } from "../input";
import { Calendar } from "./calender";

type DateSelectorProps = {
	selectedDate?: Date;
	onDateChange: (date: Date | undefined) => void;
	placeholder?: string;
	buttonClassName?: string;
	yearValidation?: { min: number; max: number };
	description?: string;
};

export const DateSelector: React.FC<DateSelectorProps> = ({
	selectedDate,
	onDateChange,
	yearValidation = { min: 1699, max: 2030 },
	placeholder = "Pick a date",
	description = "Enter a date in the format MM-DD-YYYY.",
	buttonClassName,
}) => {
	const [errorMessage, setErrorMessage] = React.useState<string>("");
	const [inputValue, setInputValue] = React.useState<string>(
		selectedDate ? formatToMMDDYYYY(selectedDate) : ""
	);

	React.useEffect(() => {
		if (selectedDate) {
			setInputValue(formatToMMDDYYYY(selectedDate));
		}
	}, [selectedDate]);

	const validateDate = (date: Date): boolean => {
		const year = date.getFullYear();
		return year >= yearValidation.min && year <= yearValidation.max;
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let value = e.target.value;

		// Only allow digits and hyphens
		value = value.replace(/[^\d-]/g, "");

		// Auto-add hyphens after MM and DD
		if (value.length === 2 && inputValue.length === 1 && !value.includes("-")) {
			value += "-";
		} else if (
			value.length === 5 &&
			inputValue.length === 4 &&
			value.charAt(2) === "-" &&
			!value.includes("-", 3)
		) {
			value += "-";
		}

		// Prevent more than 10 characters (MM-DD-YYYY)
		if (value.length > 10) {
			value = value.slice(0, 10);
		}

		setInputValue(value);

		// Parse and validate the date if it's in the correct format
		if (value.length === 10 && /^\d{2}-\d{2}-\d{4}$/.test(value)) {
			const parsedDate = parseMMDDYYYY(value.replace(/-/g, "/"));

			if (parsedDate && validateDate(parsedDate)) {
				onDateChange(parsedDate);
				setErrorMessage("");
			} else {
				setErrorMessage("Please enter a valid date within the allowed range");
				onDateChange(undefined);
			}
		} else {
			onDateChange(undefined);
			if (value.length === 10) {
				setErrorMessage("Please enter a valid date in MM-DD-YYYY format");
			} else {
				setErrorMessage("");
			}
		}
	};

	return (
		<Popover>
			<div className="flex gap-2 relative w-full">
				<Input
					type="text"
					value={inputValue}
					onChange={handleInputChange}
					placeholder={placeholder}
					aria-label="Date input"
					aria-describedby="date-description"
					className={cn(
						"w-full p-2 border rounded bg-background",
						errorMessage ? "border-red-500" : "border-gray-300"
					)}
				/>

				<PopoverTrigger asChild>
					<Button
						variant={"outline"}
						className={cn(
							"font-normal rounded-l-none",
							!selectedDate && "text-muted-foreground",
							buttonClassName
						)}
						aria-label="Open calendar"
					>
						<CalendarIcon className="w-4 h-4" />
					</Button>
				</PopoverTrigger>
			</div>
			{errorMessage && (
				<div
					className="absolute bottom-[-1.75rem] left-0 text-red-400 text-sm"
					role="alert"
				>
					{errorMessage}
				</div>
			)}
			<FormDescription id="date-description" className="text-muted-foreground">
				{description}
			</FormDescription>
			<PopoverContent
				className="w-auto p-0 z-[9999] pointer-events-auto"
				forceMount
				sideOffset={4}
			>
				<Calendar
					mode="single"
					selected={selectedDate}
					onSelect={(date) => {
						if (date) {
							onDateChange(date);
							setInputValue(formatToMMDDYYYY(date));
							setErrorMessage("");
						}
					}}
					defaultMonth={selectedDate}
					initialFocus
					captionLayout="dropdown-buttons"
					fromYear={yearValidation.min}
					toYear={yearValidation.max}
				/>
			</PopoverContent>
		</Popover>
	);
};
