import { condominiumRelUserRules } from '@app/entities/_rules/condominiumRelUser';
import {
	IsOptional,
	IsNumber,
	IsString,
	Max,
	MaxLength,
	Min,
} from 'class-validator';

export class UpdateCommunityMemberDTO {
	@IsNumber(
		{},
		{
			message: 'O número do apartamento precisa ser um número',
		},
	)
	@IsOptional()
	@Max(condominiumRelUserRules.apartmentNumber.maxLength, {
		message: `O número do apartamento precisa ser menor ou igual a ${condominiumRelUserRules.apartmentNumber.maxLength}`,
	})
	@Min(condominiumRelUserRules.apartmentNumber.minLength, {
		message: `O número do apartamento precisa ser maior ou igual a ${condominiumRelUserRules.apartmentNumber.minLength}`,
	})
		apartmentNumber?: number;

	@IsString({
		message: 'O bloco do condomínio precisa conter caracteres válidos',
	})
	@IsOptional()
	@MaxLength(condominiumRelUserRules.block.maxLength, {
		message: `O bloco do condomínio precisa conter no máximo ${condominiumRelUserRules.block.maxLength} caracteres`,
	})
		block?: string;
}
