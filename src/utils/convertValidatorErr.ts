import { BadRequestException, HttpStatus } from '@nestjs/common';
import { validate } from 'class-validator';

interface IProps {
	body: any;
}

/**
 * Usado para aplicar o class validator fora dos controllers
 * em forma de decorator, caso a validação não seja um sucesso, um erro do tipo BadRequestException será disparado
 * @param data - Deve conter o corpo da requisição a ser validado
 **/
export async function checkClassValidatorErrors(data: IProps) {
	const errors = await validate(data.body);

	const errorMessages = errors.flatMap(({ constraints }) =>
		Object.values(constraints!),
	);

	if (errorMessages.length > 0) {
		throw new BadRequestException({
			statusCode: HttpStatus.BAD_REQUEST,
			error: 'Bad Request',
			message: errorMessages,
		});
	}
}
