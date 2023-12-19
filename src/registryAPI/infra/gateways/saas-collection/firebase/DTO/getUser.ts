import {
	IsEmail,
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
	Max,
	MaxLength,
	Min,
	MinLength,
} from 'class-validator';

export class FirestoreGetUserDTO {
	@IsUUID()
		id: string;

	@IsString({
		message: 'O campo "name" precisa ser uma string',
	})
	@MaxLength(120, {
		message: 'O campo "name" precisa conter no máximo 120 caracteres',
	})
	@MinLength(2, {
		message: 'O campo "name" precisa conter no mínimo 2 caracteres',
	})
		name: string;

	@IsString({
		message: 'O campo "email" precisa ser uma string',
	})
	@IsEmail(
		{},
		{
			message: 'O campo "email" precisa ser um email válido',
		},
	)
	@MaxLength(320, {
		message: 'O campo "email" precisa conter no máximo 255 caracteres',
	})
		email: string;

	@IsString({
		message: 'O campo "password" precisa ser uma string',
	})
	@MaxLength(64, {
		message: 'O campo "password" precisa conter no máximo 64 caracteres',
	})
	@MinLength(8, {
		message: 'O campo "password" precisa conter no mínimo 8 caracteres',
	})
		password: string;

	@IsString({
		message: 'O campo "CPF" precisa ser uma string',
	})
	@MinLength(11, {
		message: 'O campo "CPF" precisa conter no mínimo 11 caracteres',
	})
	@MaxLength(14, {
		message: 'O campo "CPF" precisa conter no máximo 14 caracteres',
	})
		CPF: string;

	@IsString({
		message: 'O campo "block" precisa ser uma string',
	})
	@MaxLength(6, {
		message: 'O campo "block" precisa conter no máximo 6 caracteres',
	})
	@IsOptional()
		block: string;

	@IsNumber(
		{},
		{
			message: 'O campo "apartmentNumber" precisa ser um número',
		},
	)
	@Max(2147483647, {
		message:
			'O campo "apartmentNumber" precisa ser menor ou igual a 2147483647',
	})
	@Min(0, {
		message: 'O campo "apartmentNumber" precisa ser maior ou igual a 0',
	})
	@IsOptional()
		apartmentNumber: number;

	@IsString({
		message: 'O campo "phoneNumber" precisa ser uma string',
	})
	@MaxLength(30, {
		message: 'O campo "phoneNumber" precisa conter no máximo 30 caracteres',
	})
	@MinLength(10, {
		message: 'O campo "phoneNumber" precisa conter no mínimo 10 caracteres',
	})
		phoneNumber: string;

	@Min(0, {
		message: 'O campo "phoneNumber" precisa ser menor ou igual a 0',
	})
	@Max(2, {
		message: 'O campo "phoneNumber" precisa ser maior ou igual a 2',
	})
		level: number;
}
