import type {
	ActivityEventModel,
	ApprovalRequestModel,
	BidModel,
	CertificateModel,
	ContractModel,
	DocumentModel,
	InvoiceModel,
	NotificationModel,
	OnboardingCaseModel,
	PurchaseOrderModel,
	RfxModel,
	ScorecardModel,
	VendorCategoryModel,
	VendorModel,
	VendorTeamMember,
} from "./types";

const now = () => new Date().toISOString();
const daysFromNow = (d: number) => {
	const date = new Date();
	date.setDate(date.getDate() + d);
	return date.toISOString().slice(0, 10);
};

let vendors: VendorModel[] = [
	{
		id: "vnd-1",
		legalName: "Apex Industrial Supply LLC",
		tradeName: "Apex Supply",
		status: "active",
		categories: ["Raw Materials", "Packaging"],
		tags: ["preferred", "iso9001"],
		country: "United States",
		city: "Chicago",
		taxId: "***-**-4521",
		website: "https://apex-supply.example",
		description: "Industrial raw materials and packaging for manufacturing.",
		contacts: [
			{
				id: "c-1",
				name: "Jordan Lee",
				email: "jordan@apex-supply.example",
				phone: "+1-312-555-0142",
				role: "Account Manager",
				isPrimary: true,
			},
		],
		riskLevel: "low",
		riskScore: 18,
		onboardingProgress: 100,
		createdAt: "2025-01-12T10:00:00.000Z",
		updatedAt: now(),
	},
	{
		id: "vnd-2",
		legalName: "Horizon Logistics Co.",
		tradeName: "Horizon",
		status: "onboarding",
		categories: ["Logistics"],
		tags: ["freight"],
		country: "Ethiopia",
		city: "Addis Ababa",
		taxId: null,
		website: null,
		description: "Regional freight and last-mile logistics.",
		contacts: [
			{
				id: "c-2",
				name: "Sara Bekele",
				email: "sara@horizon.example",
				phone: "+251-911-000111",
				role: "Operations",
				isPrimary: true,
			},
		],
		riskLevel: "medium",
		riskScore: 42,
		onboardingProgress: 65,
		createdAt: "2026-06-01T08:00:00.000Z",
		updatedAt: now(),
	},
	{
		id: "vnd-3",
		legalName: "NovaTech Components Inc.",
		tradeName: "NovaTech",
		status: "under_review",
		categories: ["IT Hardware"],
		tags: ["electronics"],
		country: "Germany",
		city: "Munich",
		taxId: "***-**-8890",
		website: "https://novatech.example",
		description: "Electronic components and peripherals.",
		contacts: [
			{
				id: "c-3",
				name: "Hans Mueller",
				email: "hans@novatech.example",
				phone: "+49-89-555-0100",
				role: "Sales Director",
				isPrimary: true,
			},
		],
		riskLevel: "low",
		riskScore: 22,
		onboardingProgress: 90,
		createdAt: "2026-05-20T12:00:00.000Z",
		updatedAt: now(),
	},
	{
		id: "vnd-4",
		legalName: "GreenField Organics PLC",
		tradeName: "GreenField",
		status: "invited",
		categories: ["Food & Beverage"],
		tags: [],
		country: "Ethiopia",
		city: "Bahir Dar",
		taxId: null,
		website: null,
		description: null,
		contacts: [
			{
				id: "c-4",
				name: "Meron Tadesse",
				email: "meron@greenfield.example",
				phone: null,
				role: "Owner",
				isPrimary: true,
			},
		],
		riskLevel: "medium",
		riskScore: 50,
		onboardingProgress: 0,
		createdAt: "2026-07-10T09:00:00.000Z",
		updatedAt: now(),
	},
];

const categories: VendorCategoryModel[] = [
	{
		id: "cat-1",
		name: "Raw Materials",
		code: "RAW",
		description: "Commodity and specialty materials",
		parentId: null,
		vendorCount: 1,
	},
	{
		id: "cat-2",
		name: "Packaging",
		code: "PKG",
		description: "Primary and secondary packaging",
		parentId: null,
		vendorCount: 1,
	},
	{
		id: "cat-3",
		name: "Logistics",
		code: "LOG",
		description: "Freight, warehousing, last-mile",
		parentId: null,
		vendorCount: 1,
	},
	{
		id: "cat-4",
		name: "IT Hardware",
		code: "ITH",
		description: "Servers, networking, peripherals",
		parentId: null,
		vendorCount: 1,
	},
	{
		id: "cat-5",
		name: "Food & Beverage",
		code: "FNB",
		description: "Ingredients and finished goods",
		parentId: null,
		vendorCount: 1,
	},
	{
		id: "cat-6",
		name: "Professional Services",
		code: "SVC",
		description: "Consulting and managed services",
		parentId: null,
		vendorCount: 0,
	},
];

