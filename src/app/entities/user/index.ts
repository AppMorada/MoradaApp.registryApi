import { Name, Email, Password, CPF, PhoneNumber, UUID } from '../VO';
import { Entity, ValueObject } from '../entities';

interface IPropsUser {
	name: Name;
	email: Email;
	password: Password;
	CPF: CPF;
	phoneNumber?: PhoneNumber | null;
	tfa: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export type TInputPropsUser = {
	name: string;
	email: string;
	password: string;
	CPF: string;
	phoneNumber?: string | null;
	tfa: boolean;
	createdAt?: Date;
	updatedAt?: Date;
};

export const userDTORules = {
	name: {
		minLength: 2,
		maxLength: 120,
		type: 'string',
	},
	email: {
		maxLength: 320,
		type: 'string',
	},
	password: {
		maxLength: 64,
		minLength: 8,
		type: 'string',
	},
	CPF: {
		maxLength: 14,
		minLength: 11,
		type: 'string',
	},
	phoneNumber: {
		maxLength: 30,
		minLength: 10,
		type: 'string',
	},
	createdAt: {
		type: Date,
	},
	updatedAt: {
		type: Date,
	},
};

export class User implements Entity {
	private props: IPropsUser;
	private readonly _id: UUID;

	constructor(input: TInputPropsUser, id?: string) {
		this.props = {
			name: new Name(input.name),
			email: new Email(input.email),
			password: new Password(input.password),
			CPF: new CPF(input.CPF),
			phoneNumber: ValueObject.build(PhoneNumber, input.phoneNumber)
				.allowNullish()
				.exec(),
			tfa: input.tfa,
			createdAt: input.createdAt ?? new Date(),
			updatedAt: input.updatedAt ?? new Date(),
		};
		this._id = id ? new UUID(id) : UUID.genV4();
	}

	public dereference(): User {
		return new User(
			{
				name: this.name.value,
				email: this.email.value,
				password: this.password.value,
				CPF: this.CPF.value,
				phoneNumber: this.phoneNumber
					? this.phoneNumber.value
					: this.phoneNumber,
				tfa: this.tfa,
				createdAt: this.createdAt,
				updatedAt: this.updatedAt,
			},
			this.id.value,
		);
	}

	public equalTo(input: User): boolean {
		return (
			input instanceof User &&
			this.createdAt === input.createdAt &&
			this.updatedAt === input.updatedAt &&
			this.tfa === input.tfa &&
			ValueObject.compare(this._id, input.id) &&
			ValueObject.compare(this.phoneNumber, input.phoneNumber) &&
			ValueObject.compare(this.CPF, input.CPF) &&
			ValueObject.compare(this.password, input.password) &&
			ValueObject.compare(this.name, input.name) &&
			ValueObject.compare(this.email, input.email)
		);
	}

	// Id
	get id(): UUID {
		return this._id;
	}

	// tfa
	get tfa(): boolean {
		return this.props.tfa;
	}
	set tfa(input: boolean) {
		this.props.tfa = input;
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
	get phoneNumber(): PhoneNumber | null | undefined {
		return this.props.phoneNumber;
	}
	set phoneNumber(input: PhoneNumber | null | undefined) {
		this.props.phoneNumber = input;
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
