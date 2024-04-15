import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import { condominiumFactory } from '@tests/factories/condominium';
import request from 'supertest';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { communityInfosFactory } from '@tests/factories/communityInfos';
import { CreateTokenService } from '@app/services/login/createToken.service';
import { GenTFAService } from '@app/services/login/genTFA.service';
import { UserRepoWriteOps } from '@app/repositories/user/write';
import { KeysEnum } from '@app/repositories/key';

describe('Create a community member E2E', () => {
	let app: INestApplication;
	let userRepo: UserRepoWriteOps;
	let genTFA: GenTFAService;
	let genTokens: CreateTokenService;

	const endpoints = {
		createCondominium: '/condominium',
		invite: (id: string) =>
			`/condominium/${id}/as-owner/community-member/invite`,
	};
	let condominiumInfos: any;
	let adminToken: any;

	beforeAll(async () => {
		app = await startApplication();
		userRepo = app.get(UserRepoWriteOps);
		genTFA = app.get(GenTFAService);
		genTokens = app.get(CreateTokenService);
	});

	beforeEach(async () => {
		const condominium = condominiumFactory();
		const user = userFactory();
		const uniqueRegistry = uniqueRegistryFactory();
		await userRepo.create({ user, uniqueRegistry });

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
				email: uniqueRegistry.email.value,
				password: user.password.value,
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

	it('should be able to create a community member', async () => {
		const communityInfo = communityInfosFactory();
		const uniqueRegistry = uniqueRegistryFactory({
			email: 'user@email.com',
		});

		const inviteNewCommunityMemberResponse = await request(
			app.getHttpServer(),
		)
			.post(endpoints.invite(condominiumInfos?.id))
			.set('content-type', 'application/json')
			.set('authorization', `Bearer ${adminToken}`)
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
				.post(endpoints.invite(condominiumInfos?.id))
				.set('content-type', 'application/json')
				.set('authorization', `Bearer ${adminToken}`)
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
			.post(endpoints.invite(condominiumInfos?.id))
			.set('content-type', 'application/json')
			.set('authorization', `Bearer ${adminToken}`)
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
			.post(endpoints.invite(condominiumInfos?.id))
			.set('content-type', 'application/json')
			.send();

		expect(inviteNewCommunityMemberResponse.statusCode).toEqual(401);
		expect(inviteNewCommunityMemberResponse.body?.statusCode).toEqual(401);
		expect(inviteNewCommunityMemberResponse.body?.message).toEqual(
			'Acesso não autorizado',
		);
	});
});
