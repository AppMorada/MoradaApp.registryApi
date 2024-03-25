import { globalRules } from '@app/entities/_rules/global';
import { userRules } from '@app/entities/_rules/user';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDTO {
	@IsString({
		message: 'O nome precisa conter caracteres válidos',
	})
	@IsOptional()
	@MaxLength(globalRules.name.maxLength, {
		message: `O nome precisa conter no máximo ${globalRules.name.maxLength} caracteres`,
	})
	@MinLength(globalRules.name.minLength, {
		message: `O nome precisa conter no mínimo ${globalRules.name.minLength} caracteres`,
	})
		name?: string;

	@IsString({
		message: 'O número de telefone precisa conter caracteres válidos',
	})
	@MaxLength(userRules.phoneNumber.maxLength, {
		message: `O número de telefone precisa conter no máximo ${userRules.phoneNumber.maxLength} caracteres`,
	})
	@MinLength(userRules.phoneNumber.minLength, {
		message: `O número de telefone precisa conter no mínimo ${userRules.phoneNumber.minLength} caracteres`,
	})
	@IsOptional()
		phoneNumber?: string;
}
