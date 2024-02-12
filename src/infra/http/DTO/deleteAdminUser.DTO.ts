import { ApiProperty } from '@nestjs/swagger';
import { userDTORules } from '@app/entities/user';
import { IsEmail, IsString, MaxLength } from 'class-validator';

/** Usado para validar o corpo das requisições de deleção de usuários */
export class DeleteUserDTO {
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
}
