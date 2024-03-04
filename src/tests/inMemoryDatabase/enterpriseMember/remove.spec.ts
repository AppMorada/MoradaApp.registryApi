import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryEnterpriseMembers } from '.';
import { EntitiesEnum } from '@app/entities/entities';
import { InMemoryContainer } from '../inMemoryContainer';
import { enterpriseMemberFactory } from '@tests/factories/enterpriseMember';
import { userFactory } from '@tests/factories/user';
import { UUID } from '@app/entities/VO';

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
		sut.enterpriseMembers.push(member);
		sut.users.push(user);

		expect(sut.remove({ id: member.id })).resolves;
		expect(sut.calls.remove).toEqual(1);
	});

	it('should be able to throw one error: member already exist', async () => {
		await expect(sut.remove({ id: UUID.genV4() })).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.enterpriseMember,
				message: 'Enterprise member doesn\'t exist',
			}),
		);

		expect(sut.calls.remove).toEqual(1);
	});
});
