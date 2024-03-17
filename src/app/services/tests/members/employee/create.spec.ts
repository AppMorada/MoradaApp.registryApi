import { UUID } from '@app/entities/VO';
import { CreateEmployeeUserService } from '@app/services/members/employee/create.service';
import { CryptSpy } from '@tests/adapters/cryptSpy';
import { userFactory } from '@tests/factories/user';
import { InMemoryEmployeeMembers } from '@tests/inMemoryDatabase/employeeMember';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';

describe('Get employee member by user id', () => {
	let container: InMemoryContainer;
	let memberRepo: InMemoryEmployeeMembers;

	let crypyAdapter: CryptSpy;

	let sut: CreateEmployeeUserService;

	beforeEach(() => {
		container = new InMemoryContainer();
		memberRepo = new InMemoryEmployeeMembers(container);
		crypyAdapter = new CryptSpy();

		sut = new CreateEmployeeUserService(crypyAdapter, memberRepo);
	});

	it('should be able to get a member', async () => {
		const user = userFactory();
		await sut.exec({
			condominiumId: UUID.genV4().value,
			user,
			flatAndRawUniqueRegistry: {
				CPF: '267.391.172-33',
				email: 'johndoe@email.com',
			},
		});
		expect(memberRepo.calls.create === 1).toEqual(true);

		user.uniqueRegistryId = memberRepo.users[0]!.uniqueRegistryId;
		expect(memberRepo.users[0].equalTo(user)).toBe(true);
		expect(crypyAdapter.calls.hash === 1).toEqual(true);
	});
});
