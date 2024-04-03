import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import { condominiumFactory } from '@tests/factories/condominium';
import request from 'supertest';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { communityInfosFactory } from '@tests/factories/communityInfos';

describe('Update community member E2E', () => {
	let app: INestApplication;
	const endpoints = {
		create: (id: string) =>
			`/condominium/${id}/as-owner/community-member/invite`,
		getAll: (condominiumId?: string) =>
			`/condominium/${condominiumId}/as-employee/community-member/all`,
		update: (condominiumId?: string, memberId?: string) =>
			`/condominium/${condominiumId}/as-employee/community-member/${memberId}`,
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

	it('should be able to update one community member', async () => {
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
						apartmentNumber: communityInfo?.apartmentNumber?.value,
						block: communityInfo?.block?.value,
					},
				],
			});

		const getAllMembersResponse = await request(app.getHttpServer())
			.get(endpoints.getAll(condominiumInfos?.id))
			.set('authorization', `Bearer ${token}`);

		const memberId =
			getAllMembersResponse.body?.condominiumMembers[0]?.member?.id;
		const updateCommunityMemberResponse = await request(app.getHttpServer())
			.patch(endpoints.update(condominiumInfos?.id, memberId))
			.set('authorization', `Bearer ${token}`)
			.send({
				apartmentNumber: 24754,
				block: 'E45',
			});

		expect(updateCommunityMemberResponse.statusCode).toEqual(200);

		const searchedMembers = await request(app.getHttpServer())
			.get(endpoints.getAll(condominiumInfos?.id))
			.set('authorization', `Bearer ${token}`);

		expect(searchedMembers.statusCode).toEqual(200);

		const memberData = searchedMembers.body?.condominiumMembers[0];
		expect(memberData?.communityInfos?.apartmentNumber).toEqual(24754);
		expect(memberData?.communityInfos?.block).toEqual('E45');
	});

	it('should be able to throw 400', async () => {
		const response = await request(app.getHttpServer())
			.patch(endpoints.update())
			.set('content-type', 'application/json')
			.set('authorization', `Bearer ${token}`);

		expect(response.statusCode).toEqual(400);
		expect(response.body?.statusCode).toEqual(400);
		expect(response.body?.message).toBeInstanceOf(Array);
	});

	it('should be able to throw 401 because user is not authenticated', async () => {
		const response = await request(app.getHttpServer())
			.patch(endpoints.update(condominiumInfos?.id))
			.set('content-type', 'application/json');

		expect(response.statusCode).toEqual(401);
		expect(response.body?.statusCode).toEqual(401);
		expect(response.body?.message).toEqual('Acesso não autorizado');
	});
});