let onboardingCases: OnboardingCaseModel[] = [
	{
		id: "ob-1",
		vendorId: "vnd-2",
		vendorName: "Horizon Logistics Co.",
		status: "in_progress",
		progress: 65,
		checklist: [
			{
				id: "cl-1",
				label: "Company profile complete",
				completed: true,
				required: true,
			},
			{
				id: "cl-2",
				label: "Tax certificate uploaded",
				completed: true,
				required: true,
			},
			{
				id: "cl-3",
				label: "Insurance certificate",
				completed: false,
				required: true,
			},
			{
				id: "cl-4",
				label: "Bank details verified",
				completed: true,
				required: true,
			},
			{
				id: "cl-5",
				label: "Questionnaire submitted",
				completed: false,
				required: true,
			},
		],
		submittedAt: null,
		reviewedAt: null,
		reviewerNote: null,
		updatedAt: now(),
	},
	{
		id: "ob-2",
		vendorId: "vnd-3",
		vendorName: "NovaTech Components Inc.",
		status: "submitted",
		progress: 90,
		checklist: [
			{
				id: "cl-6",
				label: "Company profile complete",
				completed: true,
				required: true,
			},
			{
				id: "cl-7",
				label: "Tax certificate uploaded",
				completed: true,
				required: true,
			},
			{
				id: "cl-8",
				label: "Insurance certificate",
				completed: true,
				required: true,
			},
			{
				id: "cl-9",
				label: "Bank details verified",
				completed: true,
				required: true,
			},
			{
				id: "cl-10",
				label: "Questionnaire submitted",
				completed: true,
				required: true,
			},
		],
		submittedAt: "2026-07-18T14:00:00.000Z",
		reviewedAt: null,
		reviewerNote: null,
		updatedAt: now(),
	},
];

