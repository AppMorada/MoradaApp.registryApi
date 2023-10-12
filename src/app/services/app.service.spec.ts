import { Test } from '@nestjs/testing';
import { AppService } from './app.service';

describe('App Service Test', () => {
	let appService: AppService;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [AppService],
		}).compile();

		appService = moduleRef.get(AppService);
	});

	it('should be able to test app service', () => {
		expect(appService.exec({ message: 'test' })).toEqual('Message 1: test');
	});
});
