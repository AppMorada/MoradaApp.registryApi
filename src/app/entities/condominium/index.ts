import { CEP, Name, Num, CNPJ, UUID } from '../VO';
import { Entity, ValueObject } from '../entities';

interface IPropsCondominium {
	ownerId: UUID;
	name: Name;
	CEP: CEP;
	num: Num;
	CNPJ: CNPJ;
	seedKey: string;
	createdAt: Date;
	updatedAt: Date;
}

export type TInputPropsCondominium = {
	ownerId: string;
	name: string;
	CEP: string;
	num: number;
	CNPJ: string;
	seedKey: string;
	createdAt?: Date;
	updatedAt?: Date;
};

export class Condominium implements Entity {
	private readonly _id: UUID;
	private props: IPropsCondominium;

	constructor(content: TInputPropsCondominium, id?: string) {
		this.props = {
			ownerId: new UUID(content.ownerId),
			name: new Name(content.name),
			CEP: new CEP(content.CEP),
			num: new Num(content.num),
			CNPJ: new CNPJ(content.CNPJ),
			seedKey: content.seedKey,
			createdAt: content.createdAt ?? new Date(),
			updatedAt: content.updatedAt ?? new Date(),
		};
		this._id = id ? new UUID(id) : UUID.genV4();
	}

	public dereference(): Condominium {
		return new Condominium(
			{
				ownerId: this.ownerId.value,
				name: this.name.value,
				CEP: this.CEP.value,
				num: this.num.value,
				CNPJ: this.CNPJ.value,
				seedKey: this.seedKey,
				createdAt: this.createdAt,
				updatedAt: this.updatedAt,
			},
			this.id.value,
		);
	}

	public equalTo(input: Condominium): boolean {
		return (
			input instanceof Condominium &&
			ValueObject.compare(this.id, input.id) &&
			ValueObject.compare(this.ownerId, input.ownerId) &&
			ValueObject.compare(this.name, input.name) &&
			ValueObject.compare(this.CEP, input.CEP) &&
			ValueObject.compare(this.num, input.num) &&
			ValueObject.compare(this.CNPJ, input.CNPJ) &&
			this.seedKey === input.seedKey &&
			this.props.createdAt === input.createdAt &&
			this.props.updatedAt === input.updatedAt
		);
	}

	// ID
	get id(): UUID {
		return this._id;
	}

	// OwnerID
	get ownerId(): UUID {
		return this.props.ownerId;
	}

	// SeedKey
	get seedKey(): string {
		return this.props.seedKey;
	}

	// NAME
	get name(): Name {
		return this.props.name;
	}
	set name(input: Name) {
		this.props.name = input;
	}

	// CEP
	get CEP(): CEP {
		return this.props.CEP;
	}
	set CEP(input: CEP) {
		this.props.CEP = input;
	}

	// NUM
	get num(): Num {
		return this.props.num;
	}
	set num(input: Num) {
		this.props.num = input;
	}

	// CNPJ
	get CNPJ(): CNPJ {
		return this.props.CNPJ;
	}
	set CNPJ(input: CNPJ) {
		this.props.CNPJ = input;
	}

	// CREATEDAT
	get createdAt(): Date {
		return this.props.createdAt;
	}

	// UPDATEDAT
	get updatedAt(): Date {
		return this.props.updatedAt;
	}
}
