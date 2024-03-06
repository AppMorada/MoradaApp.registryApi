import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryEnterpriseMembers } from '.';
import { EntitiesEnum } from '@app/entities/entities';
import { InMemoryContainer } from '../inMemoryContainer';
import { CPF, Name, PhoneNumber } from '@app/entities/VO';
import { enterpriseMemberFactory } from '@tests/factories/enterpriseMember';
import { userFactory } from '@tests/factories/user';

describe('InMemoryData test: Enterprise Member update method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryEnterpriseMembers;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryEnterpriseMembers(container);
	});

	it('should be able to update one member', async () => {
		const user = userFactory();
		const member = enterpriseMemberFactory({ userId: user.id.value });
		sut.enterpriseMembers.push(member);
		sut.users.push(user);

		expect(
			sut.update({
				id: member.id,
				phoneNumber: new PhoneNumber('2154659887'),
				name: new Name('new name'),
				CPF: new CPF('893.841.547-33'),
			}),
		).resolves;

		const searchedUser = sut.users?.[0];
		const searchedMember = sut.enterpriseMembers?.[0];
		expect(searchedUser?.phoneNumber?.value).toEqual('2154659887');
		expect(searchedUser?.name?.value).toEqual('new name');
		expect(searchedMember?.CPF?.value).toEqual('89384154733');
		expect(sut.calls.update).toEqual(1);
	});

	it('should be able to throw one error: member already exist', async () => {
		const member = enterpriseMemberFactory();

		await expect(sut.update({ id: member.id })).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.enterpriseMember,
				message: 'Enterprise member doesn\'t exist',
			}),
		);

		expect(sut.calls.update).toEqual(1);
	});
});
