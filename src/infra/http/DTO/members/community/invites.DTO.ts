import { condominiumRelUserDTORules } from '@app/entities/condominiumRelUser';
import { userDTORules } from '@app/entities/user';
import { Type } from 'class-transformer';
import {
	IsArray,
	IsEmail,
	IsNumber,
	IsString,
	Max,
	MaxLength,
	Min,
	MinLength,
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
	@MaxLength(userDTORules.email.maxLength, {
		message: `O email precisa conter no máximo ${userDTORules.email.maxLength} caracteres`,
	})
		email: string;

	@IsNumber(
		{},
		{
			message: 'O número do apartamento precisa ser um número',
		},
	)
	@Max(condominiumRelUserDTORules.apartmentNumber.maxLength, {
		message: `O número do apartamento precisa ser menor ou igual a ${condominiumRelUserDTORules.apartmentNumber.maxLength}`,
	})
	@Min(condominiumRelUserDTORules.apartmentNumber.minLength, {
		message: `O número do apartamento precisa ser maior ou igual a ${condominiumRelUserDTORules.apartmentNumber.minLength}`,
	})
		apartmentNumber: number;

	@IsString({
		message: 'O bloco do condomínio precisa conter caracteres válidos',
	})
	@MaxLength(condominiumRelUserDTORules.block.maxLength, {
		message: `O bloco do condomínio precisa conter no máximo ${condominiumRelUserDTORules.block.maxLength} caracteres`,
	})
		block: string;

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
}

export class CommunityInvitesDTO {
	@IsArray({
		message: 'Os convites precisam ser uma lista',
	})
	@Type(() => MembersDTO)
	@ValidateNested({ each: true })
		members: MembersDTO[];
}
