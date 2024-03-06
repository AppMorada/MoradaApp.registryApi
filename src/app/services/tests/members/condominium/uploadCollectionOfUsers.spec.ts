import { UUID } from '@app/entities/VO';
import { GenInviteService } from '@app/services/invites/genInvite.service';
import { UploadCollectionOfMembersService } from '@app/services/members/condominium/uploadCollectionOfUsers';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { userFactory } from '@tests/factories/user';
import { InMemoryCondominiumMembers } from '@tests/inMemoryDatabase/condominiumMember';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { GenericServiceSpy } from '@tests/services/genericService';

describe('Upload collection of users', () => {
	let container: InMemoryContainer;
	let memberRepo: InMemoryCondominiumMembers;
	let genInvite: GenInviteService;

	let sut: UploadCollectionOfMembersService;

	beforeEach(() => {
		container = new InMemoryContainer();
		memberRepo = new InMemoryCondominiumMembers(container);
		genInvite = new GenericServiceSpy() as unknown as GenInviteService;

		sut = new UploadCollectionOfMembersService(memberRepo, genInvite);
	});

	it('should be able to upload new collection of users', async () => {
		const condominiumId = UUID.genV4();

		const email1 = 'user1@email.com';
		const email2 = 'user2@email.com';
		const user1 = userFactory({
			email: email1,
		});
		const user2 = userFactory({
			email: email2,
		});
		const rawMembers = [
			{
				member: condominiumMemberFactory({
					userId: user1.id.value,
					c_email: email1,
					condominiumId: condominiumId.value,
				}),
				user: user1,
			},
			{
				member: condominiumMemberFactory({
					userId: user2.id.value,
					c_email: email2,
					condominiumId: condominiumId.value,
				}),
				user: user2,
			},
		];

		rawMembers.map((item) => ({
			c_email: item.member.c_email.value,
			apartmentNumber: item.member.apartmentNumber!.value,
			block: item.member.block!.value,
			CPF: item.member.CPF.value,
		}));

		await sut.exec({
			condominiumId: condominiumId.value,
			members: rawMembers.map((item) => ({
				c_email: item.member.c_email.value,
				apartmentNumber: item.member.apartmentNumber!.value,
				block: item.member.block!.value,
				CPF: item.member.CPF.value,
			})),
		});
		expect(memberRepo.calls.create === 2).toEqual(true);
	});
});
