import { UUID } from '@app/entities/VO';
import { CreateEmployeeUserService } from '@app/services/members/employee/create.service';
import { CryptSpy } from '@tests/adapters/cryptSpy';
import { userFactory } from '@tests/factories/user';
import { InMemoryEmployeeMembersCreate } from '@tests/inMemoryDatabase/employeeMember/write/create';

describe('Get employee member by user id', () => {
	let createMemberRepo: InMemoryEmployeeMembersCreate;
	let crypyAdapter: CryptSpy;

	let sut: CreateEmployeeUserService;

	beforeEach(() => {
		createMemberRepo = new InMemoryEmployeeMembersCreate();
		crypyAdapter = new CryptSpy();

		sut = new CreateEmployeeUserService(crypyAdapter, createMemberRepo);
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
		expect(createMemberRepo.calls.exec).toEqual(1);
		expect(crypyAdapter.calls.hash === 1).toEqual(true);
	});
});