let documents: DocumentModel[] = [
	{
		id: "doc-1",
		vendorId: "vnd-1",
		vendorName: "Apex Industrial Supply LLC",
		name: "ISO 9001 Certificate",
		type: "other",
		status: "approved",
		expiresAt: daysFromNow(180),
		uploadedAt: "2026-01-05T10:00:00.000Z",
		visibility: "both",
		fileSizeKb: 842,
		fileExtension: "pdf",
		version: 2,
		uploadedBy: "Jordan Lee",
		reviewedBy: "A. Bekele",
		reviewedAt: "2026-01-06T09:30:00.000Z",
		description:
			"Quality management system certification for manufacturing operations.",
		tags: ["compliance", "quality", "iso9001"],
		issuer: "BSI Group",
		documentNumber: "ISO-9001-2024-APX",
		checksum: "sha256:9f2c…a81e",
		history: [
			{
				id: "h1",
				at: "2026-01-05T10:00:00.000Z",
				actor: "Jordan Lee",
				action: "Uploaded",
				note: "Renewed certificate for 2026 cycle.",
			},
			{
				id: "h2",
				at: "2026-01-06T09:30:00.000Z",
				actor: "A. Bekele",
				action: "Approved",
			},
		],
	},
	{
		id: "doc-2",
		vendorId: "vnd-1",
		vendorName: "Apex Industrial Supply LLC",
		name: "General Liability Insurance",
		type: "insurance",
		status: "approved",
		expiresAt: daysFromNow(25),
		uploadedAt: "2026-02-01T10:00:00.000Z",
		visibility: "both",
		fileSizeKb: 512,
		fileExtension: "pdf",
		version: 1,
		uploadedBy: "Jordan Lee",
		reviewedBy: "Compliance Bot",
		reviewedAt: "2026-02-02T11:00:00.000Z",
		description: "Commercial general liability coverage — $5M aggregate.",
		tags: ["insurance", "expiring-soon"],
		issuer: "Acme Insurance",
		documentNumber: "GL-2026-88421",
		checksum: "sha256:1ab4…c09d",
		history: [
			{
				id: "h1",
				at: "2026-02-01T10:00:00.000Z",
				actor: "Jordan Lee",
				action: "Uploaded",
			},
			{
				id: "h2",
				at: "2026-02-02T11:00:00.000Z",
				actor: "Compliance Bot",
				action: "Approved",
			},
		],
	},
	{
		id: "doc-3",
		vendorId: "vnd-2",
		vendorName: "Horizon Logistics Co.",
		name: "Business License",
		type: "business_license",
		status: "pending",
		expiresAt: daysFromNow(365),
		uploadedAt: "2026-07-02T10:00:00.000Z",
		visibility: "both",
		fileSizeKb: 256,
		fileExtension: "pdf",
		version: 1,
		uploadedBy: "Sara Bekele",
		reviewedBy: null,
		reviewedAt: null,
		description: "Ethiopian business registration and operating license.",
		tags: ["onboarding", "license"],
		issuer: "Ministry of Trade",
		documentNumber: "ET-BL-2026-44102",
		checksum: "sha256:77ce…12bf",
		history: [
			{
				id: "h1",
				at: "2026-07-02T10:00:00.000Z",
				actor: "Sara Bekele",
				action: "Uploaded",
				note: "Submitted during onboarding.",
			},
		],
	},
	{
		id: "doc-4",
		vendorId: "vnd-3",
		vendorName: "NovaTech Components Inc.",
		name: "Tax Certificate",
		type: "tax_certificate",
		status: "approved",
		expiresAt: daysFromNow(90),
		uploadedAt: "2026-06-01T10:00:00.000Z",
		visibility: "both",
		fileSizeKb: 128,
		fileExtension: "pdf",
		version: 1,
		uploadedBy: "Hans Mueller",
		reviewedBy: "Finance Team",
		reviewedAt: "2026-06-03T14:00:00.000Z",
		description: "German tax residency certificate for cross-border invoicing.",
		tags: ["tax", "finance"],
		issuer: "Finanzamt München",
		documentNumber: "DE-TAX-2026-NVA",
		checksum: "sha256:33aa…90fe",
		history: [
			{
				id: "h1",
				at: "2026-06-01T10:00:00.000Z",
				actor: "Hans Mueller",
				action: "Uploaded",
			},
			{
				id: "h2",
				at: "2026-06-03T14:00:00.000Z",
				actor: "Finance Team",
				action: "Approved",
			},
		],
	},
	{
		id: "doc-5",
		vendorId: "vnd-3",
		vendorName: "NovaTech Components Inc.",
		name: "Product Safety CE Declaration",
		type: "other",
		status: "expired",
		expiresAt: daysFromNow(-10),
		uploadedAt: "2024-08-15T10:00:00.000Z",
		visibility: "both",
		fileSizeKb: 384,
		fileExtension: "pdf",
		version: 1,
		uploadedBy: "Hans Mueller",
		reviewedBy: "Compliance Bot",
		reviewedAt: "2024-08-16T09:00:00.000Z",
		description: "CE conformity declaration for electronic components line.",
		tags: ["compliance", "expired", "critical"],
		issuer: "TÜV SÜD",
		documentNumber: "CE-2024-NVA-001",
		checksum: "sha256:b0d1…e44a",
		history: [
			{
				id: "h1",
				at: "2024-08-15T10:00:00.000Z",
				actor: "Hans Mueller",
				action: "Uploaded",
			},
			{
				id: "h2",
				at: "2026-07-17T08:00:00.000Z",
				actor: "System",
				action: "Marked expired",
				note: "Automatic expiry after grace period.",
			},
		],
	},
	{
		id: "doc-6",
		vendorId: "vnd-1",
		vendorName: "Apex Industrial Supply LLC",
		name: "W-9 Tax Form",
		type: "w9",
		status: "approved",
		expiresAt: null,
		uploadedAt: "2025-03-10T10:00:00.000Z",
		visibility: "buyer",
		fileSizeKb: 96,
		fileExtension: "pdf",
		version: 1,
		uploadedBy: "Jordan Lee",
		reviewedBy: "AP Team",
		reviewedAt: "2025-03-11T10:00:00.000Z",
		description: "IRS W-9 for US payment processing.",
		tags: ["tax", "finance"],
		documentNumber: "W9-APX-2025",
		checksum: "sha256:aa01…d772",
		history: [
			{
				id: "h1",
				at: "2025-03-10T10:00:00.000Z",
				actor: "Jordan Lee",
				action: "Uploaded",
			},
		],
	},
	{
		id: "doc-7",
		vendorId: "vnd-2",
		vendorName: "Horizon Logistics Co.",
		name: "Cargo Insurance Policy",
		type: "insurance",
		status: "rejected",
		expiresAt: daysFromNow(200),
		uploadedAt: "2026-07-10T10:00:00.000Z",
		visibility: "both",
		fileSizeKb: 640,
		fileExtension: "pdf",
		version: 1,
		uploadedBy: "Sara Bekele",
		reviewedBy: "A. Bekele",
		reviewedAt: "2026-07-12T15:00:00.000Z",
		description:
			"In-transit cargo insurance — coverage limits below policy minimum.",
		tags: ["insurance", "rejected"],
		issuer: "East Africa Mutual",
		documentNumber: "CI-2026-HRZ",
		checksum: "sha256:55fa…1002",
		history: [
			{
				id: "h1",
				at: "2026-07-10T10:00:00.000Z",
				actor: "Sara Bekele",
				action: "Uploaded",
			},
			{
				id: "h2",
				at: "2026-07-12T15:00:00.000Z",
				actor: "A. Bekele",
				action: "Rejected",
				note: "Coverage limit $500K — minimum required $2M.",
			},
		],
	},
	{
		id: "doc-8",
		vendorId: "vnd-1",
		vendorName: "Apex Industrial Supply LLC",
		name: "Master Supply Agreement",
		type: "contract",
		status: "approved",
		expiresAt: daysFromNow(40),
		uploadedAt: "2025-01-01T10:00:00.000Z",
		visibility: "both",
		fileSizeKb: 2048,
		fileExtension: "pdf",
		version: 3,
		uploadedBy: "Legal Team",
		reviewedBy: "Legal Team",
		reviewedAt: "2025-01-02T10:00:00.000Z",
		description: "Executed master supply agreement with renewal clause.",
		tags: ["contract", "expiring-soon"],
		contractNumber: "CTR-2025-0042",
		issuer: "Tilla Legal",
		documentNumber: "MSA-APX-2025",
		checksum: "sha256:c2ee…9910",
		history: [
			{
				id: "h1",
				at: "2025-01-01T10:00:00.000Z",
				actor: "Legal Team",
				action: "Uploaded",
				note: "Fully executed copy.",
			},
			{
				id: "h2",
				at: "2026-06-01T09:00:00.000Z",
				actor: "System",
				action: "Renewal reminder sent",
			},
		],
	},
	{
		id: "doc-9",
		vendorId: "vnd-3",
		vendorName: "NovaTech Components Inc.",
		name: "Data Processing Agreement",
		type: "contract",
		status: "pending",
		expiresAt: daysFromNow(730),
		uploadedAt: "2026-07-20T10:00:00.000Z",
		visibility: "both",
		fileSizeKb: 768,
		fileExtension: "pdf",
		version: 1,
		uploadedBy: "Hans Mueller",
		reviewedBy: null,
		reviewedAt: null,
		description:
			"GDPR data processing agreement for EU component catalog sync.",
		tags: ["contract", "gdpr", "pending"],
		contractNumber: "CTR-2026-0011",
		issuer: "NovaTech Legal",
		documentNumber: "DPA-NVA-2026",
		checksum: "sha256:9910…aabb",
		history: [
			{
				id: "h1",
				at: "2026-07-20T10:00:00.000Z",
				actor: "Hans Mueller",
				action: "Uploaded",
			},
		],
	},
	{
		id: "doc-10",
		vendorId: "vnd-2",
		vendorName: "Horizon Logistics Co.",
		name: "Bank Verification Letter",
		type: "other",
		status: "pending",
		expiresAt: daysFromNow(90),
		uploadedAt: "2026-07-22T10:00:00.000Z",
		visibility: "buyer",
		fileSizeKb: 192,
		fileExtension: "pdf",
		version: 1,
		uploadedBy: "Sara Bekele",
		reviewedBy: null,
		reviewedAt: null,
		description: "Commercial bank account verification for remittance setup.",
		tags: ["onboarding", "finance"],
		issuer: "Commercial Bank of Ethiopia",
		documentNumber: "BVL-HRZ-2026",
		checksum: "sha256:7712…cc09",
		history: [
			{
				id: "h1",
				at: "2026-07-22T10:00:00.000Z",
				actor: "Sara Bekele",
				action: "Uploaded",
			},
		],
	},
];

