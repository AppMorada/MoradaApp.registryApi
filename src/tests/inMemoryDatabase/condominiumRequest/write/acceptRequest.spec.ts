import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryCondominiumRequestWriteOps } from '.';
import { userFactory } from '@tests/factories/user';
import { EntitiesEnum } from '@app/entities/entities';
import { InMemoryContainer } from '../../inMemoryContainer';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { condominiumRequestFactory } from '@tests/factories/condominiumRequest';

describe('InMemoryData test: Condominium request acceptRequest method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryCondominiumRequestWriteOps;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryCondominiumRequestWriteOps(container);
	});

	it('should be able to accept a condominium request', async () => {
		const user = userFactory();
		const condominiumMember = condominiumMemberFactory({
			userId: user.id.value,
			role: -1,
		});
		const condominiumRequest = condominiumRequestFactory({
			userId: user.id.value,
			condominiumId: condominiumMember.condominiumId.value,
		});

		sut.users.push(user);
		sut.condominiumRequests.push(condominiumRequest);
		sut.condominiumMembers.push(condominiumMember);

		await sut.acceptRequest({
			userId: user.id,
			condominiumId: condominiumMember.condominiumId,
		});

		expect(sut.condominiumMembers[0].userId?.equalTo(user.id)).toBe(true);
		expect(sut.calls.acceptRequest).toEqual(1);
	});

	it('should be able to throw one error: condominium request doesn\'t exist', async () => {
		const condominiumMember = condominiumMemberFactory();
		const user = userFactory();

		await expect(
			sut.acceptRequest({
				userId: user.id,
				condominiumId: condominiumMember.condominiumId,
			}),
		).rejects.toThrow(
			new InMemoryError({
				message:
					'Condominium request doesn\'t exist or member already exist',
				entity: EntitiesEnum.condominiumRequest,
			}),
		);

		expect(sut.calls.acceptRequest).toEqual(1);
	});
});
