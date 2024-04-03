import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import { condominiumFactory } from '@tests/factories/condominium';
import request from 'supertest';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { communityInfosFactory } from '@tests/factories/communityInfos';

describe('Create a community member E2E', () => {
	let app: INestApplication;
	const endpoint = (id: string) =>
		`/condominium/${id}/as-owner/community-member/invite`;
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

	it('should be able to create a community member', async () => {
		const communityInfo = communityInfosFactory();
		const uniqueRegistry = uniqueRegistryFactory({
			email: 'user@email.com',
		});

		const inviteNewCommunityMemberResponse = await request(
			app.getHttpServer(),
		)
			.post(endpoint(condominiumInfos?.id))
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

		expect(inviteNewCommunityMemberResponse.statusCode).toEqual(201);
	});

	it('should be able to throw 409 because member already exist', async () => {
		const communityInfo = communityInfosFactory();
		const uniqueRegistry = uniqueRegistryFactory({
			email: 'user@email.com',
		});

		const inviteNewMember = async () =>
			await request(app.getHttpServer())
				.post(endpoint(condominiumInfos?.id))
				.set('content-type', 'application/json')
				.set('authorization', `Bearer ${token}`)
				.send({
					members: [
						{
							email: uniqueRegistry.email.value,
							CPF: uniqueRegistry?.CPF?.value,
							apartmentNumber:
								communityInfo?.apartmentNumber?.value,
							block: communityInfo?.block?.value,
						},
					],
				});

		await inviteNewMember();
		const inviteNewCommunityMemberResponse = await inviteNewMember();
		expect(inviteNewCommunityMemberResponse.statusCode).toEqual(409);
		expect(inviteNewCommunityMemberResponse.body?.statusCode).toEqual(409);
		expect(inviteNewCommunityMemberResponse.body?.message).toEqual(
			'Conteúdo já existe',
		);
	});

	it('should be able to throw 400', async () => {
		const inviteNewCommunityMemberResponse = await request(
			app.getHttpServer(),
		)
			.post(endpoint(condominiumInfos?.id))
			.set('content-type', 'application/json')
			.set('authorization', `Bearer ${token}`)
			.send();

		expect(inviteNewCommunityMemberResponse.statusCode).toEqual(400);
		expect(inviteNewCommunityMemberResponse.body?.statusCode).toEqual(400);
		expect(inviteNewCommunityMemberResponse.body?.message).toBeInstanceOf(
			Array,
		);
	});

	it('should be able to throw 401 because user is not authenticated', async () => {
		const inviteNewCommunityMemberResponse = await request(
			app.getHttpServer(),
		)
			.post(endpoint(condominiumInfos?.id))
			.set('content-type', 'application/json')
			.send();

		expect(inviteNewCommunityMemberResponse.statusCode).toEqual(401);
		expect(inviteNewCommunityMemberResponse.body?.statusCode).toEqual(401);
		expect(inviteNewCommunityMemberResponse.body?.message).toEqual(
			'Acesso não autorizado',
		);
	});
});
