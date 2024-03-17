import { userDTORules } from '@app/entities/user';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateEmployeeMemberDTO {
	@IsString({
		message: 'O nome precisa conter caracteres válidos',
	})
	@IsOptional()
	@MaxLength(userDTORules.name.maxLength, {
		message: `O nome precisa conter no máximo ${userDTORules.name.maxLength} caracteres`,
	})
	@MinLength(userDTORules.name.minLength, {
		message: `O nome precisa conter no mínimo ${userDTORules.name.minLength} caracteres`,
	})
		name?: string;

	@IsString({
		message: 'O número de telefone precisa conter caracteres válidos',
	})
	@IsOptional()
	@MaxLength(userDTORules.phoneNumber.maxLength, {
		message: `O número de telefone precisa conter no máximo ${userDTORules.phoneNumber.maxLength} caracteres`,
	})
	@MinLength(userDTORules.phoneNumber.minLength, {
		message: `O número de telefone precisa conter no mínimo ${userDTORules.phoneNumber.minLength} caracteres`,
	})
	@IsOptional()
		phoneNumber?: string;
}
