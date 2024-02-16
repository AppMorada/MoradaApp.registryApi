import { BadRequestException } from '@nestjs/common';
import { LayersEnum, LoggerAdapter } from '@app/adapters/logger';
import { Invite } from '@app/entities/invite';
import { Request } from 'express';

interface IProps {
	req: Request;
	body: any;
	invite: Invite;
	logger: LoggerAdapter;
}

export function validateObligatoryFieldsForCommonUser({
	req,
	invite,
	body,
	logger,
}: IProps) {
	if (
		(!body.apartmentNumber && invite.type.value === 0) ||
		(!body.block && invite.type.value === 0)
	) {
		logger.error({
			name: `SessionId(${req.sessionId}): Omissão de campos`,
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
