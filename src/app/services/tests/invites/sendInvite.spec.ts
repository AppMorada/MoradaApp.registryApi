import { condominiumFactory } from '@tests/factories/condominium';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { EVENT_ID } from '@infra/events/ids';
import { KeyRepo, KeysEnum } from '@app/repositories/key';
import { InMemoryKey } from '@tests/inMemoryDatabase/key';
import { Key } from '@app/entities/key';
import { randomBytes } from 'crypto';
import { LoggerAdapter } from '@app/adapters/logger';
import { LoggerSpy } from '@tests/adapters/logger.spy';
import { GetEnvService } from '@infra/configs/env/getEnv.service';
import { CryptAdapter } from '@app/adapters/crypt';
import { CryptSpy } from '@tests/adapters/cryptSpy';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { SendInviteService } from '@app/services/invites/sendInvite.service';

describe('Send invite test', () => {
	let sut: SendInviteService;

	let app: TestingModule;
	let eventEmitter: EventEmitter2;

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
					provide: CryptAdapter,
					useValue: new CryptSpy(),
				},
				{
					provide: KeyRepo,
					useValue: new InMemoryKey(container),
				},
				GetEnvService,
				SendInviteService,
			],
		}).compile();

		eventEmitter = app.get(EventEmitter2);

		sut = app.get(SendInviteService);

		eventEmitter.once(EVENT_ID.EMAIL.SEND, () => true);

		const inviteKey = new Key({
			ttl: 1000 * 60 * 60,
			name: KeysEnum.INVITE_TOKEN_KEY,
			actual: {
				content: randomBytes(100).toString('hex'),
				buildedAt: Date.now(),
			},
		});

		const keyRepo = app.get<InMemoryKey>(KeyRepo);
		await keyRepo.create(inviteKey);
	});

	afterEach(async () => {
		await app.close();
	});

	it('should be able to invite a user', async () => {
		const uniqueRegistry = uniqueRegistryFactory();
		const condominium = condominiumFactory();

		await sut.exec({
			recipient: uniqueRegistry.email.value,
			condominium,
		});

		expect(eventEmitter.emit).toHaveBeenCalled();
	});
});
