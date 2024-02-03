import { BadRequestException } from '@nestjs/common';
import { LayersEnum, LoggerAdapter } from '@registry:app/adapters/logger';
import { Invite } from '@registry:app/entities/invite';

interface IProps {
	body: any;
	invite: Invite;
	logger: LoggerAdapter;
}

export function validateObligatoryFieldsForCommonUser({
	invite,
	body,
	logger,
}: IProps) {
	if (
		(!body.apartmentNumber && invite.type.value === 0) ||
		(!body.block && invite.type.value === 0)
	) {
		logger.error({
			name: 'Omissão de campos',
			layer: LayersEnum.dto,
			description:
				'Número do apartamento e bloco do condomínio não devem ser omitidos em usuários comuns',
		});

		throw new BadRequestException({
			message: [
				'Número do apartamento e bloco do condomínio não devem ser omitidos em usuários comuns',
			],
			error: 'Bad Request',
			statusCode: 400,
		});
	}
}
