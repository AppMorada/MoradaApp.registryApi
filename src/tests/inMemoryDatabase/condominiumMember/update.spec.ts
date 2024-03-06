import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryCondominiumMembers } from '.';
import { EntitiesEnum } from '@app/entities/entities';
import { InMemoryContainer } from '../inMemoryContainer';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { ApartmentNumber, Block, Email } from '@app/entities/VO';

describe('InMemoryData test: Condominium Member update method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryCondominiumMembers;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryCondominiumMembers(container);
	});

	it('should be able to update one member', async () => {
		const member = condominiumMemberFactory();
		sut.condominiumMembers.push(member);

		expect(
			sut.update({
				apartmentNumber: new ApartmentNumber(7845),
				c_email: new Email('newemail@email.com'),
				id: member.id,
				block: new Block('B8'),
			}),
		).resolves;

		const searchedMember = sut.condominiumMembers?.[0];
		expect(searchedMember?.apartmentNumber?.value).toEqual(7845);
		expect(searchedMember?.c_email?.value).toEqual('newemail@email.com');
		expect(searchedMember?.block?.value).toEqual('B8');
		expect(sut.calls.update).toEqual(1);
	});

	it('should be able to throw one error: member already exist', async () => {
		const member = condominiumMemberFactory();

		await expect(sut.update({ id: member.id })).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.condominiumMember,
				message: 'Condominium member doesn\'t exist',
			}),
		);

		expect(sut.calls.update).toEqual(1);
	});
});
