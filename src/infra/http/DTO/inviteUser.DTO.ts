import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class InviteUserDTO {
	@ApiProperty()
	@IsString()
	@IsEmail()
	@MinLength(7)
	@MaxLength(255)
		email: string;
}