const certificates: CertificateModel[] = [
	{
		id: "cert-1",
		vendorId: "vnd-1",
		vendorName: "Apex Industrial Supply LLC",
		name: "General Liability",
		issuer: "Acme Insurance",
		expiresAt: daysFromNow(25),
		status: "expiring",
		riskFlag: true,
	},
	{
		id: "cert-2",
		vendorId: "vnd-1",
		vendorName: "Apex Industrial Supply LLC",
		name: "ISO 9001",
		issuer: "BSI",
		expiresAt: daysFromNow(180),
		status: "valid",
		riskFlag: false,
	},
	{
		id: "cert-3",
		vendorId: "vnd-3",
		vendorName: "NovaTech Components Inc.",
		name: "Product Safety CE",
		issuer: "TÜV",
		expiresAt: daysFromNow(-10),
		status: "expired",
		riskFlag: true,
	},
];

let contracts: ContractModel[] = [
	{
		id: "ctr-1",
		number: "CTR-2025-0042",
		title: "Annual Packaging Supply Agreement",
		vendorId: "vnd-1",
		vendorName: "Apex Industrial Supply LLC",
		status: "active",
		value: 450000,
		currency: "USD",
		startDate: "2025-01-01",
		endDate: daysFromNow(40),
		slaSummary: "98% on-time delivery · 5-day lead time",
		updatedAt: now(),
	},
	{
		id: "ctr-2",
		number: "CTR-2026-0011",
		title: "IT Hardware Frame Agreement",
		vendorId: "vnd-3",
		vendorName: "NovaTech Components Inc.",
		status: "pending_approval",
		value: 120000,
		currency: "EUR",
		startDate: "2026-08-01",
		endDate: "2027-07-31",
		slaSummary: "Next-business-day RMA",
		updatedAt: now(),
	},
];

