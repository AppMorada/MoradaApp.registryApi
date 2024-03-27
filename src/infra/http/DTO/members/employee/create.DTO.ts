import { globalRules } from '@app/entities/_rules/global';
import { userRules } from '@app/entities/_rules/user';
import {
	IsOptional,
	IsEmail,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';

export class CreateEmployeeMemberDTO {
	@IsString({
		message: 'O nome precisa conter caracteres válidos',
	})
	@MaxLength(globalRules.name.maxLength, {
		message: `O nome precisa conter no máximo ${globalRules.name.maxLength} caracteres`,
	})
	@MinLength(globalRules.name.minLength, {
		message: `O nome precisa conter no mínimo ${globalRules.name.minLength} caracteres`,
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
		message: 'O número do telefone precisa conter caracteres válidos',
	})
	@MaxLength(userRules.phoneNumber.maxLength, {
		message: `O número do telefone precisa conter no máximo ${userRules.phoneNumber.maxLength} caracteres`,
	})
	@MinLength(userRules.phoneNumber.minLength, {
		message: `O número do telefone precisa conter no mínimo ${userRules.phoneNumber.minLength} caracteres`,
	})
	@IsOptional()
		phoneNumber: string;
}
