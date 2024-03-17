import { CommunityInfos } from '@app/entities/communityInfos';
import { Condominium } from '@app/entities/condominium';
import { CondominiumMember } from '@app/entities/condominiumMember';
import { Invite } from '@app/entities/invite';
import { Key } from '@app/entities/key';
import { Secret } from '@app/entities/secret';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';
import { User } from '@app/entities/user';

interface IInMemoryContainerProps {
	userArr: User[];
	uniqueRegistryArr: UniqueRegistry[];
	condominiumMemberArr: CondominiumMember[];
	condominiumArr: Condominium[];
	communityInfosArr: CommunityInfos[];
	inviteArr: Invite[];
	secretArr: Secret[];
	keyArr: { name: string; value: Key }[];
	keyCacheArr: Key[];
}

export class InMemoryContainer {
	props: IInMemoryContainerProps = {
		userArr: [],
		uniqueRegistryArr: [],
		condominiumMemberArr: [],
		condominiumArr: [],
		inviteArr: [],
		secretArr: [],
		keyArr: [],
		keyCacheArr: [],
		communityInfosArr: [],
	};

	erase() {
		this.props = {
			userArr: [],
			uniqueRegistryArr: [],
			inviteArr: [],
			condominiumMemberArr: [],
			condominiumArr: [],
			keyArr: [],
			keyCacheArr: [],
			secretArr: [],
			communityInfosArr: [],
		};
	}
}
