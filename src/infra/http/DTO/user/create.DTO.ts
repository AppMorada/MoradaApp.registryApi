import { userDTORules } from '@app/entities/user';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDTO {
	@IsString({
		message: 'O nome precisa conter caracteres válidos',
	})
	@MaxLength(userDTORules.name.maxLength, {
		message: `O nome precisa conter no máximo ${userDTORules.name.maxLength} caracteres`,
	})
	@MinLength(userDTORules.name.minLength, {
		message: `O nome precisa conter no mínimo ${userDTORules.name.minLength} caracteres`,
	})
		name: string;

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
		message: 'O código precisa conter caracteres válidos',
	})
		code: string;
}
