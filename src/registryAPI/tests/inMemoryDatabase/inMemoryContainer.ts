import { OTP } from '@registry:app/entities/OTP';
import { Condominium } from '@registry:app/entities/condominium';
import { CondominiumRelUser } from '@registry:app/entities/condominiumRelUser';
import { Invite } from '@registry:app/entities/invite';
import { User } from '@registry:app/entities/user';

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
	otpArr: { key: string; value: OTP }[];
}

export class InMemoryContainer {
	props: IInMemoryContainerProps = {
		userArr: [],
		condominiumArr: [],
		condominiumRelUserArr: [],
		inviteArr: [],
		otpArr: [],
	};

	erase() {
		this.props = {
			userArr: [],
			condominiumRelUserArr: [],
			inviteArr: [],
			condominiumArr: [],
			otpArr: [],
		};
	}
}
