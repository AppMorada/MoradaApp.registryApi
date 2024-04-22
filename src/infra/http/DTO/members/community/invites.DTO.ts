import { condominiumRelUserRules } from '@app/entities/_rules/condominiumRelUser';
import { userRules } from '@app/entities/_rules/user';
import { Type } from 'class-transformer';
import {
	IsArray,
	IsEmail,
	IsNumber,
	IsString,
	Max,
	MaxLength,
	Min,
	ValidateNested,
} from 'class-validator';

class MembersDTO {
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

	@IsNumber(
		{},
		{
			message: 'O número do apartamento precisa ser um número',
		},
	)
	@Max(condominiumRelUserRules.apartmentNumber.maxLength, {
		message: `O número do apartamento precisa ser menor ou igual a ${condominiumRelUserRules.apartmentNumber.maxLength}`,
	})
	@Min(condominiumRelUserRules.apartmentNumber.minLength, {
		message: `O número do apartamento precisa ser maior ou igual a ${condominiumRelUserRules.apartmentNumber.minLength}`,
	})
		apartmentNumber: number;

	@IsString({
		message: 'O bloco do condomínio precisa conter caracteres válidos',
	})
	@MaxLength(condominiumRelUserRules.block.maxLength, {
		message: `O bloco do condomínio precisa conter no máximo ${condominiumRelUserRules.block.maxLength} caracteres`,
	})
		block: string;
}

export class CommunityInvitesDTO {
	@IsArray({
		message: 'Os convites precisam ser uma lista',
	})
	@Type(() => MembersDTO)
	@ValidateNested({ each: true })
		members: MembersDTO[];
}
