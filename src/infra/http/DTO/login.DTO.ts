import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDTO {
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

	@ApiProperty()
	@IsString({
		message: 'O campo "password" precisa ser uma string',
	})
	@MaxLength(64, {
		message: 'O campo "password" precisa conter no máximo 64 caracteres',
	})
	@MinLength(8, {
		message: 'O campo "password" precisa conter no mínimo 8 caracteres',
	})
		password: string;
}
