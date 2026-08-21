import type { ProgramFileType } from "@/types/UI/system.types";

import type { MemberSummaryDto } from "../../feature/dto/membersDto";
import type { MembersModel } from "../../feature/types/membersModel";
import type { ApiMembersRecordDto } from "../dto/membersRecordDto";

function str(value: unknown, fallback = ""): string {
	return typeof value === "string" && value.length > 0 ? value : fallback;
}

export function toMembersModel(
	row: ApiMembersRecordDto,
	index = 0
): MembersModel {
	const id = row.id != null ? String(row.id) : `members-${index}`;
	const nameFromParts = [row.firstName, row.middleName, row.lastName]
		.filter((part): part is string => typeof part === "string" && part.length > 0)
		.join(" ");
	const name =
		typeof row.name === "string" && row.name.length > 0
			? row.name
			: nameFromParts || "—";
	return { id, name };
}

export function toMemberSummaryFromRecord(
	row: ApiMembersRecordDto,
	index = 0
): MemberSummaryDto {
	const id = row.id != null ? String(row.id) : `mem-${index + 1}`;
	const program = (row.program as ProgramFileType) ?? "MDH";
	const status =
		row.status === "inactive" ||
		row.status === "pending" ||
		row.status === "termed"
			? row.status
			: "active";

	return {
		id,
		memberId: str(row.memberId, `M${String(100000000 + index)}`),
		alternateId: row.alternateId ?? undefined,
		firstName: str(row.firstName, "Unknown"),
		middleName: row.middleName ?? undefined,
		lastName: str(row.lastName, "Member"),
		dob: str(row.dob, "1980-01-01"),
		gender:
			row.gender === "Female" ||
			row.gender === "Other" ||
			row.gender === "Unknown"
				? row.gender
				: "Male",
		ssnLast4: str(row.ssnLast4, "0000"),
		phone: str(row.phone, "—"),
		email: str(row.email, "—"),
		addressLine1: str(row.addressLine1, "—"),
		city: str(row.city, "—"),
		state: str(row.state, "DC"),
		zip: str(row.zip, "00000"),
		status,
		eligibilityLabel:
			row.eligibilityLabel === "Inactive" ||
			row.eligibilityLabel === "Pending" ||
			row.eligibilityLabel === "Termed"
				? row.eligibilityLabel
				: "Active",
		accountGroup: row.accountGroup ?? undefined,
		program,
		planName: str(row.planName, "—"),
		planType: str(row.planType, "—"),
		lob: str(row.lob, "Medical"),
		pcpName: str(row.pcpName, "—"),
		pcpNpi: str(row.pcpNpi, "—"),
		memberSince: str(row.memberSince, "2026-01-01"),
		coverageEffectiveDate: row.coverageEffectiveDate ?? undefined,
		lastClaimDate: row.lastClaimDate ?? null,
		claimsYtd: typeof row.claimsYtd === "number" ? row.claimsYtd : 0,
		paidYtd: typeof row.paidYtd === "number" ? row.paidYtd : 0,
		vendorSource: str(row.vendorSource, "—"),
	};
}
