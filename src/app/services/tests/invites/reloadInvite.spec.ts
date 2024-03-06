import { userFactory } from '@tests/factories/user';
import { InMemoryInvite } from '@tests/inMemoryDatabase/invites';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { InviteRepo } from '@app/repositories/invite';
import { EVENT_ID, EventsTypes } from '@infra/events/ids';
import { KeyRepo, KeysEnum } from '@app/repositories/key';
import { InMemoryKey } from '@tests/inMemoryDatabase/key';
import { Key } from '@app/entities/key';
import { randomBytes } from 'crypto';
import { LoggerAdapter } from '@app/adapters/logger';
import { LoggerSpy } from '@tests/adapters/logger.spy';
import { EnvEnum, GetEnvService } from '@infra/configs/getEnv.service';
import { ReloadInviteService } from '@app/services/invites/reloadInvite.service';
import { inviteFactory } from '@tests/factories/invite';
import { condominiumFactory } from '@tests/factories/condominium';

describe('Reload invite test', () => {
	let sut: ReloadInviteService;

	let app: TestingModule;
	let inviteRepo: InMemoryInvite;
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
					provide: InviteRepo,
					useValue: new InMemoryInvite(container),
				},
				{
					provide: KeyRepo,
					useValue: new InMemoryKey(container),
				},
				GetEnvService,
				ReloadInviteService,
			],
		}).compile();

		eventEmitter = app.get(EventEmitter2);
		inviteRepo = app.get(InviteRepo);

		sut = app.get(ReloadInviteService);

		getEnv = app.get(GetEnvService);

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
		const user = userFactory();
		const condominium = condominiumFactory();
		const invite = inviteFactory({
			recipient: user.email.value,
			condominiumId: condominium.id.value,
		});
		inviteRepo.create({ invite });
		await sut.exec({
			recipient: user.email.value,
		});

		expect(inviteRepo.calls.create).toEqual(1);

		const { env: PROJECT_NAME } = await getEnv.exec({
			env: EnvEnum.PROJECT_NAME,
		});

		const payload: EventsTypes.Email.ISendProps = {
			to: user.email.value,
			subject: `${PROJECT_NAME} - Convite para o condomínio`,
			body: `<h1>Seja bem-vindo!</h1>
			<p>O seu nome acabou de ser registrado na base dados de um condomínio</p>`,
		};
		expect(eventEmitter.emit).toHaveBeenCalledWith(
			EVENT_ID.EMAIL.SEND,
			payload,
		);
	});
});
