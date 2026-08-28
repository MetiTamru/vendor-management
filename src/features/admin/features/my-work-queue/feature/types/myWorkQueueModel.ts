import type { FeatureListResult } from "@/features/admin/shared/feature-contract";

import type {
	ApiHistoryEventDto,
	ApiMigrationStatusDto,
	ApiTpaTpvRecordDto,
	ApiVendorTypeDto,
	ApiWhitelistStatusDto,
	ApiWorkQueueKpiDto,
} from "../dto/myWorkQueueDto";

export type MigrationStatus = ApiMigrationStatusDto;
export type WhitelistStatus = ApiWhitelistStatusDto;
export type VendorType = ApiVendorTypeDto;
export type HistoryEvent = ApiHistoryEventDto;
export type WorkQueueKpi = ApiWorkQueueKpiDto;

export type TpaTpvModel = Required<
	Pick<
		ApiTpaTpvRecordDto,
		| "id"
		| "wave"
		| "name"
		| "code"
		| "type"
		| "serverType"
		| "contactEmail"
		| "whitelistStatus"
		| "lastCommunication"
		| "status"
		| "assignedAnalyst"
		| "lastUpdated"
	>
> & {
	notes: string;
	primaryContact: string;
	primaryEmail: string;
	primaryPhone: string;
	secondaryContact: string;
	secondaryEmail: string;
	secondaryPhone: string;
	migrationStartDate: string;
	waitingOnVendorDate: string;
	currentStage: string;
	nextStep: string;
	history: HistoryEvent[];
	initialContactSentAt: string;
	secondContactSentAt: string;
	responseReceivedAt: string;
	ipAddressesWhitelistedAt: string;
	credentialsProvidedAt: string;
	sftpConnectionConfirmedAt: string;
	progressPercent: number;
	progressUpdatedBy: string;
	progressUpdatedAt: string;
};

export type MyWorkQueueDashboardModel = {
	kpis: WorkQueueKpi[];
	rows: TpaTpvModel[];
};

export type MyWorkQueueListResult = FeatureListResult<TpaTpvModel>;