let rfxEvents: RfxModel[] = [
	{
		id: "rfx-1",
		number: "RFQ-2026-018",
		title: "Q3 Corrugated Packaging",
		type: "RFQ",
		status: "published",
		category: "Packaging",
		closesAt: `${daysFromNow(14)}T23:59:59.000Z`,
		invitedVendorIds: ["vnd-1", "vnd-2"],
		bidCount: 1,
		budget: 80000,
		currency: "USD",
		description: "Quarterly supply of corrugated boxes, sizes A–D.",
		updatedAt: now(),
	},
	{
		id: "rfx-2",
		number: "RFP-2026-007",
		title: "Managed Freight Services",
		type: "RFP",
		status: "evaluating",
		category: "Logistics",
		closesAt: `${daysFromNow(-2)}T23:59:59.000Z`,
		invitedVendorIds: ["vnd-2"],
		bidCount: 1,
		budget: 200000,
		currency: "USD",
		description: "National freight management with KPI reporting.",
		updatedAt: now(),
	},
	{
		id: "rfx-3",
		number: "RFI-2026-003",
		title: "Sustainable Packaging Options",
		type: "RFI",
		status: "draft",
		category: "Packaging",
		closesAt: `${daysFromNow(30)}T23:59:59.000Z`,
		invitedVendorIds: [],
		bidCount: 0,
		budget: null,
		currency: "USD",
		description: "Market inquiry for recycled-content packaging.",
		updatedAt: now(),
	},
];

let bids: BidModel[] = [
	{
		id: "bid-1",
		rfxId: "rfx-1",
		rfxTitle: "Q3 Corrugated Packaging",
		vendorId: "vnd-1",
		vendorName: "Apex Industrial Supply LLC",
		amount: 74500,
		currency: "USD",
		status: "submitted",
		notes: "Includes delivery to Chicago DC.",
		submittedAt: "2026-07-20T16:00:00.000Z",
	},
	{
		id: "bid-2",
		rfxId: "rfx-2",
		rfxTitle: "Managed Freight Services",
		vendorId: "vnd-2",
		vendorName: "Horizon Logistics Co.",
		amount: 185000,
		currency: "USD",
		status: "submitted",
		notes: "12-month fixed rate.",
		submittedAt: "2026-07-15T11:00:00.000Z",
	},
];

