import { userFactory } from '@registry:tests/factories/user';
import { CryptSpy } from '@registry:tests/adapters/cryptSpy';
import { GenInviteService } from '../genInvite.service';
import { condominiumFactory } from '@registry:tests/factories/condominium';
import { InMemoryInvite } from '@registry:tests/inMemoryDatabase/invites';
import { InMemoryContainer } from '@registry:tests/inMemoryDatabase/inMemoryContainer';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { CryptAdapter } from '@registry:app/adapters/crypt';
import { InviteRepo } from '@registry:app/repositories/invite';
import { EVENT_ID, EventsTypes } from '@registry:infra/events/ids';

describe('Gen invite test', () => {
	let genInvite: GenInviteService;

	let app: TestingModule;
	let inviteRepo: InMemoryInvite;
	let crypt: CryptSpy;
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
					provide: InviteRepo,
					useFactory: () => {
						const container = new InMemoryContainer();
						return new InMemoryInvite(container);
					},
				},
				{
					provide: CryptAdapter,
					useClass: CryptSpy,
				},
				GenInviteService,
			],
		}).compile();

		eventEmitter = app.get(EventEmitter2);
		inviteRepo = app.get(InviteRepo);
		crypt = app.get(CryptAdapter);

		genInvite = app.get(GenInviteService);

		eventEmitter.once(EVENT_ID.EMAIL.SEND, () => true);
	});

	afterEach(async () => {
		await app.close();
	});

	it('should be able to create a user', async () => {
		const user = userFactory();
		const condominium = condominiumFactory();

		const { hashedValue } = await genInvite.exec({
			email: user.email,
			condominiumId: condominium.id,
		});

		expect(inviteRepo.calls.create).toEqual(1);
		expect(crypt.calls.hashWithHmac).toEqual(1);

		const frontendUrl = String(process.env.FRONT_END_INVITE_URL);
		const payload: EventsTypes.Email.ISendProps = {
			to: user.email.value,
			subject: `${process.env.PROJECT_NAME} - Convite para o condomínio`,
			body: `<h1>Seja bem-vindo!</h1>
				<p>Não compartilhe este link com ninguém</p>
				<a href="${frontendUrl}${hashedValue}">${frontendUrl}${hashedValue}</a>`,
		};
		expect(eventEmitter.emit).toHaveBeenCalledWith(
			EVENT_ID.EMAIL.SEND,
			payload,
		);
	});
});
