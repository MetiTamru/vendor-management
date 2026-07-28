import { CURRENT_VENDOR_ID, vmsStore } from "./mock-store";
import type {
	BidModel,
	ContractModel,
	DocumentModel,
	InvoiceModel,
	OnboardingCaseModel,
	PurchaseOrderModel,
	RfxModel,
	VendorModel,
} from "./types";
import { isVmsMockEnabled } from "./use-mock";

async function mockDelay<T>(value: T): Promise<T> {
	await new Promise((r) => setTimeout(r, 80));
	return value;
}

export const vmsApi = {
	async listVendors() {
		if (!isVmsMockEnabled()) throw new Error("VMS API not configured");
		return mockDelay(vmsStore.listVendors());
	},
	async getVendor(id: string) {
		if (!isVmsMockEnabled()) throw new Error("VMS API not configured");
		return mockDelay(vmsStore.getVendor(id));
	},
	async createVendor(
		input: Parameters<typeof vmsStore.createVendor>[0]
	): Promise<VendorModel> {
		return mockDelay(vmsStore.createVendor(input));
	},
	async updateVendor(id: string, patch: Partial<VendorModel>) {
		return mockDelay(vmsStore.updateVendor(id, patch));
	},
	async inviteVendor(data: {
		legalName: string;
		email: string;
		categories: string[];
	}) {
		return mockDelay(
			vmsStore.createVendor({
				legalName: data.legalName,
				tradeName: null,
				status: "invited",
				categories: data.categories,
				tags: [],
				country: "",
				city: "",
				taxId: null,
				website: null,
				description: null,
				riskLevel: "medium",
				contacts: [
					{
						id: `c-${Date.now()}`,
						name: data.email.split("@")[0] ?? data.email,
						email: data.email,
						phone: null,
						role: "Primary",
						isPrimary: true,
					},
				],
			})
		);
	},
	async listCategories() {
		return mockDelay(vmsStore.listCategories());
	},
	async listOnboarding() {
		return mockDelay(vmsStore.listOnboarding());
	},
	async getOnboarding(id: string) {
		return mockDelay(vmsStore.getOnboarding(id));
	},
	async updateOnboarding(id: string, patch: Partial<OnboardingCaseModel>) {
		return mockDelay(vmsStore.updateOnboarding(id, patch));
	},
	async listDocuments(vendorId?: string) {
		return mockDelay(vmsStore.listDocuments(vendorId));
	},
	async getDocument(id: string) {
		return mockDelay(vmsStore.getDocument(id));
	},
	async updateDocument(id: string, patch: Partial<DocumentModel>) {
		return mockDelay(vmsStore.updateDocument(id, patch));
	},
	async addDocument(doc: Parameters<typeof vmsStore.addDocument>[0]) {
		return mockDelay(vmsStore.addDocument(doc));
	},
	async listCertificates() {
		return mockDelay(vmsStore.listCertificates());
	},
	async listContracts(vendorId?: string) {
		return mockDelay(vmsStore.listContracts(vendorId));
	},
	async getContract(id: string) {
		return mockDelay(vmsStore.getContract(id));
	},
	async createContract(input: Omit<ContractModel, "id" | "updatedAt">) {
		return mockDelay(vmsStore.createContract(input));
	},
	async updateContract(id: string, patch: Partial<ContractModel>) {
		return mockDelay(vmsStore.updateContract(id, patch));
	},
	async listRfx() {
		return mockDelay(vmsStore.listRfx());
	},
	async getRfx(id: string) {
		return mockDelay(vmsStore.getRfx(id));
	},
	async createRfx(input: Omit<RfxModel, "id" | "updatedAt" | "bidCount">) {
		return mockDelay(vmsStore.createRfx(input));
	},
	async updateRfx(id: string, patch: Partial<RfxModel>) {
		return mockDelay(vmsStore.updateRfx(id, patch));
	},
	async listBids(rfxId?: string) {
		return mockDelay(vmsStore.listBids(rfxId));
	},
	async submitBid(input: Omit<BidModel, "id" | "submittedAt" | "status">) {
		return mockDelay(vmsStore.submitBid(input));
	},
	async listPurchaseOrders(vendorId?: string) {
		return mockDelay(vmsStore.listPurchaseOrders(vendorId));
	},
	async getPurchaseOrder(id: string) {
		return mockDelay(vmsStore.getPurchaseOrder(id));
	},
	async createPurchaseOrder(
		input: Omit<PurchaseOrderModel, "id" | "updatedAt" | "acknowledgedAt">
	) {
		return mockDelay(vmsStore.createPurchaseOrder(input));
	},
	async updatePurchaseOrder(id: string, patch: Partial<PurchaseOrderModel>) {
		return mockDelay(vmsStore.updatePurchaseOrder(id, patch));
	},
	async listInvoices(vendorId?: string) {
		return mockDelay(vmsStore.listInvoices(vendorId));
	},
	async getInvoice(id: string) {
		return mockDelay(vmsStore.getInvoice(id));
	},
	async createInvoice(input: Omit<InvoiceModel, "id" | "updatedAt">) {
		return mockDelay(vmsStore.createInvoice(input));
	},
	async updateInvoice(id: string, patch: Partial<InvoiceModel>) {
		return mockDelay(vmsStore.updateInvoice(id, patch));
	},
	async listApprovals() {
		return mockDelay(vmsStore.listApprovals());
	},
	async updateApproval(
		id: string,
		status: "approved" | "rejected" | "changes_requested" | "pending"
	) {
		return mockDelay(vmsStore.updateApproval(id, status));
	},
	async listScorecards() {
		return mockDelay(vmsStore.listScorecards());
	},
	async listActivities(vendorId?: string) {
		return mockDelay(vmsStore.listActivities(vendorId));
	},
	async listNotifications() {
		return mockDelay(vmsStore.listNotifications());
	},
	async markNotificationRead(id: string) {
		vmsStore.markNotificationRead(id);
		return mockDelay(true);
	},
	async listTeam() {
		return mockDelay(vmsStore.listTeam());
	},
	async getCurrentVendor() {
		return mockDelay(vmsStore.getVendor(CURRENT_VENDOR_ID));
	},
	currentVendorId: CURRENT_VENDOR_ID,
};
