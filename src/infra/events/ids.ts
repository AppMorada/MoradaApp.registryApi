import { IDeleteCondominiumProps as IDeleteCondominium } from '@app/publishers/deleteCondominium';
import { IDeleteMemberProps as IDeleteMember } from '@app/publishers/deleteMember';
import { IDeleteUserProps as IDeleteUser } from '@app/publishers/deleteUser';

export namespace EventsTypes {
	export namespace PubSub {
		export type IDeleteCondominiumProps = IDeleteCondominium;
		export type IDeleteMemberProps = IDeleteMember;
		export type IDeleteUserProps = IDeleteUser;
	}

	export namespace Email {
		export interface ISendProps {
			to: string;
			subject: string;
			body: string;
		}
	}
}

export const EVENT_ID = {
	EMAIL: {
		SEND: Symbol.for('email.send'),
	},
	PUBSUB: {
		DELETE_USER: Symbol.for('delete_user'),
		DELETE_MEMBER: Symbol.for('delete_member'),
		DELETE_CONDOMINIUM: Symbol.for('delete_condominium'),
	},
	TRACE: {
		INTERNALS: 'Internal event',
		PUBSUB: 'Pubsub event',
	},
};
