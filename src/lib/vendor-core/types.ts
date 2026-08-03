/**
 * Types for Vendor Management Core (Django) REST envelope + Phase 1 intake domain.
 */

export type ApiEnvelope<T> = {
	status: "success" | "error";
	result: T;
	meta?: { version?: string };
	message?: string;
};

export type PaginatedResult<T> = {
	limit: number;
	offset: number;
	count: number;
	next: string | null;
	previous: string | null;
	results: T[];
};

export type VendorDto = {
	id: string;
	code: string;
	name: string;
	status: string;
	created_at?: string;
	updated_at?: string;
};

export type ConnectionDto = {
	id: string;
	name: string;
	vendor: string;
	account: string | null;
	method: string;
	direction: string;
	environment: string;
	status: string;
	config: Record<string, unknown>;
	health: {
		last_success_at?: string;
		last_failure_at?: string;
		last_error?: string;
		current_status?: string;
	};
	created_at?: string;
	updated_at?: string;
};

export type IntakeJobDto = {
	id: string;
	name: string;
	connection: string;
	vendor: string;
	file_type: string;
	filename_pattern: string;
	schedule_cron: string;
	schedule_timezone: string;
	status: string;
	destination_module: string;
	created_at?: string;
};

export type InboundFileDto = {
	id: string;
	original_filename: string;
	checksum_sha256: string;
	size_bytes: number;
	detected_type: string;
	destination_module: string;
	stage: string;
	source: string;
	vendor: string | null;
	job: string | null;
	created_at?: string;
};

export type ErrorRecordDto = {
	id: string;
	category: string;
	stage: string;
	code: string;
	technical_message: string;
	business_explanation: string;
	retry_eligible: boolean;
	retry_count: number;
	status: string;
	created_at?: string;
};

export type MonitoringDashboardDto = {
	connections: Array<{
		id: string;
		name: string;
		method: string;
		status: string;
		health: ConnectionDto["health"];
	}>;
	recent_runs: Array<{
		id: string;
		job_id: string;
		job__name: string;
		stage: string;
		files_found: number;
		files_downloaded: number;
		files_processed: number;
		files_rejected: number;
		started_at: string | null;
		finished_at: string | null;
		error_summary: string;
	}>;
	inbound_file_stages: Array<{ stage: string; count: number }>;
	active_jobs: Array<{
		id: string;
		name: string;
		schedule_cron: string;
		schedule_timezone: string;
		connection_id: string;
	}>;
};

export type TokenPair = {
	access: string;
	refresh: string;
};
