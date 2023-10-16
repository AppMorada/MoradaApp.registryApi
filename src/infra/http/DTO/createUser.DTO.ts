import { ApiProperty } from '@nestjs/swagger';
import {
	IsEmail,
	IsString,
	Length,
	MaxLength,
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
	@Length(11)
		CPF: string;

	@ApiProperty()
	@IsString()
	@MaxLength(30)
	@MinLength(10)
		phoneNumber: string;
}
