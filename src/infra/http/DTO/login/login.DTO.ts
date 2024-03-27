import { userRules } from '@app/entities/_rules/user';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

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
	@MaxLength(userRules.email.maxLength, {
		message: `O email precisa conter no máximo ${userRules.email.maxLength} caracteres`,
	})
		email: string;

	@IsString({
		message: 'A senha precisa conter caracteres válidos',
	})
	@MaxLength(userRules.password.maxLength, {
		message: `A senha precisa conter no máximo ${userRules.password.maxLength} caracteres`,
	})
	@MinLength(userRules.password.minLength, {
		message: `A senha precisa conter no mínimo ${userRules.password.minLength} caracteres`,
	})
		password: string;
}
