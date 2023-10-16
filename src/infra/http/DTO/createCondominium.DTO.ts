import { ApiProperty } from '@nestjs/swagger';
import {
	IsEmail,
	IsNumber,
	IsString,
	Length,
	Max,
	MaxLength,
	Min,
	MinLength,
} from 'class-validator';

export class CreateCondominiumDTO {
	@ApiProperty()
	@IsString()
	@IsEmail()
		email: string;

	@ApiProperty()
	@IsString()
	@MaxLength(120)
	@MinLength(2)
		name: string;

	@ApiProperty()
	@IsString()
	@Length(8)
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
	@Length(8)
		CNPJ: string;
}
