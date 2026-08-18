import { FILE_RUNS } from "@/features/admin/features/file-management/mock-data";
import {
	VENDOR_ALERTS,
	VENDOR_DIRECTORY,
	VENDOR_INTEGRATION,
	VENDOR_TREND_BY_ID,
	getVendorIntegration,
	runBucket,
	runsForVendor,
} from "@/features/admin/features/vendors/vendor-integration-mock";
import type { ProgramFileType } from "@/types/UI/system.types";

import type {
	RiskLevel,
	RiskScoringDashboardModel,
	RiskScoringModel,
} from "../types/riskScoringModel";

function riskLevelFor(score: number): RiskLevel {
	return score >= 70 ? "high" : score >= 40 ? "medium" : "low";
}

function computeRiskScore(input: {
	health: "healthy" | "warning" | "critical";
	slaPercent: number;
	alertsCount: number;
	failedRuns: number;
	warningRuns: number;
	totalRuns: number;
}): number {
	const healthRisk =
		input.health === "critical" ? 70 : input.health === "warning" ? 35 : 0;
	const alertRisk = Math.min(40, input.alertsCount * 12);
	const runRisk = input.totalRuns
		? ((input.failedRuns + input.warningRuns) / input.totalRuns) * 100
		: 0;
	const slaRisk = Math.max(0, 100 - input.slaPercent);
	return Math.round(
		Math.min(
			100,
			Math.max(
				0,
				healthRisk * 0.35 + alertRisk * 0.25 + runRisk * 0.25 + slaRisk * 0.15
			)
		)
	);
}

function trendFor(vendorId: string, riskScore: number, seed: number): number[] {
	const series = VENDOR_TREND_BY_ID[vendorId];
	if (series)
		return series.map((day) =>
			Math.min(100, Math.round(day.failed * 28 + day.warnings * 12 + 8))
		);
	const base = Math.max(10, riskScore - 12);
	return Array.from({ length: 7 }, (_, index) =>
		Math.min(
			100,
			Math.max(
				0,
				Math.round(base + ((seed * 17 + index * 13) % 11) - 5 + index * 1.2)
			)
		)
	);
}

export function toRiskScoringModel(model: RiskScoringModel): RiskScoringModel {
	return model;
}

export function toRiskScoringDashboardModel(
	program: ProgramFileType
): RiskScoringDashboardModel {
	const items: RiskScoringModel[] = VENDOR_DIRECTORY.map((vendor, index) => {
		const integration =
			VENDOR_INTEGRATION[vendor.id] ?? getVendorIntegration(vendor.id);
		const alertsCount = VENDOR_ALERTS.filter(
			(alert) =>
				alert.vendorId === vendor.id &&
				(alert.severity === "error" || alert.severity === "warning")
		).length;
		const mappedRuns = runsForVendor(vendor.id, program);
		const nameMatchedRuns = FILE_RUNS.filter(
			(run) =>
				run.program === program &&
				(run.vendor.toLowerCase() === vendor.name.toLowerCase() ||
					run.vendor.toLowerCase().startsWith(vendor.name.toLowerCase()))
		);
		const runs = mappedRuns.length ? mappedRuns : nameMatchedRuns;
		const failedRuns = runs.filter(
			(run) => runBucket(run.status) === "failed"
		).length;
		const warningRuns = runs.filter(
			(run) => runBucket(run.status) === "warning"
		).length;
		const riskScore = computeRiskScore({
			health: vendor.health,
			slaPercent: integration.slaPercent,
			alertsCount: Math.max(alertsCount, integration.alertsCount),
			failedRuns,
			warningRuns,
			totalRuns: runs.length,
		});
		return {
			id: vendor.id,
			name: vendor.name,
			vendorCode: vendor.vendorCode,
			vendorType: vendor.vendorType,
			health: vendor.health,
			slaPercent: integration.slaPercent,
			alertsCount: Math.max(alertsCount, integration.alertsCount),
			errors: runs.reduce((sum, run) => sum + run.errorCount, 0),
			failedRuns,
			warningRuns,
			riskScore,
			riskLevel: riskLevelFor(riskScore),
			trend: trendFor(vendor.id, riskScore, index + 1),
			mark: vendor.mark,
			avatarBg: vendor.avatarBg,
		};
	}).sort((a, b) => b.riskScore - a.riskScore);
	return { program, items };
}
