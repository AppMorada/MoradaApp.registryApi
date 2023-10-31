import { BadRequestException, HttpStatus } from '@nestjs/common';
import { validate } from 'class-validator';

interface IProps {
	body: any;
}

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
