import { Email, Level, UUID } from '../VO';
import { Entity } from '../entities';

export interface IProps {
	email: Email;
	ttl: number;
	expiresAt: Date;
	condominiumId: UUID;
	type: Level;
}

export interface IInputPropsInvite {
	email: string;
	ttl: number;
	expiresAt?: Date;
	condominiumId: string;
	type: number;
}

export class Invite implements Entity {
	private readonly props: IProps;
	private readonly _id: UUID;

	constructor(input: IInputPropsInvite, id?: string) {
		this.props = {
			email: new Email(input.email),
			ttl: input.ttl,
			type: new Level(input.type),
			condominiumId: new UUID(input.condominiumId),
			expiresAt: input.expiresAt ?? new Date(Date.now() + input.ttl),
		};
		this._id = id ? new UUID(id) : UUID.genV4();
	}

	dereference(): Invite {
		return new Invite(
			{
				email: this.email.value,
				ttl: this.ttl,
				type: this.type.value,
				condominiumId: this.condominiumId.value,
				expiresAt: this.expiresAt,
			},
			this.id.value,
		);
	}

	equalTo(input: Invite): boolean {
		return (
			input.id.equalTo(this.id) &&
			input.type.equalTo(this.type) &&
			input.email.equalTo(this.email) &&
			input.ttl === this.ttl &&
			input.expiresAt === this.expiresAt &&
			input.condominiumId.equalTo(this.condominiumId)
		);
	}

	get email(): Email {
		return this.props.email;
	}
	get ttl(): number {
		return this.props.ttl;
	}
	get expiresAt(): Date {
		return this.props.expiresAt;
	}
	get type(): Level {
		return this.props.type;
	}
	get condominiumId(): UUID {
		return this.props.condominiumId;
	}
	get id(): UUID {
		return this._id;
	}
}
