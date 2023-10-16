import { Email } from '@app/entities/VO/email';
import { CreateCondominiumService } from './createCondominium.service';
import { JwtService } from '@nestjs/jwt';
import { EmailMock } from '@tests/adapters/emailMock';
import { condominiumFactory } from '@tests/factories/condominium';
import { InMemoryCondominium } from '@tests/inMemoryDatabase/condominium';

describe('Create condominium test', () => {
	let createCondominium: CreateCondominiumService;

	let condominiumRepo: InMemoryCondominium;
	let tokenService: JwtService;
	let emailAdapter: EmailMock;

	beforeEach(() => {
		condominiumRepo = new InMemoryCondominium();
		tokenService = new JwtService();
		emailAdapter = new EmailMock();

		createCondominium = new CreateCondominiumService(
			condominiumRepo,
			tokenService,
			emailAdapter,
		);
	});

	it('should be able to create a condominium', async () => {
		const condominium = condominiumFactory();

		const { token } = await createCondominium.exec({
			condominium,
			email: new Email('john doe'),
		});

		expect(
			tokenService.verify(token, {
				secret: process.env.CONDOMINIUM_TOKEN_KEY as string,
			}),
		).resolves;
		expect(
			condominiumRepo.condominiums[0].equalTo(condominium),
		).toBeTruthy();
	});
});
