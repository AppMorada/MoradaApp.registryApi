import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDTO {
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
}