let purchaseOrders: PurchaseOrderModel[] = [
	{
		id: "po-1",
		number: "PO-2026-1102",
		vendorId: "vnd-1",
		vendorName: "Apex Industrial Supply LLC",
		contractId: "ctr-1",
		rfxId: null,
		status: "acknowledged",
		currency: "USD",
		total: 12500,
		lines: [
			{
				id: "pl-1",
				description: "Box size A (case of 50)",
				quantity: 200,
				unitPrice: 40,
				receivedQty: 0,
			},
			{
				id: "pl-2",
				description: "Box size B (case of 50)",
				quantity: 100,
				unitPrice: 45,
				receivedQty: 0,
			},
		],
		orderedAt: "2026-07-12T09:00:00.000Z",
		acknowledgedAt: "2026-07-13T10:00:00.000Z",
		updatedAt: now(),
	},
	{
		id: "po-2",
		number: "PO-2026-1108",
		vendorId: "vnd-1",
		vendorName: "Apex Industrial Supply LLC",
		contractId: "ctr-1",
		rfxId: "rfx-1",
		status: "sent",
		currency: "USD",
		total: 8200,
		lines: [
			{
				id: "pl-3",
				description: "Protective wrap rolls",
				quantity: 40,
				unitPrice: 205,
				receivedQty: 0,
			},
		],
		orderedAt: "2026-07-22T09:00:00.000Z",
		acknowledgedAt: null,
		updatedAt: now(),
	},
	{
		id: "po-3",
		number: "PO-2026-1090",
		vendorId: "vnd-1",
		vendorName: "Apex Industrial Supply LLC",
		contractId: "ctr-1",
		rfxId: null,
		status: "received",
		currency: "USD",
		total: 5600,
		lines: [
			{
				id: "pl-4",
				description: "Pallet wraps",
				quantity: 80,
				unitPrice: 70,
				receivedQty: 80,
			},
		],
		orderedAt: "2026-06-01T09:00:00.000Z",
		acknowledgedAt: "2026-06-02T09:00:00.000Z",
		updatedAt: now(),
	},
];

let invoices: InvoiceModel[] = [
	{
		id: "inv-1",
		number: "INV-APX-8841",
		vendorId: "vnd-1",
		vendorName: "Apex Industrial Supply LLC",
		poId: "po-3",
		poNumber: "PO-2026-1090",
		status: "matched",
		amount: 5600,
		currency: "USD",
		matchScore: 100,
		submittedAt: "2026-06-20T12:00:00.000Z",
		dueDate: daysFromNow(10),
		updatedAt: now(),
	},
	{
		id: "inv-2",
		number: "INV-APX-8902",
		vendorId: "vnd-1",
		vendorName: "Apex Industrial Supply LLC",
		poId: "po-1",
		poNumber: "PO-2026-1102",
		status: "exception",
		amount: 13200,
		currency: "USD",
		matchScore: 72,
		submittedAt: "2026-07-21T12:00:00.000Z",
		dueDate: daysFromNow(20),
		updatedAt: now(),
	},
	{
		id: "inv-3",
		number: "INV-APX-8910",
		vendorId: "vnd-1",
		vendorName: "Apex Industrial Supply LLC",
		poId: "po-2",
		poNumber: "PO-2026-1108",
		status: "submitted",
		amount: 8200,
		currency: "USD",
		matchScore: null,
		submittedAt: "2026-07-23T12:00:00.000Z",
		dueDate: daysFromNow(30),
		updatedAt: now(),
	},
];

let approvals: ApprovalRequestModel[] = [
	{
		id: "apr-1",
		type: "onboarding",
		title: "Approve NovaTech onboarding",
		entityId: "ob-2",
		vendorName: "NovaTech Components Inc.",
		status: "pending",
		requestedAt: "2026-07-18T14:05:00.000Z",
		requestedBy: "System",
	},
	{
		id: "apr-2",
		type: "contract",
		title: "Approve CTR-2026-0011",
		entityId: "ctr-2",
		vendorName: "NovaTech Components Inc.",
		status: "pending",
		requestedAt: "2026-07-19T09:00:00.000Z",
		requestedBy: "Alex Chen",
	},
	{
		id: "apr-3",
		type: "invoice",
		title: "Match exception INV-APX-8902",
		entityId: "inv-2",
		vendorName: "Apex Industrial Supply LLC",
		status: "pending",
		requestedAt: "2026-07-21T12:30:00.000Z",
		requestedBy: "AP Bot",
	},
];

const scorecards: ScorecardModel[] = [
	{
		id: "sc-1",
		vendorId: "vnd-1",
		vendorName: "Apex Industrial Supply LLC",
		period: "2026-Q2",
		otif: 96,
		quality: 94,
		responsiveness: 91,
		compliance: 98,
		overall: 95,
		updatedAt: now(),
	},
	{
		id: "sc-2",
		vendorId: "vnd-2",
		vendorName: "Horizon Logistics Co.",
		period: "2026-Q2",
		otif: 88,
		quality: 90,
		responsiveness: 85,
		compliance: 80,
		overall: 86,
		updatedAt: now(),
	},
];

