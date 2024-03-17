import { userDTORules } from '@app/entities/user';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class InviteUserDTO {
	@IsString({
		message: 'O CPF precisa conter caracteres válidos',
	})
	@MinLength(userDTORules.CPF.minLength, {
		message: `O CPF precisa conter no mínimo ${userDTORules.CPF.minLength} caracteres`,
	})
	@MaxLength(userDTORules.CPF.maxLength, {
		message: `O CPF precisa conter no máximo ${userDTORules.CPF.maxLength} caracteres`,
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
	@MaxLength(userDTORules.email.maxLength, {
		message: `O email precisa conter no máximo ${userDTORules.email.maxLength} caracteres`,
	})
		email: string;
}
