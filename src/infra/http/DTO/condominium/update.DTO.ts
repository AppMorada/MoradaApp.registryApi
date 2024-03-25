import { condominiumRules } from '@app/entities/_rules/condominium';
import { globalRules } from '@app/entities/_rules/global';
import {
	IsOptional,
	IsNumber,
	IsString,
	Max,
	MaxLength,
	Min,
	MinLength,
} from 'class-validator';

export class UpdateCondominiumDTO {
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
		message: 'O nome precisa conter caracteres válidos',
	})
	@IsOptional()
	@MinLength(condominiumRules.CEP.minLength, {
		message: `O nome precisa conter no mínimo ${condominiumRules.CEP.minLength} caracteres`,
	})
	@MaxLength(condominiumRules.CEP.maxLength, {
		message: `O nome precisa conter no máximo ${condominiumRules.CEP.maxLength} caracteres`,
	})
		CEP?: string;

	@IsNumber(
		{},
		{
			message: 'O número da rua precisa ser um número',
		},
	)
	@IsOptional()
	@Max(condominiumRules.num.maxLength, {
		message: `O número da rua precisa ser menor ou igual a ${condominiumRules.num.maxLength}`,
	})
	@Min(condominiumRules.num.minLength, {
		message: `O número da rua precisa ser maior ou igual a ${condominiumRules.num.minLength}`,
	})
		num?: number;
}
