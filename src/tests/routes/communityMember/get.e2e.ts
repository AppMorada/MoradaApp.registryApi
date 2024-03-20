import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import { condominiumFactory } from '@tests/factories/condominium';
import request from 'supertest';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { communityInfosFactory } from '@tests/factories/communityInfos';

describe('Get a community member E2E', () => {
	let app: INestApplication;
	const endpoints = {
		create: (id: string) =>
			`/condominium/${id}/as-owner/community-member/invite`,
		getOne: (condominiumId?: string, userId?: string) =>
			`/condominium/${condominiumId}/as-employee/community-member/${userId}`,
		getAll: (condominiumId?: string) =>
			`/condominium/${condominiumId}/as-employee/community-member/all`,
	};
	let condominiumInfos: any;
	let token: any;

	beforeAll(async () => {
		app = await startApplication();
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
		token = createCondominiumResponse.body?.accessToken;
	});

	afterAll(async () => await app.close());

	it('should be able to get all community members', async () => {
		const communityInfo = communityInfosFactory();
		const uniqueRegistry = uniqueRegistryFactory({
			email: 'user@email.com',
		});

		await request(app.getHttpServer())
			.post(endpoints.create(condominiumInfos?.id))
			.set('content-type', 'application/json')
			.set('authorization', `Bearer ${token}`)
			.send({
				members: [
					{
						email: uniqueRegistry.email.value,
						CPF: uniqueRegistry?.CPF?.value,
						apartmentNumber: communityInfo.apartmentNumber.value,
						block: communityInfo.block.value,
					},
				],
			});

		const response = await request(app.getHttpServer())
			.get(endpoints.getAll(condominiumInfos?.id))
			.set('authorization', `Bearer ${token}`);

		expect(response.statusCode).toEqual(200);

		const memberData = response.body?.condominiumMembers[0];
		expect(typeof memberData?.member?.id).toEqual('string');
		expect(typeof memberData?.member?.condominiumId).toEqual('string');
		expect(typeof memberData?.member?.uniqueRegistryId).toEqual('string');
		expect(memberData?.member?.userId).toBeNull();
		expect(memberData?.member?.role).toEqual(0);
		expect(typeof memberData?.member?.updatedAt).toEqual('string');
		expect(typeof memberData?.member?.createdAt).toEqual('string');

		expect(typeof memberData?.communityInfos?.memberId).toEqual('string');
		expect(memberData?.communityInfos?.apartmentNumber).toEqual(
			communityInfo.apartmentNumber.value,
		);
		expect(memberData?.communityInfos?.block).toEqual(
			communityInfo.block.value,
		);

		expect(typeof memberData?.uniqueRegistry?.id).toEqual('string');
		expect(memberData?.uniqueRegistry?.email).toEqual(
			uniqueRegistry.email.value,
		);
		expect(memberData?.uniqueRegistry?.CPF).toEqual(
			uniqueRegistry?.CPF?.value,
		);
	});

	it('should be able to get one community members', async () => {
		const communityInfo = communityInfosFactory();
		const uniqueRegistry = uniqueRegistryFactory({
			email: 'user@email.com',
		});

		await request(app.getHttpServer())
			.post(endpoints.create(condominiumInfos?.id))
			.set('content-type', 'application/json')
			.set('authorization', `Bearer ${token}`)
			.send({
				members: [
					{
						email: uniqueRegistry.email.value,
						CPF: uniqueRegistry?.CPF?.value,
						apartmentNumber: communityInfo.apartmentNumber.value,
						block: communityInfo.block.value,
					},
				],
			});

		const getAllMembersResponse = await request(app.getHttpServer())
			.get(endpoints.getAll(condominiumInfos?.id))
			.set('authorization', `Bearer ${token}`);

		const memberId =
			getAllMembersResponse.body?.condominiumMembers[0]?.member?.id;
		const getOneMemberResponse = await request(app.getHttpServer())
			.get(endpoints.getOne(condominiumInfos?.id, memberId))
			.set('authorization', `Bearer ${token}`);

		expect(getOneMemberResponse.statusCode).toEqual(200);

		const memberData = getOneMemberResponse.body;
		expect(typeof memberData?.member?.id).toEqual('string');
		expect(typeof memberData?.member?.condominiumId).toEqual('string');
		expect(typeof memberData?.member?.uniqueRegistryId).toEqual('string');
		expect(memberData?.member?.userId).toBeNull();
		expect(memberData?.member?.role).toEqual(0);
		expect(typeof memberData?.member?.updatedAt).toEqual('string');
		expect(typeof memberData?.member?.createdAt).toEqual('string');

		expect(typeof memberData?.communityInfos?.memberId).toEqual('string');
		expect(memberData?.communityInfos?.apartmentNumber).toEqual(
			communityInfo.apartmentNumber.value,
		);
		expect(memberData?.communityInfos?.block).toEqual(
			communityInfo.block.value,
		);

		expect(memberData?.userData).toBeNull();

		expect(typeof memberData?.uniqueRegistry?.id).toEqual('string');
		expect(memberData?.uniqueRegistry?.email).toEqual(
			uniqueRegistry.email.value,
		);
		expect(memberData?.uniqueRegistry?.CPF).toEqual(
			uniqueRegistry?.CPF?.value,
		);
	});

	it('should be able to throw 400', async () => {
		const getAllMembersResponse = await request(app.getHttpServer())
			.get(endpoints.getAll())
			.set('content-type', 'application/json')
			.set('authorization', `Bearer ${token}`);

		const getOneMemberResponse = await request(app.getHttpServer())
			.get(endpoints.getOne())
			.set('content-type', 'application/json')
			.set('authorization', `Bearer ${token}`);

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
