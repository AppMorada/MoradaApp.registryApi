import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AppDTO {
	@ApiProperty()
	@IsString()
		message: string;
}
