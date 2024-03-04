import { Condominium } from '@app/entities/condominium';
import { CondominiumMember } from '@app/entities/condominiumMember';
import { EnterpriseMember } from '@app/entities/enterpriseMember';
import { Invite } from '@app/entities/invite';
import { Key } from '@app/entities/key';
import { Secret } from '@app/entities/secret';
import { User } from '@app/entities/user';

interface IInMemoryContainerProps {
	userArr: User[];
	condominiumMemberArr: CondominiumMember[];
	enterpriseMemberArr: EnterpriseMember[];
	condominiumArr: Condominium[];
	inviteArr: Invite[];
	secretArr: Secret[];
	keyArr: { name: string; value: Key }[];
	keyCacheArr: Key[];
}

export class InMemoryContainer {
	props: IInMemoryContainerProps = {
		userArr: [],
		condominiumMemberArr: [],
		enterpriseMemberArr: [],
		condominiumArr: [],
		inviteArr: [],
		secretArr: [],
		keyArr: [],
		keyCacheArr: [],
	};

	erase() {
		this.props = {
			userArr: [],
			inviteArr: [],
			condominiumMemberArr: [],
			enterpriseMemberArr: [],
			condominiumArr: [],
			keyArr: [],
			keyCacheArr: [],
			secretArr: [],
		};
	}
}
