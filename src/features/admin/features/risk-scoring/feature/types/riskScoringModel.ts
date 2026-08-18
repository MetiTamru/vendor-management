import type { ProgramFileType } from "@/types/UI/system.types";

export type RiskLevel = "high" | "medium" | "low";
export type VendorHealthModel = "healthy" | "warning" | "critical";

export type RiskScoringModel = {
	id: string;
	name: string;
	vendorCode: string;
	vendorType: string;
	health: VendorHealthModel;
	slaPercent: number;
	alertsCount: number;
	errors: number;
	failedRuns: number;
	warningRuns: number;
	riskScore: number;
	riskLevel: RiskLevel;
	trend: number[];
	mark: string;
	avatarBg: string;
};

export type RiskScoringDashboardModel = {
	program: ProgramFileType;
	items: RiskScoringModel[];
};

export type RiskScoringListResult = {
	items: RiskScoringModel[];
	total: number;
};
