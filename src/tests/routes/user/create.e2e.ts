import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import { condominiumFactory } from '@tests/factories/condominium';
import request from 'supertest';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { communityInfosFactory } from '@tests/factories/communityInfos';
import { GenInviteService } from '@app/services/invites/genInvite.service';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { CommunityMemberWriteOpsRepo } from '@app/repositories/communityMember/write';

describe('Create a user E2E', () => {
	let app: INestApplication;
	const endpoint = '/user';

	let condominiumInfos: any;
	let genInvite: GenInviteService;
	let memberRepo: CommunityMemberWriteOpsRepo;

	beforeAll(async () => {
		app = await startApplication();
		genInvite = app.get(GenInviteService);
		memberRepo = app.get(CommunityMemberWriteOpsRepo);
	});

	beforeEach(async () => {
		const condominium = condominiumFactory();
		const user = userFactory();
		const uniqueRegistry = uniqueRegistryFactory();

		const createCondominiumResponse = await request(app.getHttpServer())
			.post('/condominium')
			.set('content-type', 'application/json')
			.send({
				userName: user.name.value,
				condominiumName: condominium.name.value,
				email: uniqueRegistry.email.value,
				password: user.password.value,
				CEP: condominium.CEP.value,
				num: condominium.num.value,
				CNPJ: condominium.CNPJ.value,
			});

		condominiumInfos = createCondominiumResponse.body?.condominium;
	});

	afterAll(async () => await app.close());

	it('should be able to create a user', async () => {
		const uniqueRegistry = uniqueRegistryFactory({
			email: 'user@email.com',
		});
		const member = condominiumMemberFactory({
			uniqueRegistryId: uniqueRegistry.id.value,
			condominiumId: condominiumInfos.id,
		});
		const communityInfos = communityInfosFactory({
			memberId: member.id.value,
		});

		const { invite, unhashedCode } = await genInvite.exec({
			memberId: member.id.value,
			CPF: uniqueRegistry!.CPF!.value,
			recipient: uniqueRegistry.email.value,
			condominiumId: condominiumInfos.id,
		});

		await memberRepo.create({
			invite,
			member,
			communityInfos,
			rawUniqueRegistry: {
				email: uniqueRegistry.email,
				CPF: uniqueRegistry.CPF!,
			},
		});

		const response = await request(app.getHttpServer())
			.post(endpoint)
			.set('content-type', 'application/json')
			.send({
				name: 'New User',
				email: uniqueRegistry.email.value,
				password: '12345678',
				CPF: uniqueRegistry.CPF?.value,
				code: unhashedCode,
			});

		expect(response.statusCode).toEqual(201);
		expect(typeof response.body?.accessToken).toEqual('string');
		expect(
			typeof response.headers['set-cookie'][0]?.split(
				'refresh-token=',
			)[1],
		).toEqual('string');
	});

	it('should be able to throw 400', async () => {
		const uniqueRegistry = uniqueRegistryFactory({
			email: 'user@email.com',
		});
		const member = condominiumMemberFactory({
			uniqueRegistryId: uniqueRegistry.id.value,
			condominiumId: condominiumInfos.id,
		});
		const communityInfos = communityInfosFactory({
			memberId: member.id.value,
		});

		const { invite } = await genInvite.exec({
			memberId: member.id.value,
			CPF: uniqueRegistry!.CPF!.value,
			recipient: uniqueRegistry.email.value,
			condominiumId: condominiumInfos.id,
		});

		await memberRepo.create({
			invite,
			member,
			communityInfos,
			rawUniqueRegistry: {
				email: uniqueRegistry.email,
				CPF: uniqueRegistry.CPF!,
			},
		});

		const response = await request(app.getHttpServer())
			.post(endpoint)
			.set('content-type', 'application/json')
			.send();

		expect(response.statusCode).toEqual(400);
		expect(response.body?.message).toBeInstanceOf(Array);
		expect(response.body?.statusCode).toEqual(400);
	});

	it('should be able to throw 401 because user is not authenticated', async () => {
		const uniqueRegistry = uniqueRegistryFactory({
			email: 'user@email.com',
		});

		const response = await request(app.getHttpServer())
			.post(endpoint)
			.set('content-type', 'application/json')
			.send({
				name: 'New User',
				email: uniqueRegistry.email.value,
				password: '12345678',
				CPF: uniqueRegistry.CPF?.value,
				code: '1234567',
			});

		expect(response.statusCode).toEqual(401);
		expect(response.body?.statusCode).toEqual(401);
		expect(response.body?.message).toEqual('Acesso não autorizado');
	});
});
