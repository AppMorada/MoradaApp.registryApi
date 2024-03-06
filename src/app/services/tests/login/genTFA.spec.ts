import { CryptSpy } from '@tests/adapters/cryptSpy';
import { GenTFAService } from '../../login/genTFA.service';
import { userFactory } from '@tests/factories/user';
import { InMemoryUser } from '@tests/inMemoryDatabase/user';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepo } from '@app/repositories/user';
import { CryptAdapter } from '@app/adapters/crypt';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { EVENT_ID, EventsTypes } from '@infra/events/ids';
import { GetKeyService } from '../../key/getKey.service';
import { KeyRepo, KeysEnum } from '@app/repositories/key';
import { InMemoryKey } from '@tests/inMemoryDatabase/key';
import { Key } from '@app/entities/key';
import { randomBytes } from 'crypto';
import { LoggerAdapter } from '@app/adapters/logger';
import { LoggerSpy } from '@tests/adapters/logger.spy';
import { EnvEnum, GetEnvService } from '@infra/configs/getEnv.service';

describe('Gen TFA Service', () => {
	let sut: GenTFAService;
	let app: TestingModule;
	let cryptAdapter: CryptSpy;
	let userRepo: InMemoryUser;
	let eventEmitter: EventEmitter2;
	let getEnv: GetEnvService;

	beforeEach(async () => {
		/* eslint-disable @typescript-eslint/no-unused-vars */
		EventEmitter2.prototype.emit = jest.fn(
			(..._: Parameters<typeof EventEmitter2.prototype.emit>) => true,
		);

		const container = new InMemoryContainer();
		app = await Test.createTestingModule({
			imports: [
				EventEmitterModule.forRoot({
					wildcard: false,
					delimiter: '.',
					newListener: false,
					removeListener: false,
					maxListeners: 10,
					verboseMemoryLeak: true,
					ignoreErrors: false,
				}),
			],
			providers: [
				{
					provide: LoggerAdapter,
					useValue: new LoggerSpy(),
				},
				{
					provide: UserRepo,
					useValue: new InMemoryUser(container),
				},
				{
					provide: KeyRepo,
					useValue: new InMemoryKey(container),
				},
				{
					provide: CryptAdapter,
					useClass: CryptSpy,
				},
				GetEnvService,
				GetKeyService,
				GenTFAService,
			],
		}).compile();

		cryptAdapter = app.get(CryptAdapter);
		userRepo = app.get(UserRepo);
		sut = app.get(GenTFAService);
		eventEmitter = app.get(EventEmitter2);

		getEnv = app.get(GetEnvService);

		eventEmitter.once(EVENT_ID.EMAIL.SEND, () => true);

		const tfaKey = new Key({
			ttl: 1000 * 60 * 60,
			name: KeysEnum.TFA_TOKEN_KEY,
			actual: {
				content: randomBytes(100).toString('hex'),
				buildedAt: Date.now(),
			},
		});

		const keyRepo = app.get<InMemoryKey>(KeyRepo);
		await keyRepo.create(tfaKey);
	});

	afterEach(async () => {
		await app.close();
	});

	it('should be able to gen a TFA', async () => {
		const user = userFactory();
		userRepo.users.push(user);

		const { code } = await sut.exec({
			email: user.email,
			userId: user.id,
		});

		const { env: FRONT_END_AUTH_URL } = await getEnv.exec({
			env: EnvEnum.FRONT_END_AUTH_URL,
		});
		const { env: PROJECT_NAME } = await getEnv.exec({
			env: EnvEnum.PROJECT_NAME,
		});

		const payload: EventsTypes.Email.ISendProps = {
			to: user.email.value,
			subject: `${PROJECT_NAME} - Solicitação de login`,
			body: `<h1>Seja bem-vindo!</h1>
				<p>Não compartilhe este código com ninguém</p>
				<a href="${FRONT_END_AUTH_URL}${code}">${FRONT_END_AUTH_URL}${code}</a>`,
		};
		expect(eventEmitter.emit).toHaveBeenCalledWith(
			EVENT_ID.EMAIL.SEND,
			payload,
		);
		expect(cryptAdapter.calls.hashWithHmac).toEqual(1);
	});
});
