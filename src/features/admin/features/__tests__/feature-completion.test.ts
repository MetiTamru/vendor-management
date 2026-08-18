import { featureQueryKey } from "@/features/admin/shared/feature-contract";
import { toContractsModel } from "@/features/admin/features/contracts/feature/mappers/contractsMappers";
import { toSourcingModel } from "@/features/admin/features/sourcing/feature/mappers/sourcingMappers";
import { toInvoicesModel } from "@/features/admin/features/invoices/feature/mappers/invoicesMappers";
import { toPurchaseOrdersModel } from "@/features/admin/features/purchase-orders/feature/mappers/purchaseOrdersMappers";
import { toDocumentsModel } from "@/features/admin/features/documents/feature/mappers/documentsMappers";
import { toOnboardingModel } from "@/features/admin/features/onboarding/feature/mappers/onboardingMappers";
import { toComplianceModel } from "@/features/admin/features/compliance/feature/mappers/complianceMappers";
import { toSlaMonitoringModel } from "@/features/admin/features/sla-monitoring/feature/mappers/slaMonitoringMappers";
import type { SlaRunModel } from "@/features/admin/features/sla-monitoring/feature/types/slaMonitoringModel";
import { toRiskScoringDashboardModel } from "@/features/admin/features/risk-scoring/feature/mappers/riskScoringMappers";
import { normalizeEligibilityFile } from "@/lib/vendor-core/types";
import { toCredentialsModel } from "@/features/admin/features/credentials/feature/mappers/credentialsMappers";
import * as contractsApi from "@/features/admin/features/contracts/feature/api/contractsApi";
import * as invoicesApi from "@/features/admin/features/invoices/feature/api/invoicesApi";
import * as purchaseOrdersApi from "@/features/admin/features/purchase-orders/feature/api/purchaseOrdersApi";
import * as credentialsApi from "@/features/admin/features/credentials/feature/api/credentialsApi";

describe("feature-contract", () => {
	it("builds stable query keys for list and detail scopes", () => {
		expect(featureQueryKey("contracts", "list")).toEqual([
			"admin",
			"feature",
			"contracts",
			"list",
		]);
		expect(featureQueryKey("sourcing", "detail", "rfx-1")).toEqual([
			"admin",
			"feature",
			"sourcing",
			"detail",
			"rfx-1",
		]);
	});
});

