import { CommunityInfos } from '@app/entities/communityInfos';
import { Condominium } from '@app/entities/condominium';
import { CondominiumMember } from '@app/entities/condominiumMember';
import { CondominiumRequest } from '@app/entities/condominiumRequest';
import { Key } from '@app/entities/key';
import { Secret } from '@app/entities/secret';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';
import { User } from '@app/entities/user';

interface IInMemoryContainerProps {
	userArr: User[];
	uniqueRegistryArr: UniqueRegistry[];
	condominiumMemberArr: CondominiumMember[];
	condominiumRequestArr: CondominiumRequest[];
	condominiumArr: Condominium[];
	communityInfosArr: CommunityInfos[];
	secretArr: Secret[];
	keyArr: { name: string; value: Key }[];
	keyCacheArr: Key[];
}

export class InMemoryContainer {
	props: IInMemoryContainerProps = {
		userArr: [],
		uniqueRegistryArr: [],
		condominiumMemberArr: [],
		condominiumRequestArr: [],
		condominiumArr: [],
		secretArr: [],
		keyArr: [],
		keyCacheArr: [],
		communityInfosArr: [],
	};

	erase() {
		this.props = {
			userArr: [],
			uniqueRegistryArr: [],
			condominiumMemberArr: [],
			condominiumRequestArr: [],
			condominiumArr: [],
			keyArr: [],
			keyCacheArr: [],
			secretArr: [],
			communityInfosArr: [],
		};
	}
}
