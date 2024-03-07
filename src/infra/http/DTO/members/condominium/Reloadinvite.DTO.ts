import { userDTORules } from '@app/entities/user';
import { IsEmail, IsString, MaxLength } from 'class-validator';

export class ReloadInviteUserDTO {
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
