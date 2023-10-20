import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class DeleteUserDTO {
	@ApiProperty()
	@IsString()
	@IsEmail()
	@MinLength(7)
	@MaxLength(255)
		email: string;
}
