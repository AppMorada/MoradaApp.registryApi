import { condominiumRelUserFactory } from '@registry:tests/factories/condominiumRelUser';
import { userFactory } from '@registry:tests/factories/user';
import { InMemoryContainer } from '@registry:tests/inMemoryDatabase/inMemoryContainer';
import { InMemoryUser } from '@registry:tests/inMemoryDatabase/user';
import { GetCondominiumRelUserService } from '../getCondominiumRel.service';
import { UUID } from '@registry:app/entities/VO';

describe('Get condominium rel', () => {
	let inMemoryContainer: InMemoryContainer;
	let userRepo: InMemoryUser;

	let getCondominiumRelUserService: GetCondominiumRelUserService;

	beforeEach(async () => {
		inMemoryContainer = new InMemoryContainer();
		userRepo = new InMemoryUser(inMemoryContainer);

		getCondominiumRelUserService = new GetCondominiumRelUserService(
			userRepo,
		);
	});

	it('should be able to get condominium rel user', async () => {
		const user = userFactory();
		const condominiumRelUser = condominiumRelUserFactory();

		await userRepo.create({ user, condominiumRelUser });

		const searchedContent = await getCondominiumRelUserService.exec({
			userId: user.id,
		});
		const emptySearch = await getCondominiumRelUserService.exec({
			userId: UUID.genV4(),
		});

		expect(emptySearch.condominiumRels.length).toEqual(0);
		expect(searchedContent.condominiumRels.length).toEqual(1);

		expect(userRepo.calls.create).toEqual(1);
		expect(userRepo.calls.getAllCondominiumRelation).toEqual(2);
	});
});
