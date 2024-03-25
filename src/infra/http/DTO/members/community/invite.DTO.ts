import { userRules } from '@app/entities/_rules/user';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class InviteUserDTO {
	@IsString({
		message: 'O CPF precisa conter caracteres válidos',
	})
	@MinLength(userRules.CPF.minLength, {
		message: `O CPF precisa conter no mínimo ${userRules.CPF.minLength} caracteres`,
	})
	@MaxLength(userRules.CPF.maxLength, {
		message: `O CPF precisa conter no máximo ${userRules.CPF.maxLength} caracteres`,
	})
		CPF: string;

	@IsString({
		message: 'O email precisa conter caracteres válidos',
	})
	@IsEmail(
		{},
		{
			message: 'O email precisa ser um email válido',
		},
	)
	@MaxLength(userRules.email.maxLength, {
		message: `O email precisa conter no máximo ${userRules.email.maxLength} caracteres`,
	})
		email: string;
}
