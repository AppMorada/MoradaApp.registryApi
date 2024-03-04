import { CPF, Email, Level, UUID } from '../VO';
import { Entity, ValueObject } from '../entities';

export interface IInviteProps {
	recipient: Email;
	condominiumId: UUID;
	CPF: CPF;
	hierarchy: Level;
	createdAt: Date;
}

export interface IInputPropsInvite {
	recipient: string;
	condominiumId: string;
	CPF: string;
	hierarchy: number;
	createdAt?: Date;
}

export class Invite implements Entity {
	private readonly props: IInviteProps;
	private readonly _id: UUID;

	constructor(input: IInputPropsInvite, id?: string) {
		this.props = {
			recipient: new Email(input.recipient),
			condominiumId: new UUID(input.condominiumId),
			CPF: new CPF(input.CPF),
			hierarchy: new Level(input.hierarchy),
			createdAt: input.createdAt ?? new Date(),
		};
		this._id = id ? new UUID(id) : UUID.genV4();
	}

	dereference(): Invite {
		return new Invite(
			{
				condominiumId: this.condominiumId.value,
				CPF: this.CPF.value,
				hierarchy: this.hierarchy.value,
				recipient: this.recipient.value,
				createdAt: this.createdAt,
			},
			this.id.value,
		);
	}

	equalTo(input: Invite): boolean {
		return (
			input instanceof Invite &&
			input.createdAt === this.createdAt &&
			ValueObject.compare(input.id, this.id) &&
			ValueObject.compare(input.condominiumId, this.condominiumId) &&
			ValueObject.compare(input.recipient, this.recipient) &&
			ValueObject.compare(input.hierarchy, this.hierarchy) &&
			ValueObject.compare(input.CPF, this.CPF)
		);
	}

	get recipient(): Email {
		return this.props.recipient;
	}
	get hierarchy(): Level {
		return this.props.hierarchy;
	}
	get CPF(): CPF {
		return this.props.CPF;
	}
	get condominiumId(): UUID {
		return this.props.condominiumId;
	}
	get id(): UUID {
		return this._id;
	}
	get createdAt(): Date {
		return this.props.createdAt;
	}
}
