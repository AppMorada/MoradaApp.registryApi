import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import { condominiumFactory } from '@tests/factories/condominium';
import request from 'supertest';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { CommunityMemberWriteOpsRepo } from '@app/repositories/communityMember/write';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { communityInfosFactory } from '@tests/factories/communityInfos';
import { UserRepoWriteOps } from '@app/repositories/user/write';
import { GenTFAService } from '@app/services/login/genTFA.service';
import { KeysEnum } from '@app/repositories/key';

describe('Get user with enterprise member section E2E', () => {
	let app: INestApplication;
	let userRepo: UserRepoWriteOps;
	let genTFA: GenTFAService;

	const endpoints = {
		createCondominium: '/condominium',
		default: '/user',
		get: '/user/community-member-section',
	};

	let condominiumInfos: any;
	let memberRepo: CommunityMemberWriteOpsRepo;

	beforeAll(async () => {
		app = await startApplication();
		memberRepo = app.get(CommunityMemberWriteOpsRepo);
		userRepo = app.get(UserRepoWriteOps);
		genTFA = app.get(GenTFAService);
	});

	beforeEach(async () => {
		const condominium = condominiumFactory();
		const user = userFactory();
		const uniqueRegistry = uniqueRegistryFactory();
		await userRepo.create({ user, uniqueRegistry });

		const { code } = await genTFA.exec({
			existentUserContent: { uniqueRegistry, user },
			keyName: KeysEnum.CONDOMINIUM_VALIDATION_KEY,
		});

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

		await memberRepo.createMany({
			members: [
				{
					content: member,
					communityInfos,
					rawUniqueRegistry: {
						email: uniqueRegistry.email,
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
				code: condominiumInfos?.humanReadableId,
			});

		expect(createUserResponse.statusCode).toEqual(201);

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
		expect(typeof body?.uniqueRegistryId).toEqual('undefined');
		expect(typeof body?.password).toEqual('undefined');
		expect(body?.phoneNumber).toBeNull();
		expect(body?.tfa).toEqual(false);

		expect(typeof body?.uniqueRegistry?.id).toEqual('string');
		expect(typeof body?.uniqueRegistry?.email).toEqual('string');
		expect(body?.uniqueRegistry?.CPF).toBeNull();

		const memberCoreInfo = body?.memberInfos[0]?.memberCoreInfo;
		expect(typeof memberCoreInfo?.id).toEqual('string');
		expect(typeof memberCoreInfo?.condominiumId).toEqual('string');
		expect(typeof memberCoreInfo?.uniqueRegistryId).toEqual('undefined');
		expect(memberCoreInfo?.role).toEqual(0);
		expect(typeof memberCoreInfo?.createdAt).toEqual('string');
		expect(typeof memberCoreInfo?.updatedAt).toEqual('string');

		const communityInfo = body?.memberInfos[0]?.communityInfo;
		expect(typeof communityInfo?.memberId).toEqual('undefined');
		expect(communityInfo?.apartmentNumber).toEqual(
			communityInfos?.apartmentNumber?.value,
		);
		expect(communityInfo?.block).toEqual(communityInfos?.block?.value);
		expect(typeof communityInfo?.updatedAt).toEqual('string');
	});

	it('should be able to throw 401 because user is not authenticated', async () => {
		const response = await request(app.getHttpServer()).get(endpoints.get);

		expect(response.statusCode).toEqual(401);
		expect(response.body?.statusCode).toEqual(401);
		expect(response.body?.message).toEqual('Acesso não autorizado');
	});
});
