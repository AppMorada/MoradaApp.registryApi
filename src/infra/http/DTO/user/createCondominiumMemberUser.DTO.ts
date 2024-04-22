import { condominiumRules } from '@app/entities/_rules/condominium';
import { globalRules } from '@app/entities/_rules/global';
import { userRules } from '@app/entities/_rules/user';
import {
	IsEmail,
	IsString,
	Length,
	MaxLength,
	MinLength,
} from 'class-validator';

export class CreateCondominiumMemberUserDTO {
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

	@IsString()
	@Length(condominiumRules.code.length, condominiumRules.code.length, {
		message: `O código precisa conter ${condominiumRules.code.length} caracteres`,
	})
		condominiumHumanReadableId: string;
}
