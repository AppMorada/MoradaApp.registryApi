import { ApiProperty } from '@nestjs/swagger';
import { condominiumDTORules } from '@registry:app/entities/condominium';
import { userDTORules } from '@registry:app/entities/user';
import {
	IsEmail,
	IsNumber,
	IsString,
	Max,
	MaxLength,
	Min,
	MinLength,
} from 'class-validator';

/** Usado para validar o corpo das requisições de criação de condomínio */
export class CreateCondominiumDTO {
	@ApiProperty()
	@IsString({
		message: 'O campo "email" precisa conter caracteres válidos',
	})
	@IsEmail(
		{},
		{
			message: 'O campo "email" precisa ser um email válido',
		},
	)
	@MaxLength(userDTORules.email.maxLength, {
		message: `O campo "email" precisa conter no máximo ${userDTORules.email.maxLength} caracteres`,
	})
		email: string;

	@ApiProperty()
	@IsString({
		message: 'O campo "name" precisa conter caracteres válidos',
	})
	@MaxLength(condominiumDTORules.name.maxLength, {
		message: `O campo "name" precisa conter no máximo ${condominiumDTORules.name.maxLength} caracteres`,
	})
	@MinLength(condominiumDTORules.name.minLength, {
		message: `O campo "name" precisa conter no mínimo ${condominiumDTORules.name.minLength} caracteres`,
	})
		name: string;

	@ApiProperty()
	@IsString({
		message: 'O campo "CEP" precisa conter caracteres válidos',
	})
	@MinLength(condominiumDTORules.CEP.minLength, {
		message: `O campo "CEP" precisa conter no mínimo ${condominiumDTORules.CEP.minLength} caracteres`,
	})
	@MaxLength(condominiumDTORules.CEP.maxLength, {
		message: `O campo "CEP" precisa conter no máximo ${condominiumDTORules.CEP.maxLength} caracteres`,
	})
		CEP: string;

	@ApiProperty()
	@IsNumber(
		{},
		{
			message: 'O campo "num" precisa ser um número',
		},
	)
	@Max(condominiumDTORules.num.maxLength, {
		message: `O campo "num" precisa ser menor ou igual a ${condominiumDTORules.num.maxLength}`,
	})
	@Min(condominiumDTORules.num.minLength, {
		message: `O campo "num" precisa ser maior ou igual a ${condominiumDTORules.num.minLength}`,
	})
		num: number;

	@ApiProperty()
	@IsString({
		message: 'O campo "CNPJ" precisa conter caracteres válidos',
	})
	@MaxLength(condominiumDTORules.CNPJ.maxLength, {
		message: `O campo "CNPJ" precisa conter no máximo ${condominiumDTORules.CNPJ.maxLength} caracteres`,
	})
	@MinLength(condominiumDTORules.CNPJ.minLength, {
		message: `O campo "CNPJ" precisa conter no mínimo ${condominiumDTORules.CNPJ.minLength} caracteres`,
	})
		CNPJ: string;
}
