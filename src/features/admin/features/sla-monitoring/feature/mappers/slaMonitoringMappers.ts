import type { ProgramFileType } from "@/types/UI/system.types";

import type {
	SlaMonitoringModel,
	SlaRunModel,
	VendorSlaModel,
} from "../types/slaMonitoringModel";

type FileRun = SlaRunModel;

export function toSlaMonitoringModel(
	program: ProgramFileType,
	runs: FileRun[]
): SlaMonitoringModel {
	const summary = {
		monitored: runs.length,
		onTime: runs.filter((run) => (run.latencyMinutes ?? 0) <= 0).length,
		atRisk: runs.filter(
			(run) =>
				(run.latencyMinutes ?? 0) > 0 &&
				(run.latencyMinutes ?? 0) <= run.slaMinutes
		).length,
		breached: runs.filter((run) => (run.latencyMinutes ?? 0) > run.slaMinutes)
			.length,
		avgLatency: runs.length
			? Math.round(
					runs.reduce((sum, run) => sum + (run.latencyMinutes ?? 0), 0) /
						runs.length
				)
			: 0,
		attainment: 0,
	};
	summary.attainment = summary.monitored
		? Math.round((summary.onTime / summary.monitored) * 100)
		: 0;

	const grouped = new Map<string, VendorSlaModel>();
	for (const run of runs) {
		const row = grouped.get(run.vendor) ?? {
			vendor: run.vendor,
			total: 0,
			onTime: 0,
			atRisk: 0,
			breached: 0,
			score: 0,
		};
		row.total += 1;
		if ((run.latencyMinutes ?? 0) <= 0) row.onTime += 1;
		else if ((run.latencyMinutes ?? 0) <= run.slaMinutes) row.atRisk += 1;
		else row.breached += 1;
		grouped.set(run.vendor, row);
	}
	const vendorScores = [...grouped.values()]
		.map((row) => ({
			...row,
			score: row.total ? Math.round((row.onTime / row.total) * 100) : 0,
		}))
		.sort((a, b) => a.score - b.score);
	const watchlist = runs
		.filter((run) => (run.latencyMinutes ?? 0) > 0)
		.sort((a, b) => (b.latencyMinutes ?? 0) - (a.latencyMinutes ?? 0))
		.slice(0, 5);
	return { program, events: runs, summary, vendorScores, watchlist };
}
