import type { ProgramFileType } from "@/types/UI/system.types";

import type { ApiMembersRecordDto } from "../../shared/dto/membersRecordDto";

export type ApiMembersDto = ApiMembersRecordDto;

export type MemberStatusDto = "active" | "inactive" | "pending" | "termed";
export type EligibilityStatusDto =
	| "eligible"
	| "termed"
	| "pending"
	| "ineligible";
export type ClaimStatusDto = "paid" | "denied" | "pending" | "partial";
export type ExceptionStatusDto = "open" | "in_progress" | "resolved";

export type MemberSummaryDto = {
	id: string;
	memberId: string;
	alternateId?: string;
	firstName: string;
	middleName?: string;
	lastName: string;
	dob: string;
	gender: "Male" | "Female" | "Other" | "Unknown";
	ssnLast4: string;
	phone: string;
	email: string;
	addressLine1: string;
	addressLine2?: string;
	city: string;
	state: string;
	zip: string;
	status: MemberStatusDto;
	eligibilityLabel?: "Active" | "Inactive" | "Pending" | "Termed";
	accountGroup?: string;
	program: ProgramFileType;
	planName: string;
	planType: string;
	lob: string;
	pcpName: string;
	pcpNpi: string;
	memberSince: string;
	coverageEffectiveDate?: string;
	lastClaimDate: string | null;
	claimsYtd: number;
	paidYtd: number;
	vendorSource: string;
};

export type OtherStatusDto = {
	id: string;
	slot: string;
	status: string;
	detail: string;
	effectiveStart: string | null;
	effectiveEnd: string | null;
};

export type DependentDto = {
	id: string;
	name: string;
	relationship: "Self" | "Spouse" | "Daughter" | "Son" | "Other";
	dob: string;
	gender: string;
	coverageStatus: MemberStatusDto;
	memberId?: string;
	pcpName?: string;
	planName?: string;
};

export type AccumulatorDto = {
	id: string;
	label: string;
	individual: number;
	family: number;
	remaining: number;
	limit: number;
};

export type MemberClaimDto = {
	id: string;
	dos: string;
	claimNumber: string;
	type: "Medical" | "Pharmacy" | "Dental" | "Vision" | "Encounter";
	provider: string;
	billed: number;
	paid: number;
	status: ClaimStatusDto;
};

export type MemberOverviewDto = {
	eligibilityStatus: EligibilityStatusDto;
	coverageStart: string;
	coverageEnd: string | null;
	planId: string;
	planCode?: string;
	benefitPackage?: string;
	coverageLevelCode?: string;
	coverageLevel?: string;
	secondaryCoverage?: string;
	statusEffectiveDate?: string;
	statusTermDate?: string | null;
	enrollmentDate?: string;
	disenrollmentDate?: string | null;
	lastEligibilityUpdate?: string;
	groupId?: string;
	groupName?: string;
	clientId?: string;
	accountType?: string;
	accountStatus?: "Active" | "Inactive";
	memberType?: string;
	personCode?: string;
	relationshipCode?: string;
	externalId?: string;
	employeeType?: string;
	sourceSystem?: string;
	sourceFileName?: string;
	sourceFileReceived?: string;
	recordStatus?: string;
	changeDetected?: string;
	dataAsOf: string;
	dependents: DependentDto[];
	claims: MemberClaimDto[];
	accumulators: AccumulatorDto[];
	otherStatuses: OtherStatusDto[];
};

export type MembersCreateDto = {
	memberId: string;
	firstName: string;
	lastName: string;
	program: ProgramFileType;
	planName: string;
};

export type MembersUpdateDto = Partial<MembersCreateDto> & {
	status?: MemberStatusDto;
	eligibilityLabel?: MemberSummaryDto["eligibilityLabel"];
	accountGroup?: string;
	alternateId?: string;
};
