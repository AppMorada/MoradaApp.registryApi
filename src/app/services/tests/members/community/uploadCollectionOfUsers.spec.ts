import { SendInviteService } from '@app/services/invites/sendInvite.service';
import { UploadCollectionOfMembersService } from '@app/services/members/community/uploadCollectionOfUsers';
import { condominiumFactory } from '@tests/factories/condominium';
import { userFactory } from '@tests/factories/user';
import { InMemoryCommunityMembersCreateMany } from '@tests/inMemoryDatabase/communityMember/write/createMany';
import { SendInviteServiceSpy } from '@tests/services/genInviteService';

describe('Upload collection of users', () => {
	let createManyMemberRepo: InMemoryCommunityMembersCreateMany;
	let genInvite: SendInviteService;

	let sut: UploadCollectionOfMembersService;

	beforeEach(() => {
		createManyMemberRepo = new InMemoryCommunityMembersCreateMany();
		genInvite = new SendInviteServiceSpy() as unknown as SendInviteService;

		sut = new UploadCollectionOfMembersService(
			createManyMemberRepo,
			genInvite,
		);
	});

	it('should be able to upload new collection of users', async () => {
		const condominium = condominiumFactory();
		const author = userFactory();

		const members = [
			{
				email: 'user1@email.com',
				apartmentNumber: 100,
				block: 'A12',
			},
			{
				email: 'user2@email.com',
				apartmentNumber: 200,
				block: 'A23',
			},
		];

		await sut.exec({ condominium, user: author, members });
		expect(createManyMemberRepo.calls.exec).toEqual(1);
	});
});
