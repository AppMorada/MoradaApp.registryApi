import { ApiProperty } from '@nestjs/swagger';
import { userDTORules } from '@registry:app/entities/user';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

/** Usado para validar o corpo das requisições de login */
export class StartLoginDTO {
	@ApiProperty()
	@IsString({
		message: 'O campo "email" precisa conter caracteres válidos',
	})
	@IsEmail(
		{},
		{
			message: 'O campo "email" precisa ser um email válido',
		},
	)
	@MaxLength(userDTORules.email.maxLength, {
		message: `O campo "email" precisa conter no máximo ${userDTORules.email.maxLength} caracteres`,
	})
		email: string;

	@ApiProperty()
	@IsString({
		message: 'O campo "password" precisa conter caracteres válidos',
	})
	@MaxLength(userDTORules.password.maxLength, {
		message: `O campo "password" precisa conter no máximo ${userDTORules.password.maxLength} caracteres`,
	})
	@MinLength(userDTORules.password.minLength, {
		message: `O campo "password" precisa conter no mínimo ${userDTORules.password.minLength} caracteres`,
	})
		password: string;
}
