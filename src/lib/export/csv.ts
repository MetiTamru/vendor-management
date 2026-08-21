/** Browser helpers for downloading tabular data as CSV. */

export function downloadTextFile(
	filename: string,
	content: string,
	mimeType = "text/csv;charset=utf-8"
) {
	const blob = new Blob([content], { type: mimeType });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = filename;
	anchor.click();
	anchor.remove();
	URL.revokeObjectURL(url);
}

function escapeCsvCell(value: string | number | boolean | null | undefined) {
	if (value === null || value === undefined) return "";
	const text = String(value);
	if (text.includes(",") || text.includes('"') || text.includes("\n")) {
		return `"${text.replaceAll('"', '""')}"`;
	}
	return text;
}

export function rowsToCsv(
	headers: string[],
	rows: Array<Array<string | number | boolean | null | undefined>>
) {
	return [
		headers.map(escapeCsvCell).join(","),
		...rows.map((row) => row.map(escapeCsvCell).join(",")),
	].join("\n");
}

/** Build a CSV string and trigger a file download. */
export function downloadCsv(
	filename: string,
	headers: string[],
	rows: Array<Array<string | number | boolean | null | undefined>>
) {
	const base = filename.endsWith(".csv") ? filename : `${filename}.csv`;
	downloadTextFile(base, rowsToCsv(headers, rows));
}

export function stampFilename(prefix: string, extension = "csv") {
	const stamp = new Date().toISOString().slice(0, 19).replaceAll(":", "-");
	return `${prefix}-${stamp}.${extension}`;
}
