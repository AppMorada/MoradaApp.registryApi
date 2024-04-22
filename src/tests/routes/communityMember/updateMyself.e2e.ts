import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import { condominiumFactory } from '@tests/factories/condominium';
import request from 'supertest';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { communityInfosFactory } from '@tests/factories/communityInfos';
import { KeysEnum } from '@app/repositories/key';
import { CreateTokenService } from '@app/services/login/createToken.service';
import { GenTFAService } from '@app/services/login/genTFA.service';
import { UserRepoWriteOps } from '@app/repositories/user/write';

describe('Update my community member data E2E', () => {
	let app: INestApplication;
	let userRepo: UserRepoWriteOps;
	let genTFA: GenTFAService;
	let genTokens: CreateTokenService;

	const endpoints = {
		createCondominium: '/condominium',
		createMember: (id: string) =>
			`/condominium/${id}/as-owner/community-member/invite`,
		createUser: '/user',
		update: (condominiumId?: string) =>
			`/condominium/${condominiumId}/myself/as-community`,
		getAll: (condominiumId?: string) =>
			`/condominium/${condominiumId}/as-employee/community-member/all`,
	};
	let condominiumInfos: any;
	let adminToken: any;
	let commonUserToken: any;

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

		const communityInfo = communityInfosFactory();
		const newUniqueRegistry = uniqueRegistryFactory({
			email: 'user@email.com',
		});

		await request(app.getHttpServer())
			.post(endpoints.createMember(condominiumInfos?.id))
			.set('content-type', 'application/json')
			.set('authorization', `Bearer ${adminToken}`)
			.send({
				members: [
					{
						email: newUniqueRegistry.email.value,
						apartmentNumber: communityInfo?.apartmentNumber?.value,
						block: communityInfo?.block?.value,
					},
				],
			});

		const createUserResponse = await request(app.getHttpServer())
			.post(endpoints.createUser)
			.set('content-type', 'application/json')
			.send({
				name: 'New User',
				email: newUniqueRegistry.email.value,
				password: '12345678',
			});
		commonUserToken = createUserResponse.body?.accessToken;
	});

	afterAll(async () => await app.close());

	it('should be able to update one community member', async () => {
		const updateCommunityMemberResponse = await request(app.getHttpServer())
			.patch(endpoints.update(condominiumInfos?.id))
			.set('authorization', `Bearer ${commonUserToken}`)
			.send({
				apartmentNumber: 24754,
				block: 'E45',
			});

		expect(updateCommunityMemberResponse.statusCode).toEqual(200);

		const searchedMembers = await request(app.getHttpServer())
			.get(endpoints.getAll(condominiumInfos?.id))
			.set('authorization', `Bearer ${adminToken}`);

		expect(searchedMembers.statusCode).toEqual(200);

		const memberData = searchedMembers.body?.condominiumMembers[0];
		expect(memberData?.communityInfos?.apartmentNumber).toEqual(24754);
		expect(memberData?.communityInfos?.block).toEqual('E45');
	});

	it('should be able to throw 400', async () => {
		const response = await request(app.getHttpServer())
			.patch(endpoints.update())
			.set('content-type', 'application/json')
			.set('authorization', `Bearer ${commonUserToken}`);

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
