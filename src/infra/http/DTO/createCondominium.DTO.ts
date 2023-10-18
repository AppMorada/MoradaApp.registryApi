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
	@IsString()
	@IsEmail()
	@MinLength(7)
	@MaxLength(255)
		email: string;

	@ApiProperty()
	@IsString()
	@MaxLength(120)
	@MinLength(2)
		name: string;

	@ApiProperty()
	@IsString()
	@MinLength(8)
	@MaxLength(9)
		CEP: string;

	@ApiProperty()
	@IsNumber()
	@Max(32768)
	@Min(0)
		num: number;

	@ApiProperty()
	@IsString()
	@MaxLength(6)
		block: string;

	@ApiProperty()
	@IsString()
	@MaxLength(18)
	@MinLength(14)
		CNPJ: string;
}
