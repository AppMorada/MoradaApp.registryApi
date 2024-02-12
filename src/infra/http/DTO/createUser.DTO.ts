import { ApiProperty } from '@nestjs/swagger';
import { condominiumRelUserDTORules } from '@app/entities/condominiumRelUser';
import { userDTORules } from '@app/entities/user';
import {
	IsEmail,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	MaxLength,
	Min,
	MinLength,
} from 'class-validator';

/** Usado para validar o corpo das requisições de criação de usuário */
export class CreateUserDTO {
	@ApiProperty()
	@IsString({
		message: 'O campo "name" precisa conter caracteres válidos',
	})
	@MaxLength(userDTORules.name.maxLength, {
		message: `O campo "name" precisa conter no máximo ${userDTORules.name.maxLength} caracteres`,
	})
	@MinLength(userDTORules.name.minLength, {
		message: `O campo "name" precisa conter no mínimo ${userDTORules.name.minLength} caracteres`,
	})
		name: string;

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
		message: 'O campo "password" precisa conter caracteres válidos',
	})
	@MaxLength(userDTORules.password.maxLength, {
		message: `O campo "password" precisa conter no máximo ${userDTORules.password.maxLength} caracteres`,
	})
	@MinLength(userDTORules.password.minLength, {
		message: `O campo "password" precisa conter no mínimo ${userDTORules.password.minLength} caracteres`,
	})
		password: string;

	@ApiProperty()
	@IsString({
		message: 'O campo "CPF" precisa conter caracteres válidos',
	})
	@MinLength(userDTORules.CPF.minLength, {
		message: `O campo "CPF" precisa conter no mínimo ${userDTORules.CPF.minLength} caracteres`,
	})
	@MaxLength(userDTORules.CPF.maxLength, {
		message: `O campo "CPF" precisa conter no máximo ${userDTORules.CPF.maxLength} caracteres`,
	})
		CPF: string;

	@ApiProperty()
	@IsString({
		message: 'O campo "block" precisa conter caracteres válidos',
	})
	@MaxLength(condominiumRelUserDTORules.block.maxLength, {
		message: `O campo "block" precisa conter no máximo ${condominiumRelUserDTORules.block.maxLength} caracteres`,
	})
	@IsOptional()
		block: string;

	@ApiProperty()
	@IsNumber(
		{},
		{
			message: 'O campo "apartmentNumber" precisa ser um número',
		},
	)
	@Max(condominiumRelUserDTORules.apartmentNumber.maxLength, {
		message: `O campo "apartmentNumber" precisa ser menor ou igual a ${condominiumRelUserDTORules.apartmentNumber.maxLength}`,
	})
	@Min(condominiumRelUserDTORules.apartmentNumber.minLength, {
		message: `O campo "apartmentNumber" precisa ser maior ou igual a ${condominiumRelUserDTORules.apartmentNumber.minLength}`,
	})
	@IsOptional()
		apartmentNumber: number;

	@ApiProperty()
	@IsString({
		message: 'O campo "phoneNumber" precisa conter caracteres válidos',
	})
	@MaxLength(userDTORules.phoneNumber.maxLength, {
		message: `O campo "phoneNumber" precisa conter no máximo ${userDTORules.phoneNumber.maxLength} caracteres`,
	})
	@MinLength(userDTORules.phoneNumber.minLength, {
		message: `O campo "phoneNumber" precisa conter no mínimo ${userDTORules.phoneNumber.minLength} caracteres`,
	})
		phoneNumber: string;
}
