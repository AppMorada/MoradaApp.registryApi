import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength } from 'class-validator';

export class DeleteUserDTO {
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
	@MaxLength(320, {
		message: 'O campo "email" precisa conter no máximo 255 caracteres',
	})
		email: string;
}
