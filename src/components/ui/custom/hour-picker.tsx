"use client";

import * as React from "react";

import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export interface HourPickerValue {
	hour: string;
	period: "AM" | "PM";
}

interface HourPickerProps {
	value?: HourPickerValue;
	onChange?: (value: HourPickerValue) => void;
	disabled?: boolean;
}

export function HourPicker({ value, onChange, disabled }: HourPickerProps) {
	const [selectedHour, setSelectedHour] = React.useState<string>(
		value?.hour || "12"
	);
	const [selectedPeriod, setSelectedPeriod] = React.useState<"AM" | "PM">(
		value?.period || "AM"
	);

	const handleHourChange = (hour: string) => {
		setSelectedHour(hour);
		if (onChange) {
			onChange({ hour, period: selectedPeriod });
		}
	};

	const handlePeriodChange = (period: "AM" | "PM") => {
		setSelectedPeriod(period);
		if (onChange) {
			onChange({ hour: selectedHour, period });
		}
	};

	return (
		<div className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 items-start sm:items-center">
			<div className="w-full sm:w-auto">
				<Label htmlFor="hour-select" className="mb-2 block text-sm font-medium">
					Hour
				</Label>
				<Select
					value={selectedHour}
					onValueChange={handleHourChange}
					disabled={disabled}
				>
					<SelectTrigger
						id="hour-select"
						className="w-full sm:w-[180px] bg-background"
					>
						<SelectValue placeholder="Select hour" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
								<SelectItem key={hour} value={hour.toString()}>
									{hour.toString().padStart(2, "0")}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
			<div className="w-full sm:w-auto">
				<Label
					htmlFor="period-select"
					className="mb-2 block text-sm font-medium"
				>
					AM/PM
				</Label>
				<Select
					value={selectedPeriod}
					onValueChange={handlePeriodChange}
					disabled={disabled}
				>
					<SelectTrigger
						id="period-select"
						className="w-full sm:w-[180px] bg-background"
					>
						<SelectValue placeholder="Select period" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem value="AM">AM</SelectItem>
							<SelectItem value="PM">PM</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