const activities: ActivityEventModel[] = [
	{
		id: "act-1",
		vendorId: "vnd-3",
		entityType: "onboarding",
		entityId: "ob-2",
		action: "Submitted for review",
		actor: "Hans Mueller",
		createdAt: "2026-07-18T14:00:00.000Z",
	},
	{
		id: "act-2",
		vendorId: "vnd-1",
		entityType: "invoice",
		entityId: "inv-2",
		action: "Invoice submitted with amount mismatch",
		actor: "Jordan Lee",
		createdAt: "2026-07-21T12:00:00.000Z",
	},
	{
		id: "act-3",
		vendorId: "vnd-1",
		entityType: "purchase_order",
		entityId: "po-2",
		action: "PO sent to vendor",
		actor: "Alex Chen",
		createdAt: "2026-07-22T09:05:00.000Z",
	},
];

let notifications: NotificationModel[] = [
	{
		id: "ntf-1",
		title: "PO awaiting acknowledgement",
		body: "PO-2026-1108 needs acknowledgement.",
		read: false,
		href: "/vendor/purchase-orders/po-2",
		createdAt: "2026-07-22T09:10:00.000Z",
	},
	{
		id: "ntf-2",
		title: "New RFQ invitation",
		body: "You are invited to RFQ-2026-018 — Q3 Corrugated Packaging.",
		read: false,
		href: "/vendor/opportunities/rfx-1",
		createdAt: "2026-07-19T08:00:00.000Z",
	},
	{
		id: "ntf-3",
		title: "Insurance expiring soon",
		body: "General Liability expires in 25 days.",
		read: true,
		href: "/vendor/documents",
		createdAt: "2026-07-15T08:00:00.000Z",
	},
];

const teamMembers: VendorTeamMember[] = [
	{
		id: "tm-1",
		name: "Jordan Lee",
		email: "jordan@apex-supply.example",
		role: "vendor_admin",
		isActive: true,
	},
	{
		id: "tm-2",
		name: "Priya Shah",
		email: "priya@apex-supply.example",
		role: "vendor_finance",
		isActive: true,
	},
	{
		id: "tm-3",
		name: "Chris Okonkwo",
		email: "chris@apex-supply.example",
		role: "vendor_bidder",
		isActive: true,
	},
];

/** Current vendor org for portal mock context */
export const CURRENT_VENDOR_ID = "vnd-1";

