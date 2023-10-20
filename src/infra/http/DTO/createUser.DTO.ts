import { ApiProperty } from '@nestjs/swagger';
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

export class CreateUserDTO {
	@ApiProperty()
	@IsString()
	@MaxLength(120)
	@MinLength(2)
		name: string;

	@ApiProperty()
	@IsString()
	@IsEmail()
	@MinLength(7)
	@MaxLength(255)
		email: string;

	@ApiProperty()
	@IsString()
	@MaxLength(64)
	@MinLength(8)
		password: string;

	@ApiProperty()
	@IsString()
	@MinLength(11)
	@MaxLength(14)
		CPF: string;

	@ApiProperty()
	@IsString()
	@MaxLength(6)
	@IsOptional()
		block: string;

	@ApiProperty()
	@IsNumber()
	@Max(32768)
	@Min(0)
	@IsOptional()
		apartmentNumber: number;

	@ApiProperty()
	@IsString()
	@MaxLength(30)
	@MinLength(10)
		phoneNumber: string;
}
