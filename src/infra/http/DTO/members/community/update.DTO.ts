import { condominiumRelUserDTORules } from '@app/entities/condominiumRelUser';
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
	@Max(condominiumRelUserDTORules.apartmentNumber.maxLength, {
		message: `O número do apartamento precisa ser menor ou igual a ${condominiumRelUserDTORules.apartmentNumber.maxLength}`,
	})
	@Min(condominiumRelUserDTORules.apartmentNumber.minLength, {
		message: `O número do apartamento precisa ser maior ou igual a ${condominiumRelUserDTORules.apartmentNumber.minLength}`,
	})
		apartmentNumber?: number;

	@IsString({
		message: 'O bloco do condomínio precisa conter caracteres válidos',
	})
	@IsOptional()
	@MaxLength(condominiumRelUserDTORules.block.maxLength, {
		message: `O bloco do condomínio precisa conter no máximo ${condominiumRelUserDTORules.block.maxLength} caracteres`,
	})
		block?: string;
}