function uid(prefix: string) {
	return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export const vmsStore = {
	listVendors: () => [...vendors],
	getVendor: (id: string) => vendors.find((v) => v.id === id) ?? null,
	createVendor: (
		input: Omit<
			VendorModel,
			| "id"
			| "createdAt"
			| "updatedAt"
			| "riskScore"
			| "onboardingProgress"
			| "contacts"
		> & { contacts?: VendorModel["contacts"] }
	) => {
		const vendor: VendorModel = {
			...input,
			id: uid("vnd"),
			contacts: input.contacts ?? [],
			riskScore: 50,
			onboardingProgress: input.status === "invited" ? 0 : 10,
			createdAt: now(),
			updatedAt: now(),
		};
		vendors = [vendor, ...vendors];
		return vendor;
	},
	updateVendor: (id: string, patch: Partial<VendorModel>) => {
		vendors = vendors.map((v) =>
			v.id === id ? { ...v, ...patch, updatedAt: now() } : v
		);
		return vendors.find((v) => v.id === id) ?? null;
	},
	listCategories: () => [...categories],
	listOnboarding: () => [...onboardingCases],
	getOnboarding: (id: string) =>
		onboardingCases.find((c) => c.id === id) ?? null,
	updateOnboarding: (id: string, patch: Partial<OnboardingCaseModel>) => {
		onboardingCases = onboardingCases.map((c) =>
			c.id === id ? { ...c, ...patch, updatedAt: now() } : c
		);
		return onboardingCases.find((c) => c.id === id) ?? null;
	},
	listDocuments: (vendorId?: string) =>
		vendorId
			? documents.filter((d) => d.vendorId === vendorId)
			: [...documents],
	getDocument: (id: string) => documents.find((d) => d.id === id) ?? null,
	updateDocument: (id: string, patch: Partial<DocumentModel>) => {
		documents = documents.map((d) => (d.id === id ? { ...d, ...patch } : d));
		return documents.find((d) => d.id === id) ?? null;
	},
	addDocument: (doc: Omit<DocumentModel, "id" | "uploadedAt">) => {
		const created: DocumentModel = {
			...doc,
			id: uid("doc"),
			uploadedAt: now(),
		};
		documents = [created, ...documents];
		return created;
	},
	listCertificates: () => [...certificates],
	listContracts: (vendorId?: string) =>
		vendorId
			? contracts.filter((c) => c.vendorId === vendorId)
			: [...contracts],
	getContract: (id: string) => contracts.find((c) => c.id === id) ?? null,
	createContract: (input: Omit<ContractModel, "id" | "updatedAt">) => {
		const created: ContractModel = {
			...input,
			id: uid("ctr"),
			updatedAt: now(),
		};
		contracts = [created, ...contracts];
		return created;
	},
	updateContract: (id: string, patch: Partial<ContractModel>) => {
		contracts = contracts.map((c) =>
			c.id === id ? { ...c, ...patch, updatedAt: now() } : c
		);
		return contracts.find((c) => c.id === id) ?? null;
	},
	listRfx: () => [...rfxEvents],
	getRfx: (id: string) => rfxEvents.find((r) => r.id === id) ?? null,
	createRfx: (input: Omit<RfxModel, "id" | "updatedAt" | "bidCount">) => {
		const created: RfxModel = {
			...input,
			id: uid("rfx"),
			bidCount: 0,
			updatedAt: now(),
		};
		rfxEvents = [created, ...rfxEvents];
		return created;
	},
	updateRfx: (id: string, patch: Partial<RfxModel>) => {
		rfxEvents = rfxEvents.map((r) =>
			r.id === id ? { ...r, ...patch, updatedAt: now() } : r
		);
		return rfxEvents.find((r) => r.id === id) ?? null;
	},
	listBids: (rfxId?: string) =>
		rfxId ? bids.filter((b) => b.rfxId === rfxId) : [...bids],
	submitBid: (input: Omit<BidModel, "id" | "submittedAt" | "status">) => {
		const created: BidModel = {
			...input,
			id: uid("bid"),
			status: "submitted",
			submittedAt: now(),
		};
		bids = [created, ...bids];
		const rfx = rfxEvents.find((r) => r.id === input.rfxId);
		if (rfx) {
			rfx.bidCount += 1;
			rfx.updatedAt = now();
		}
		return created;
	},
	listPurchaseOrders: (vendorId?: string) =>
		vendorId
			? purchaseOrders.filter((p) => p.vendorId === vendorId)
			: [...purchaseOrders],
	getPurchaseOrder: (id: string) =>
		purchaseOrders.find((p) => p.id === id) ?? null,
	createPurchaseOrder: (
		input: Omit<PurchaseOrderModel, "id" | "updatedAt" | "acknowledgedAt">
	) => {
		const created: PurchaseOrderModel = {
			...input,
			id: uid("po"),
			acknowledgedAt: null,
			updatedAt: now(),
		};
		purchaseOrders = [created, ...purchaseOrders];
		return created;
	},
	updatePurchaseOrder: (id: string, patch: Partial<PurchaseOrderModel>) => {
		purchaseOrders = purchaseOrders.map((p) =>
			p.id === id ? { ...p, ...patch, updatedAt: now() } : p
		);
		return purchaseOrders.find((p) => p.id === id) ?? null;
	},
	listInvoices: (vendorId?: string) =>
		vendorId ? invoices.filter((i) => i.vendorId === vendorId) : [...invoices],
	getInvoice: (id: string) => invoices.find((i) => i.id === id) ?? null,
	createInvoice: (input: Omit<InvoiceModel, "id" | "updatedAt">) => {
		const created: InvoiceModel = {
			...input,
			id: uid("inv"),
			updatedAt: now(),
		};
		invoices = [created, ...invoices];
		return created;
	},
	updateInvoice: (id: string, patch: Partial<InvoiceModel>) => {
		invoices = invoices.map((i) =>
			i.id === id ? { ...i, ...patch, updatedAt: now() } : i
		);
		return invoices.find((i) => i.id === id) ?? null;
	},
	listApprovals: () => [...approvals],
	updateApproval: (id: string, status: ApprovalRequestModel["status"]) => {
		approvals = approvals.map((a) => (a.id === id ? { ...a, status } : a));
		return approvals.find((a) => a.id === id) ?? null;
	},
	listScorecards: () => [...scorecards],
	listActivities: (vendorId?: string) =>
		vendorId
			? activities.filter((a) => a.vendorId === vendorId)
			: [...activities],
	listNotifications: () => [...notifications],
	markNotificationRead: (id: string) => {
		notifications = notifications.map((n) =>
			n.id === id ? { ...n, read: true } : n
		);
	},
	listTeam: () => [...teamMembers],
};
