import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { EnvEnum, GetEnvService } from './getEnv.service';
import { LoggerSpy } from '@tests/adapters/logger.spy';
import { InMemorySecret } from '@tests/inMemoryDatabase/secret';

describe('GetEnvService test', () => {
	let container: InMemoryContainer;
	let secretRepo: InMemorySecret;
	let loggerSpy: LoggerSpy;
	let getEnvService: GetEnvService;

	beforeEach(() => {
		container = new InMemoryContainer();
		secretRepo = new InMemorySecret(container);
		loggerSpy = new LoggerSpy();

		getEnvService = new GetEnvService(loggerSpy, secretRepo);
	});

	it('should be able to get a env', async () => {
		const { env } = await getEnvService.exec({ env: EnvEnum.NODE_ENV });
		expect(typeof env === 'string').toEqual(true);
	});
});
