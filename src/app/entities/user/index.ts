import { randomUUID } from 'crypto';
import { TReplace } from 'src/utils/replace';
import { Name } from '../VO/name';
import { Email } from '../VO/email';
import { Password } from '../VO/password';
import { CPF } from '../VO/CPF';
import { PhoneNumber } from '../VO/phoneNumber';
import { Level } from '../VO/level';

interface IPropsUser {
	id: string;
	name: Name;
	email: Email;
	password: Password;
	CPF: CPF;
	phoneNumber: PhoneNumber;
	level: Level;
	createdAt: Date;
	updatedAt: Date;
	condominiumId: string;
}

export type TInputPropsUser = TReplace<
	TReplace<IPropsUser, { createdAt?: Date }>,
	{ updatedAt?: Date }
>;

export class User {
	private props: IPropsUser;
	private readonly _id: string;

	constructor(input: TInputPropsUser, id?: string) {
		this.props = {
			...input,
			createdAt: input.createdAt ?? new Date(),
			updatedAt: input.updatedAt ?? new Date(),
		};
		this._id = id ?? randomUUID();
	}

	// Id
	get id(): string {
		return this._id;
	}

	// Condominium Id
	get condominiumId(): string {
		return this.props.condominiumId;
	}

	// Name
	get name(): Name {
		return this.props.name;
	}
	set name(input: Name) {
		this.props.name = input;
	}

	// Email
	get email(): Email {
		return this.props.email;
	}
	set email(input: Email) {
		this.props.email = input;
	}

	// Password
	get password(): Password {
		return this.props.password;
	}
	set password(input: Password) {
		this.props.password = input;
	}

	// CPF
	get CPF(): CPF {
		return this.props.CPF;
	}
	set CPF(input: CPF) {
		this.props.CPF = input;
	}

	// PhoneNumber
	get phoneNumber(): PhoneNumber {
		return this.props.phoneNumber;
	}
	set phoneNumber(input: PhoneNumber) {
		this.props.phoneNumber = input;
	}

	// Level
	get level(): Level {
		return this.props.level;
	}
	set level(input: Level) {
		this.props.level = input;
	}

	// CreatedAt
	get createdAt(): Date {
		return this.props.createdAt;
	}

	// UpdatedAt
	get updatedAt(): Date {
		return this.props.updatedAt;
	}
}
