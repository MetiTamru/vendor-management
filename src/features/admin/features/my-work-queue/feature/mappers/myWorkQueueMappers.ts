import type {
	ApiTpaTpvRecordDto,
	ApiWorkQueueKpiDto,
	TpaTpvContactsUpdateDto,
	TpaTpvInfoUpdateDto,
	TpaTpvMigrationUpdateDto,
	TpaTpvProgressUpdateDto,
} from "../dto/myWorkQueueDto";
import {
	computeMigrationProgressPercent,
	type MigrationProgressMilestones,
} from "../progress";
import type {
	HistoryEvent,
	TpaTpvModel,
	WorkQueueKpi,
} from "../types/myWorkQueueModel";

function str(value: unknown, fallback = ""): string {
	return typeof value === "string" ? value : fallback;
}

export function toHistoryEvent(
	row: Partial<HistoryEvent> & { id?: string },
	index = 0
): HistoryEvent {
	return {
		id: str(row.id, `hist-${index}`),
		at: str(row.at),
		message: str(row.message),
		tone: (row.tone as HistoryEvent["tone"]) ?? "blue",
	};
}

export function toTpaTpvModel(
	row: ApiTpaTpvRecordDto,
	index = 0
): TpaTpvModel {
	const history = Array.isArray(row.history)
		? row.history.map((event, i) => toHistoryEvent(event, i))
		: [];

	return {
		id: str(row.id, `tpa-${index}`),
		wave: typeof row.wave === "number" ? row.wave : Number(row.wave) || 1,
		name: str(row.name, "—"),
		code: str(row.code, "—"),
		type: row.type === "TPV" ? "TPV" : "TPA",
		serverType: str(row.serverType, "New SFTP"),
		contactEmail: str(row.contactEmail),
		whitelistStatus: row.whitelistStatus ?? "not_started",
		lastCommunication: str(row.lastCommunication),
		status: row.status ?? "not_started",
		assignedAnalyst: str(row.assignedAnalyst),
		lastUpdated: str(row.lastUpdated),
		notes: str(row.notes),
		primaryContact: str(row.primaryContact),
		primaryEmail: str(row.primaryEmail),
		primaryPhone: str(row.primaryPhone),
		secondaryContact: str(row.secondaryContact),
		secondaryEmail: str(row.secondaryEmail),
		secondaryPhone: str(row.secondaryPhone),
		migrationStartDate: str(row.migrationStartDate),
		waitingOnVendorDate: str(row.waitingOnVendorDate),
		currentStage: str(row.currentStage, "Not Started"),
		nextStep: str(row.nextStep),
		history,
		initialContactSentAt: str(row.initialContactSentAt),
		secondContactSentAt: str(row.secondContactSentAt),
		responseReceivedAt: str(row.responseReceivedAt),
		ipAddressesWhitelistedAt: str(row.ipAddressesWhitelistedAt),
		credentialsProvidedAt: str(row.credentialsProvidedAt),
		sftpConnectionConfirmedAt: str(row.sftpConnectionConfirmedAt),
		progressPercent:
			typeof row.progressPercent === "number"
				? row.progressPercent
				: computeMigrationProgressPercent({
						initialContactSentAt: str(row.initialContactSentAt),
						secondContactSentAt: str(row.secondContactSentAt),
						responseReceivedAt: str(row.responseReceivedAt),
						ipAddressesWhitelistedAt: str(row.ipAddressesWhitelistedAt),
						credentialsProvidedAt: str(row.credentialsProvidedAt),
						sftpConnectionConfirmedAt: str(
							row.sftpConnectionConfirmedAt
						),
					}),
		progressUpdatedBy: str(row.progressUpdatedBy),
		progressUpdatedAt: str(row.progressUpdatedAt),
	};
}

export function toWorkQueueKpi(row: ApiWorkQueueKpiDto): WorkQueueKpi {
	return {
		id: row.id,
		label: row.label,
		count: row.count,
		tone: row.tone,
	};
}

export function toTpaTpvInfoUpdateDto(
	model: Pick<
		TpaTpvModel,
		"name" | "code" | "type" | "wave" | "serverType" | "notes"
	>
): TpaTpvInfoUpdateDto {
	return {
		name: model.name,
		code: model.code,
		type: model.type,
		wave: model.wave,
		serverType: model.serverType,
		notes: model.notes,
	};
}

export function toTpaTpvContactsUpdateDto(
	model: Pick<
		TpaTpvModel,
		| "primaryContact"
		| "primaryEmail"
		| "primaryPhone"
		| "secondaryContact"
		| "secondaryEmail"
		| "secondaryPhone"
	>
): TpaTpvContactsUpdateDto {
	return {
		primaryContact: model.primaryContact,
		primaryEmail: model.primaryEmail,
		primaryPhone: model.primaryPhone,
		secondaryContact: model.secondaryContact,
		secondaryEmail: model.secondaryEmail,
		secondaryPhone: model.secondaryPhone,
	};
}

export function toTpaTpvMigrationUpdateDto(
	model: Pick<
		TpaTpvModel,
		| "status"
		| "migrationStartDate"
		| "waitingOnVendorDate"
		| "currentStage"
		| "nextStep"
	>
): TpaTpvMigrationUpdateDto {
	return {
		status: model.status,
		migrationStartDate: model.migrationStartDate,
		waitingOnVendorDate: model.waitingOnVendorDate,
		currentStage: model.currentStage,
		nextStep: model.nextStep,
	};
}

export function toTpaTpvProgressUpdateDto(
	model: Pick<
		TpaTpvModel,
		| "initialContactSentAt"
		| "secondContactSentAt"
		| "responseReceivedAt"
		| "ipAddressesWhitelistedAt"
		| "credentialsProvidedAt"
		| "sftpConnectionConfirmedAt"
		| "notes"
	>
): TpaTpvProgressUpdateDto {
	return {
		initialContactSentAt: model.initialContactSentAt,
		secondContactSentAt: model.secondContactSentAt,
		responseReceivedAt: model.responseReceivedAt,
		ipAddressesWhitelistedAt: model.ipAddressesWhitelistedAt,
		credentialsProvidedAt: model.credentialsProvidedAt,
		sftpConnectionConfirmedAt: model.sftpConnectionConfirmedAt,
		notes: model.notes,
	};
}

export function milestonesFromProgressUpdate(
	body: TpaTpvProgressUpdateDto
): MigrationProgressMilestones {
	return {
		initialContactSentAt: body.initialContactSentAt,
		secondContactSentAt: body.secondContactSentAt,
		responseReceivedAt: body.responseReceivedAt,
		ipAddressesWhitelistedAt: body.ipAddressesWhitelistedAt,
		credentialsProvidedAt: body.credentialsProvidedAt,
		sftpConnectionConfirmedAt: body.sftpConnectionConfirmedAt,
	};
}
