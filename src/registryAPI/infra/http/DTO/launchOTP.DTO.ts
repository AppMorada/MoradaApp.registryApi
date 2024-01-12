import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, MaxLength } from 'class-validator';

export class LaunchOTPDTO {
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
		message: 'O campo "OTP" precisa ser uma string',
	})
	@Length(6, 6, {
		message: 'O campo "OTP" precisa conter 6 caracteres',
	})
		OTP: string;
}
