import { condominiumDTORules } from '@app/entities/condominium';
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
	@MaxLength(condominiumDTORules.name.maxLength, {
		message: `O nome precisa conter no máximo ${condominiumDTORules.name.maxLength} caracteres`,
	})
	@MinLength(condominiumDTORules.name.minLength, {
		message: `O nome precisa conter no mínimo ${condominiumDTORules.name.minLength} caracteres`,
	})
		name?: string;

	@IsString({
		message: 'O nome precisa conter caracteres válidos',
	})
	@IsOptional()
	@MinLength(condominiumDTORules.CEP.minLength, {
		message: `O nome precisa conter no mínimo ${condominiumDTORules.CEP.minLength} caracteres`,
	})
	@MaxLength(condominiumDTORules.CEP.maxLength, {
		message: `O nome precisa conter no máximo ${condominiumDTORules.CEP.maxLength} caracteres`,
	})
		CEP?: string;

	@IsNumber(
		{},
		{
			message: 'O número da rua precisa ser um número',
		},
	)
	@IsOptional()
	@Max(condominiumDTORules.num.maxLength, {
		message: `O número da rua precisa ser menor ou igual a ${condominiumDTORules.num.maxLength}`,
	})
	@Min(condominiumDTORules.num.minLength, {
		message: `O número da rua precisa ser maior ou igual a ${condominiumDTORules.num.minLength}`,
	})
		num?: number;
}
