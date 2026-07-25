// * this function is used to format the date to MM/DD/YYYY
// export const formatToMMDDYYYY = (date: Date): string => {
// 	if (!date) return "";
//   const options: Intl.DateTimeFormatOptions = {
//     month: "2-digit",
//     day: "2-digit",
//     year: "numeric",
//   };
//   return new Intl.DateTimeFormat("en-US", options).format(date);
// };

// * this function is used to format the date to MM-DD-YYYY
export const formatToMMDDYYYY = (date: Date): string => {
	const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
	const day = String(date.getDate()).padStart(2, "0");
	const year = date.getFullYear();

	return `${month}-${day}-${year}`;
};

export const getFormattedDate = () => {
	const date = new Date();
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

export function parseMMDDYYYY(dateString: string): Date | null {
	const [month, day, year] = dateString.split("/").map(Number);
	if (
		month === undefined ||
		day === undefined ||
		year === undefined ||
		Number.isNaN(month) ||
		Number.isNaN(day) ||
		Number.isNaN(year)
	) {
		return null;
	}
	const date = new Date(year, month - 1, day);

	if (
		date.getFullYear() === year &&
		date.getMonth() === month - 1 &&
		date.getDate() === day
	) {
		return date;
	}

	return null;
}

export function convertToISO(dateString: string): string {
	// Handle empty or invalid input
	if (!dateString) return "";

	try {
		const [month, day, year] = dateString.split("-").map(Number);

		// Validate parts exist and are numbers
		if (!month || !day || !year || isNaN(month) || isNaN(day) || isNaN(year)) {
			return "";
		}

		// Create date object (month is 0-based)
		const date = new Date(year, month - 1, day);

		// Validate the date is valid
		if (isNaN(date.getTime())) {
			return "";
		}

		// Ensure the date parts match what was input (handles invalid dates like 02-31)
		if (
			date.getMonth() !== month - 1 ||
			date.getDate() !== day ||
			date.getFullYear() !== year
		) {
			return "";
		}

		// Format as YYYY-MM-DD
		const yyyy = date.getFullYear();
		const mm = String(date.getMonth() + 1).padStart(2, "0");
		const dd = String(date.getDate()).padStart(2, "0");

		return `${yyyy}-${mm}-${dd}`;
	} catch (error) {
		console.error("Error converting date:", error);
		return "";
	}
}
