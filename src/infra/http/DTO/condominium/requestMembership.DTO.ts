import { IsOptional, IsString, MaxLength } from 'class-validator';

export class RequestMembershipDTO {
	@IsString()
	@IsOptional()
	@MaxLength(320)
		message?: string;
}
