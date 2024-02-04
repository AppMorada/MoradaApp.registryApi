import { CryptSpy } from '@registry:tests/adapters/cryptSpy';
import { GenTFAService } from '../genTFA.service';
import { userFactory } from '@registry:tests/factories/user';
import { InMemoryUser } from '@registry:tests/inMemoryDatabase/user';
import { InMemoryContainer } from '@registry:tests/inMemoryDatabase/inMemoryContainer';
import { condominiumRelUserFactory } from '@registry:tests/factories/condominiumRelUser';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepo } from '@registry:app/repositories/user';
import { CryptAdapter } from '@registry:app/adapters/crypt';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { EVENT_ID, EventsTypes } from '@registry:infra/events/ids';

describe('Gen TFA Service', () => {
	let genTFA: GenTFAService;
	let app: TestingModule;
	let cryptAdapter: CryptSpy;
	let userRepo: InMemoryUser;
	let eventEmitter: EventEmitter2;

	beforeEach(async () => {
		/* eslint-disable @typescript-eslint/no-unused-vars */
		EventEmitter2.prototype.emit = jest.fn(
			(..._: Parameters<typeof EventEmitter2.prototype.emit>) => true,
		);

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
					provide: UserRepo,
					useFactory: () => {
						const container = new InMemoryContainer();
						return new InMemoryUser(container);
					},
				},
				{
					provide: CryptAdapter,
					useClass: CryptSpy,
				},
				GenTFAService,
			],
		}).compile();

		cryptAdapter = app.get(CryptAdapter);
		userRepo = app.get(UserRepo);
		genTFA = app.get(GenTFAService);
		eventEmitter = app.get(EventEmitter2);

		eventEmitter.once(EVENT_ID.EMAIL.SEND, () => true);
	});

	afterEach(async () => {
		await app.close();
	});

	it('should be able to gen a TFA', async () => {
		const user = userFactory();
		const condominiumRelUser = condominiumRelUserFactory();

		await userRepo.create({ user, condominiumRelUser });

		const { code } = await genTFA.exec({
			email: user.email,
			userId: user.id,
		});

		expect(userRepo.calls.create).toEqual(1);

		const frontendUrl = String(process.env.FRONT_END_URL);
		const payload: EventsTypes.Email.ISendProps = {
			to: user.email.value,
			subject: `${process.env.PROJECT_NAME} - Solicitação de login`,
			body: `<h1>Seja bem-vindo!</h1>
				<p>Não compartilhe este código com ninguém</p>
				<a href="${frontendUrl}${code}">${frontendUrl}${code}</a>`,
		};
		expect(eventEmitter.emit).toHaveBeenCalledWith(
			EVENT_ID.EMAIL.SEND,
			payload,
		);
		expect(cryptAdapter.calls.hashWithHmac).toEqual(1);
	});
});
