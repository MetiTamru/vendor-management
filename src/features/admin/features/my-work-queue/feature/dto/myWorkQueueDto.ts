/** Transport DTOs for My Work Queue / TPA-TPV tracking. */

export type ApiMigrationStatusDto =
	| "waiting_on_vendor"
	| "testing"
	| "need_testing"
	| "ready"
	| "production_ready"
	| "not_started"
	| "exception";

export type ApiWhitelistStatusDto = "complete" | "pending" | "not_started";

export type ApiVendorTypeDto = "TPA" | "TPV";

export type ApiHistoryEventDto = {
	id: string;
	at: string;
	message: string;
	tone: "orange" | "purple" | "green" | "blue" | "red";
};

export type ApiTpaTpvRecordDto = {
	id: string;
	wave: number;
	name: string;
	code: string;
	type: ApiVendorTypeDto;
	serverType: string;
	contactEmail: string;
	whitelistStatus: ApiWhitelistStatusDto;
	lastCommunication: string;
	status: ApiMigrationStatusDto;
	assignedAnalyst: string;
	lastUpdated: string;
	notes?: string | null;
	primaryContact?: string | null;
	primaryEmail?: string | null;
	primaryPhone?: string | null;
	secondaryContact?: string | null;
	secondaryEmail?: string | null;
	secondaryPhone?: string | null;
	migrationStartDate?: string | null;
	waitingOnVendorDate?: string | null;
	currentStage?: string | null;
	nextStep?: string | null;
	history?: ApiHistoryEventDto[] | null;
	initialContactSentAt?: string | null;
	secondContactSentAt?: string | null;
	responseReceivedAt?: string | null;
	ipAddressesWhitelistedAt?: string | null;
	credentialsProvidedAt?: string | null;
	sftpConnectionConfirmedAt?: string | null;
	progressPercent?: number | null;
	progressUpdatedBy?: string | null;
	progressUpdatedAt?: string | null;
};

export type ApiWorkQueueKpiDto = {
	id: string;
	label: string;
	count: number;
	tone: "blue" | "green" | "orange" | "purple" | "red" | "slate";
};

export type TpaTpvInfoUpdateDto = {
	name: string;
	code: string;
	type: ApiVendorTypeDto;
	wave: number;
	serverType: string;
	notes: string;
};

export type TpaTpvContactsUpdateDto = {
	primaryContact: string;
	primaryEmail: string;
	primaryPhone: string;
	secondaryContact: string;
	secondaryEmail: string;
	secondaryPhone: string;
};

export type TpaTpvMigrationUpdateDto = {
	status: ApiMigrationStatusDto;
	migrationStartDate: string;
	waitingOnVendorDate: string;
	currentStage: string;
	nextStep: string;
};

export type TpaTpvProgressUpdateDto = {
	initialContactSentAt: string;
	secondContactSentAt: string;
	responseReceivedAt: string;
	ipAddressesWhitelistedAt: string;
	credentialsProvidedAt: string;
	sftpConnectionConfirmedAt: string;
	notes: string;
};

export type MyWorkQueueListFiltersDto = {
	search?: string;
	status?: ApiMigrationStatusDto | "all";
	analyst?: string | "all";
	wave?: string | "all";
};
