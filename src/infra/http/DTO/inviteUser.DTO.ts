import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class InviteUserDTO {
	@ApiProperty()
	@IsString({
		message: 'O campo "email" precisa ser uma string',
	})
	@IsEmail(
		{},
		{
			message: 'O campo "email" precisa ser um email válido',
		},
	)
	@MinLength(7, {
		message: 'O campo "email" precisa conter no mínimo 7 caracteres',
	})
	@MaxLength(255, {
		message: 'O campo "email" precisa conter no máximo 255 caracteres',
	})
		email: string;
}
