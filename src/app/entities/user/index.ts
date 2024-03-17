import { Name, Password, PhoneNumber, UUID } from '../VO';
import { Entity, ValueObject } from '../entities';

interface IPropsUser {
	name: Name;
	uniqueRegistryId: UUID;
	password: Password;
	phoneNumber?: PhoneNumber | null;
	tfa: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export type TInputPropsUser = {
	name: string;
	uniqueRegistryId?: string;
	password: string;
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
		maxLength: 20,
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
			uniqueRegistryId: ValueObject.build(UUID, input.uniqueRegistryId)
				.or(UUID.genV4())
				.exec(),
			password: new Password(input.password),
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
				uniqueRegistryId: this.uniqueRegistryId.value,
				password: this.password.value,
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
			ValueObject.compare(
				this.uniqueRegistryId,
				input.uniqueRegistryId,
			) &&
			ValueObject.compare(this.phoneNumber, input.phoneNumber) &&
			ValueObject.compare(this.password, input.password) &&
			ValueObject.compare(this.name, input.name)
		);
	}

	get id(): UUID {
		return this._id;
	}

	get uniqueRegistryId() {
		return this.props.uniqueRegistryId;
	}
	set uniqueRegistryId(input: UUID) {
		this.props.uniqueRegistryId = input;
	}

	get tfa(): boolean {
		return this.props.tfa;
	}
	set tfa(input: boolean) {
		this.props.tfa = input;
	}

	get name(): Name {
		return this.props.name;
	}
	set name(input: Name) {
		this.props.name = input;
	}

	get password(): Password {
		return this.props.password;
	}
	set password(input: Password) {
		this.props.password = input;
	}

	get phoneNumber(): PhoneNumber | null | undefined {
		return this.props.phoneNumber;
	}
	set phoneNumber(input: PhoneNumber | null | undefined) {
		this.props.phoneNumber = input;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	get updatedAt(): Date {
		return this.props.updatedAt;
	}
}
