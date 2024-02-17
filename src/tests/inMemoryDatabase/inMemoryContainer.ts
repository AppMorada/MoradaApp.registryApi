import { OTP } from '@app/entities/OTP';
import { Condominium } from '@app/entities/condominium';
import { CondominiumRelUser } from '@app/entities/condominiumRelUser';
import { Invite } from '@app/entities/invite';
import { Key } from '@app/entities/key';
import { Secret } from '@app/entities/secret';
import { User } from '@app/entities/user';

export interface IInMemoryUserContainer {
	user: {
		content: User;
		condominiumRelUser: Record<string, CondominiumRelUser>;
	};
}

interface IInMemoryContainerProps {
	userArr: IInMemoryUserContainer[];
	condominiumArr: Condominium[];
	condominiumRelUserArr: CondominiumRelUser[];
	inviteArr: Invite[];
	secretArr: Secret[];
	otpArr: { key: string; value: OTP }[];
	keyArr: { name: string; value: Key }[];
}

export class InMemoryContainer {
	props: IInMemoryContainerProps = {
		userArr: [],
		condominiumArr: [],
		condominiumRelUserArr: [],
		inviteArr: [],
		otpArr: [],
		secretArr: [],
		keyArr: [],
	};

	erase() {
		this.props = {
			userArr: [],
			condominiumRelUserArr: [],
			inviteArr: [],
			condominiumArr: [],
			otpArr: [],
			keyArr: [],
			secretArr: [],
		};
	}
}
