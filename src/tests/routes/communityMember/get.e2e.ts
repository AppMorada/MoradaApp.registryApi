import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import { condominiumFactory } from '@tests/factories/condominium';
import request from 'supertest';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { communityInfosFactory } from '@tests/factories/communityInfos';
import { UserWriteOps } from '@app/repositories/user/write';
import { GenTFAService } from '@app/services/login/genTFA.service';
import { CreateTokenService } from '@app/services/login/createToken.service';
import { KeysEnum } from '@app/repositories/key';

describe('Get a community member E2E', () => {
	let app: INestApplication;
	let createUserRepo: UserWriteOps.Create;
	let genTFA: GenTFAService;
	let genTokens: CreateTokenService;

	const endpoints = {
		createCondominium: '/condominium',
		createMember: (id: string) =>
			`/condominium/${id}/as-owner/community-member/invite`,
		getOne: (condominiumId?: string, userId?: string) =>
			`/condominium/${condominiumId}/as-employee/community-member/${userId}`,
		getAll: (condominiumId?: string) =>
			`/condominium/${condominiumId}/as-employee/community-member/all`,
	};
	let condominiumInfos: any;
	let adminToken: any;

	beforeAll(async () => {
		app = await startApplication();
		createUserRepo = app.get(UserWriteOps.Create);
		genTFA = app.get(GenTFAService);
		genTokens = app.get(CreateTokenService);
	});

	beforeEach(async () => {
		const condominium = condominiumFactory();
		const user = userFactory();
		const uniqueRegistry = uniqueRegistryFactory();
		await createUserRepo.exec({ user, uniqueRegistry });

		const { code } = await genTFA.exec({
			existentUserContent: { user, uniqueRegistry },
			keyName: KeysEnum.CONDOMINIUM_VALIDATION_KEY,
		});

		const { accessToken } = await genTokens.exec({ user, uniqueRegistry });
		adminToken = accessToken;

		const createCondominiumResponse = await request(app.getHttpServer())
			.post(endpoints.createCondominium)
			.set('content-type', 'application/json')
			.set('authorization', `Bearer ${code}`)
			.send({
				name: condominium.name.value,
				CEP: condominium.CEP.value,
				num: condominium.num.value,
				CNPJ: condominium.CNPJ.value,
				district: condominium.district.value,
				city: condominium.city.value,
				state: condominium.state.value,
				reference: condominium?.reference?.value,
				complement: condominium?.complement?.value,
			});

		expect(createCondominiumResponse.statusCode).toEqual(201);

		condominiumInfos = createCondominiumResponse.body?.condominium;
	});

	afterAll(async () => await app.close());

	it('should be able to get all community members', async () => {
		const communityInfo = communityInfosFactory();
		const uniqueRegistry = uniqueRegistryFactory({
			email: 'user@email.com',
		});

		await request(app.getHttpServer())
			.post(endpoints.createMember(condominiumInfos?.id))
			.set('content-type', 'application/json')
			.set('authorization', `Bearer ${adminToken}`)
			.send({
				members: [
					{
						email: uniqueRegistry.email.value,
						apartmentNumber: communityInfo?.apartmentNumber?.value,
						block: communityInfo?.block?.value,
					},
				],
			});

		const response = await request(app.getHttpServer())
			.get(endpoints.getAll(condominiumInfos?.id))
			.set('authorization', `Bearer ${adminToken}`);

		expect(response.statusCode).toEqual(200);

		const memberData = response.body?.condominiumMembers[0];
		expect(typeof memberData?.member?.id).toEqual('string');
		expect(typeof memberData?.member?.condominiumId).toEqual('string');
		expect(typeof memberData?.member?.uniqueRegistryId).toEqual(
			'undefined',
		);
		expect(memberData?.member?.userId).toBeNull();
		expect(memberData?.member?.role).toEqual(0);
		expect(typeof memberData?.member?.updatedAt).toEqual('string');
		expect(typeof memberData?.member?.createdAt).toEqual('string');

		expect(typeof memberData?.communityInfos?.memberId).toEqual(
			'undefined',
		);
		expect(memberData?.communityInfos?.apartmentNumber).toEqual(
			communityInfo?.apartmentNumber?.value,
		);
		expect(memberData?.communityInfos?.block).toEqual(
			communityInfo?.block?.value,
		);

		expect(typeof memberData?.uniqueRegistry?.id).toEqual('string');
		expect(memberData?.uniqueRegistry?.email).toEqual(
			uniqueRegistry.email.value,
		);
	});

	it('should be able to get one community members', async () => {
		const communityInfo = communityInfosFactory();
		const uniqueRegistry = uniqueRegistryFactory({
			email: 'user@email.com',
		});

		await request(app.getHttpServer())
			.post(endpoints.createMember(condominiumInfos?.id))
			.set('content-type', 'application/json')
			.set('authorization', `Bearer ${adminToken}`)
			.send({
				members: [
					{
						email: uniqueRegistry.email.value,
						apartmentNumber: communityInfo?.apartmentNumber?.value,
						block: communityInfo?.block?.value,
					},
				],
			});

		const getAllMembersResponse = await request(app.getHttpServer())
			.get(endpoints.getAll(condominiumInfos?.id))
			.set('authorization', `Bearer ${adminToken}`);

		const memberId =
			getAllMembersResponse.body?.condominiumMembers[0]?.member?.id;
		const getOneMemberResponse = await request(app.getHttpServer())
			.get(endpoints.getOne(condominiumInfos?.id, memberId))
			.set('authorization', `Bearer ${adminToken}`);

		expect(getOneMemberResponse.statusCode).toEqual(200);

		const memberData = getOneMemberResponse.body;
		expect(typeof memberData?.member?.id).toEqual('string');
		expect(typeof memberData?.member?.condominiumId).toEqual('string');
		expect(typeof memberData?.member?.uniqueRegistryId).toEqual(
			'undefined',
		);
		expect(typeof memberData?.member?.userId).toEqual('undefined');
		expect(memberData?.member?.role).toEqual(0);
		expect(typeof memberData?.member?.updatedAt).toEqual('string');
		expect(typeof memberData?.member?.createdAt).toEqual('string');

		expect(typeof memberData?.communityInfos?.memberId).toEqual(
			'undefined',
		);
		expect(memberData?.communityInfos?.apartmentNumber).toEqual(
			communityInfo?.apartmentNumber?.value,
		);
		expect(memberData?.communityInfos?.block).toEqual(
			communityInfo?.block?.value,
		);

		expect(memberData?.userData).toBeNull();

		expect(typeof memberData?.uniqueRegistry?.id).toEqual('string');
		expect(memberData?.uniqueRegistry?.email).toEqual(
			uniqueRegistry.email.value,
		);
		expect(memberData?.uniqueRegistry?.CPF).toBeNull();
	});

	it('should be able to throw 400', async () => {
		const getAllMembersResponse = await request(app.getHttpServer())
			.get(endpoints.getAll())
			.set('content-type', 'application/json')
			.set('authorization', `Bearer ${adminToken}`);

		const getOneMemberResponse = await request(app.getHttpServer())
			.get(endpoints.getOne())
			.set('content-type', 'application/json')
			.set('authorization', `Bearer ${adminToken}`);

		expect(getAllMembersResponse.statusCode).toEqual(400);
		expect(getAllMembersResponse.body?.statusCode).toEqual(400);
		expect(getAllMembersResponse.body?.message).toBeInstanceOf(Array);

		expect(getOneMemberResponse.statusCode).toEqual(400);
		expect(getOneMemberResponse.body?.statusCode).toEqual(400);
		expect(getOneMemberResponse.body?.message).toBeInstanceOf(Array);
	});

	it('should be able to throw 401 because user is not authenticated', async () => {
		const getAllMembersResponse = await request(app.getHttpServer())
			.get(endpoints.getAll(condominiumInfos?.id))
			.set('content-type', 'application/json');

		const getOneMemberResponse = await request(app.getHttpServer())
			.get(endpoints.getOne(condominiumInfos?.id))
			.set('content-type', 'application/json');

		expect(getAllMembersResponse.statusCode).toEqual(401);
		expect(getAllMembersResponse.body?.statusCode).toEqual(401);
		expect(getAllMembersResponse.body?.message).toEqual(
			'Acesso não autorizado',
		);

		expect(getOneMemberResponse.statusCode).toEqual(401);
		expect(getOneMemberResponse.body?.statusCode).toEqual(401);
		expect(getOneMemberResponse.body?.message).toEqual(
			'Acesso não autorizado',
		);
	});
});
