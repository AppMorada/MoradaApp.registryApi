import { userDTORules } from '@app/entities/user';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

/** Usado para validar o corpo das requisições de login */
export class StartLoginDTO {
	@IsString({
		message: 'O email precisa conter caracteres válidos',
	})
	@IsEmail(
		{},
		{
			message: 'O email precisa ser um email válido',
		},
	)
	@MaxLength(userDTORules.email.maxLength, {
		message: `O email precisa conter no máximo ${userDTORules.email.maxLength} caracteres`,
	})
		email: string;

	@IsString({
		message: 'A senha precisa conter caracteres válidos',
	})
	@MaxLength(userDTORules.password.maxLength, {
		message: `A senha precisa conter no máximo ${userDTORules.password.maxLength} caracteres`,
	})
	@MinLength(userDTORules.password.minLength, {
		message: `A senha precisa conter no mínimo ${userDTORules.password.minLength} caracteres`,
	})
		password: string;
}
