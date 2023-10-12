import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AppService } from 'src/app/services/app.service';
import { AppDTO } from '../DTO/app.DTO';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Post()
	@HttpCode(200)
	message(@Body() body: AppDTO) {
		return this.appService.exec(body);
	}
}
