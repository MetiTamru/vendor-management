import type { ApiRoutingRulesDto } from "../dto/routingRulesDto";
import type { RoutingRulesModel } from "../types/routingRulesModel";

export function toRoutingRulesModel(
	dto: ApiRoutingRulesDto
): RoutingRulesModel {
	return {
		id: dto.id,
		name: dto.name,
		priority: dto.priority,
		isActive: dto.is_active,
		destinationModule: dto.destination_module,
		ediType: dto.edi_type,
		parser: dto.parser,
	};
}
