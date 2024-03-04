import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryEnterpriseMembers } from '.';
import { EntitiesEnum } from '@app/entities/entities';
import { InMemoryContainer } from '../inMemoryContainer';
import { userFactory } from '@tests/factories/user';
import { enterpriseMemberFactory } from '@tests/factories/enterpriseMember';

describe('InMemoryData test: Enterprise Member create method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryEnterpriseMembers;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryEnterpriseMembers(container);
	});

	it('should be able to create one member', async () => {
		const user = userFactory();
		const member = enterpriseMemberFactory({ userId: user.id.value });

		expect(sut.create({ member, user })).resolves;
		expect(sut.calls.create).toEqual(1);
	});

	it('should be able to throw one error: member already exist', async () => {
		const user = userFactory();
		const member = enterpriseMemberFactory({ userId: user.id.value });

		expect(sut.create({ member, user })).resolves;
		await expect(sut.create({ member, user })).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.enterpriseMember,
				message: 'Enterprise member already exist',
			}),
		);

		expect(sut.calls.create).toEqual(2);
	});
});