describe("business feature mappers", () => {
	it("passes through VMS-shaped contracts/sourcing/invoices/POs/documents/onboarding/compliance", () => {
		const contract = {
			id: "ctr-1",
			number: "C-001",
			title: "MSA",
			vendorId: "vnd-1",
			vendorName: "Apex",
			status: "active" as const,
			value: 1000,
			currency: "USD",
			startDate: "2026-01-01",
			endDate: "2026-12-31",
			slaSummary: null,
			updatedAt: "2026-08-01T00:00:00.000Z",
		};
		expect(toContractsModel(contract)).toEqual(contract);

		const rfx = {
			id: "rfx-1",
			number: "RFX-1",
			title: "Network RFP",
			type: "RFP" as const,
			status: "published" as const,
			category: "network",
			closesAt: "2026-09-01",
			invitedVendorIds: ["vnd-1"],
			bidCount: 2,
			budget: 10000,
			currency: "USD",
			description: "Network services",
			updatedAt: "2026-08-01T00:00:00.000Z",
		};
		expect(toSourcingModel(rfx)).toEqual(rfx);

		const invoice = {
			id: "inv-1",
			number: "INV-1",
			vendorId: "vnd-1",
			vendorName: "Apex",
			poId: "po-1",
			poNumber: "PO-1",
			status: "approved" as const,
			amount: 250,
			currency: "USD",
			matchScore: 98,
			submittedAt: "2026-08-01",
			dueDate: "2026-08-30",
			updatedAt: "2026-08-01T00:00:00.000Z",
		};
		expect(toInvoicesModel(invoice)).toEqual(invoice);

		const po = {
			id: "po-1",
			number: "PO-1",
			vendorId: "vnd-1",
			vendorName: "Apex",
			contractId: null,
			rfxId: null,
			status: "sent" as const,
			currency: "USD",
			total: 500,
			lines: [],
			orderedAt: "2026-08-01",
			acknowledgedAt: null,
			updatedAt: "2026-08-01T00:00:00.000Z",
		};
		expect(toPurchaseOrdersModel(po)).toEqual(po);

		const document = {
			id: "doc-1",
			vendorId: "vnd-1",
			vendorName: "Apex",
			name: "W9.pdf",
			type: "w9" as const,
			status: "approved" as const,
			expiresAt: null,
			uploadedAt: "2026-08-01",
			visibility: "both" as const,
		};
		expect(toDocumentsModel(document)).toEqual(document);

		const onboarding = {
			id: "onb-1",
			vendorId: "vnd-1",
			vendorName: "Apex",
			status: "in_progress" as const,
			progress: 40,
			checklist: [],
			submittedAt: "2026-07-01",
			reviewedAt: null,
			reviewerNote: null,
			updatedAt: "2026-08-01T00:00:00.000Z",
		};
		expect(toOnboardingModel(onboarding)).toEqual(onboarding);

		const certificate = {
			id: "cert-1",
			vendorId: "vnd-1",
			vendorName: "Apex",
			name: "SOC2",
			issuer: "Auditor Co",
			expiresAt: "2027-01-01",
			status: "valid" as const,
			riskFlag: false,
		};
		expect(toComplianceModel(certificate)).toEqual(certificate);
	});

	it("aggregates SLA monitoring summary and vendor scores", () => {
		const runs: SlaRunModel[] = [
			{
				id: "run-1",
				runId: "R1",
				vendor: "Apex",
				program: "MDH",
				fileType: "837",
				scheduleId: "sch-1",
				status: "success",
				expectedAt: "2026-08-01T00:00:00.000Z",
				receivedAt: "2026-08-01T00:00:00.000Z",
				slaMinutes: 60,
				latencyMinutes: -5,
			},
			{
				id: "run-2",
				runId: "R2",
				vendor: "Apex",
				program: "MDH",
				fileType: "837",
				scheduleId: "sch-1",
				status: "warning",
				expectedAt: "2026-08-01T01:00:00.000Z",
				receivedAt: "2026-08-01T01:30:00.000Z",
				slaMinutes: 60,
				latencyMinutes: 30,
			},
			{
				id: "run-3",
				runId: "R3",
				vendor: "Horizon",
				program: "MDH",
				fileType: "837",
				scheduleId: "sch-2",
				status: "failed",
				expectedAt: "2026-08-01T02:00:00.000Z",
				receivedAt: "2026-08-01T03:30:00.000Z",
				slaMinutes: 60,
				latencyMinutes: 90,
			},
		];

		const model = toSlaMonitoringModel("MDH", runs);

		expect(model.summary).toMatchObject({
			monitored: 3,
			onTime: 1,
			atRisk: 1,
			breached: 1,
			attainment: 33,
		});
		expect(model.vendorScores).toHaveLength(2);
		expect(model.watchlist[0]?.id).toBe("run-3");
	});

	it("builds a risk scoring dashboard for a program", () => {
		const dashboard = toRiskScoringDashboardModel("MDH");
		expect(dashboard.program).toBe("MDH");
		expect(dashboard.items.length).toBeGreaterThan(0);
		expect(dashboard.items[0]).toEqual(
			expect.objectContaining({
				id: expect.any(String),
				riskScore: expect.any(Number),
				riskLevel: expect.stringMatching(/^(low|medium|high)$/),
			})
		);
	});
});

describe("eligibilityFile.normalize", () => {
	it("normalizes nested vendor refs and member counts", () => {
		expect(
			normalizeEligibilityFile({
				id: "ef-1",
				vendor: { id: "vnd-9", legal_name: "Horizon" },
				member_count: "12",
				original_filename: "834.edi",
			})
		).toMatchObject({
			id: "ef-1",
			vendor_id: "vnd-9",
			member_count: 12,
			original_filename: "834.edi",
		});
	});
});

describe("vendor-core feature mappers", () => {
	it("maps credential DTOs to UI models", () => {
		expect(
			toCredentialsModel({
				id: "cred-1",
				name: "SFTP Password",
				kind: "password",
				secret_ref: "vault/sftp",
				created_at: "2026-01-01T00:00:00.000Z",
			})
		).toMatchObject({
			id: "cred-1",
			name: "SFTP Password",
			kind: "password",
			secretRef: "vault/sftp",
		});
	});
});

describe("feature API facades", () => {
	it("exposes list/get/create/update for contracts, invoices, and purchase orders", () => {
		expect(typeof contractsApi.listContracts).toBe("function");
		expect(typeof contractsApi.getContracts).toBe("function");
		expect(typeof contractsApi.createContracts).toBe("function");
		expect(typeof contractsApi.updateContracts).toBe("function");

		expect(typeof invoicesApi.listInvoices).toBe("function");
		expect(typeof invoicesApi.createInvoices).toBe("function");

		expect(typeof purchaseOrdersApi.listPurchaseOrders).toBe("function");
		expect(typeof purchaseOrdersApi.createPurchaseOrders).toBe("function");

		expect(typeof credentialsApi.listCredentials).toBe("function");
		expect(typeof credentialsApi.createCredentials).toBe("function");
	});
});
