import { EnvEnum, GetEnvService } from './getEnv.service';
import { LoggerSpy } from '@tests/adapters/logger.spy';

describe('GetEnvService test', () => {
	let loggerSpy: LoggerSpy;
	let getEnvService: GetEnvService;

	beforeEach(() => {
		loggerSpy = new LoggerSpy();
		getEnvService = new GetEnvService(loggerSpy);
	});

	it('should be able to get a env', async () => {
		const { env } = await getEnvService.exec({ env: EnvEnum.NODE_ENV });
		expect(typeof env === 'string').toEqual(true);
	});
});
