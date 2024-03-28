import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import { condominiumFactory } from '@tests/factories/condominium';
import request from 'supertest';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { GenInviteService } from '@app/services/invites/genInvite.service';
import { CommunityMemberWriteOpsRepo } from '@app/repositories/communityMember/write';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { communityInfosFactory } from '@tests/factories/communityInfos';

describe('Get user with enterprise member section E2E', () => {
	let app: INestApplication;
	const endpoints = {
		default: '/user',
		get: '/user/me/community-member-section',
	};

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

	it('should be able to get a user data', async () => {
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

		await memberRepo.createMany({
			members: [
				{
					invite,
					content: member,
					communityInfos,
					rawUniqueRegistry: {
						email: uniqueRegistry.email,
						CPF: uniqueRegistry.CPF!,
					},
				},
			],
		});

		const createUserResponse = await request(app.getHttpServer())
			.post(endpoints.default)
			.set('content-type', 'application/json')
			.send({
				name: 'New User',
				email: uniqueRegistry.email.value,
				password: '12345678',
				CPF: uniqueRegistry.CPF?.value,
				code: unhashedCode,
			});

		const getUserResponse = await request(app.getHttpServer())
			.get(endpoints.get)
			.set(
				'authorization',
				`Bearer ${createUserResponse.body?.accessToken}`,
			);

		expect(getUserResponse.statusCode).toEqual(200);

		const body = getUserResponse.body;
		expect(typeof body?.id).toEqual('string');
		expect(body?.name).toEqual('New User');
		expect(typeof body?.uniqueRegistryId).toEqual('string');
		expect(body?.phoneNumber).toBeNull();
		expect(body?.tfa).toEqual(false);

		expect(typeof body?.uniqueRegistry?.id).toEqual('string');
		expect(typeof body?.uniqueRegistry?.email).toEqual('string');
		expect(typeof body?.uniqueRegistry?.CPF).toEqual('string');

		expect(typeof body?.memberInfos[0]?.memberCoreInfo?.id).toEqual(
			'string',
		);
		expect(
			typeof body?.memberInfos[0]?.memberCoreInfo?.condominiumId,
		).toEqual('string');
		expect(
			typeof body?.memberInfos[0]?.memberCoreInfo?.uniqueRegistryId,
		).toEqual('string');
		expect(body?.memberInfos[0]?.memberCoreInfo?.role).toEqual(0);
		expect(typeof body?.memberInfos[0]?.memberCoreInfo?.createdAt).toEqual(
			'string',
		);
		expect(typeof body?.memberInfos[0]?.memberCoreInfo?.updatedAt).toEqual(
			'string',
		);

		expect(typeof body?.memberInfos[0]?.communityInfo?.memberId).toEqual(
			'string',
		);
		expect(body?.memberInfos[0]?.communityInfo?.apartmentNumber).toEqual(
			communityInfos.apartmentNumber.value,
		);
		expect(body?.memberInfos[0]?.communityInfo?.block).toEqual(
			communityInfos.block.value,
		);
		expect(typeof body?.memberInfos[0]?.communityInfo?.updatedAt).toEqual(
			'string',
		);
	});

	it('should be able to throw 401 because user is not authenticated', async () => {
		const response = await request(app.getHttpServer()).get(endpoints.get);

		expect(response.statusCode).toEqual(401);
		expect(response.body?.statusCode).toEqual(401);
		expect(response.body?.message).toEqual('Acesso não autorizado');
	});
});
