import { ApiProperty } from '@nestjs/swagger';
import {
	IsEmail,
	IsNumber,
	IsString,
	Max,
	MaxLength,
	Min,
	MinLength,
} from 'class-validator';

export class CreateCondominiumDTO {
	@ApiProperty()
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

	@ApiProperty()
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

	@ApiProperty()
	@IsString({
		message: 'O campo "CEP" precisa ser uma string',
	})
	@MinLength(8, {
		message: 'O campo "CEP" precisa conter no mínimo 8 caracteres',
	})
	@MaxLength(9, {
		message: 'O campo "CEP" precisa conter no máximo 9 caracteres',
	})
		CEP: string;

	@ApiProperty()
	@IsNumber(
		{},
		{
			message: 'O campo "num" precisa ser um número',
		},
	)
	@Max(32768, {
		message: 'O campo "num" precisa ser menor ou igual a 32768',
	})
	@Min(0, {
		message: 'O campo "num" precisa ser maior ou igual a 0',
	})
		num: number;

	@ApiProperty()
	@IsString({
		message: 'O campo "CNPJ" precisa ser uma string',
	})
	@MaxLength(18, {
		message: 'O campo "CNPJ" precisa conter no máximo 18 caracteres',
	})
	@MinLength(14, {
		message: 'O campo "CNPJ" precisa conter no mínimo 14 caracteres',
	})
		CNPJ: string;
}
