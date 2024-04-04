import { generateRandomChars } from '@utils/generateRandomChars';
import {
	CEP,
	Name,
	Num,
	CNPJ,
	UUID,
	Reference,
	Complement,
	District,
	State,
	City,
} from '../VO';
import { Entity, ValueObject } from '../entities';

interface IPropsCondominium {
	humanReadableId: string;
	ownerId: UUID;
	name: Name;
	CEP: CEP;
	num: Num;
	reference?: Reference | null;
	district: District;
	state: State;
	city: City;
	complement?: Complement | null;
	CNPJ: CNPJ;
	createdAt: Date;
	updatedAt: Date;
}

export type TInputPropsCondominium = {
	humanReadableId?: string;
	ownerId: string;
	name: string;
	CEP: string;
	num: number;
	reference?: string | null;
	district: string;
	state: string;
	city: string;
	complement?: string | null;
	CNPJ: string;
	createdAt?: Date;
	updatedAt?: Date;
};

export class Condominium implements Entity {
	private readonly _id: UUID;
	private props: IPropsCondominium;

	constructor(content: TInputPropsCondominium, id?: string) {
		this.props = {
			humanReadableId: content.humanReadableId ?? generateRandomChars(6),
			ownerId: new UUID(content.ownerId),
			name: new Name(content.name),
			CEP: new CEP(content.CEP),
			num: new Num(content.num),
			district: new District(content.district),
			city: new City(content.city),
			state: new State(content.state),
			complement: ValueObject.build(Complement, content.complement)
				.allowNullish()
				.exec(),
			reference: ValueObject.build(Reference, content.reference)
				.allowNullish()
				.exec(),
			CNPJ: new CNPJ(content.CNPJ),
			createdAt: content.createdAt ?? new Date(),
			updatedAt: content.updatedAt ?? new Date(),
		};
		this._id = id ? new UUID(id) : UUID.genV4();
	}

	public dereference(): Condominium {
		return new Condominium(
			{
				humanReadableId: this.humanReadableId,
				ownerId: this.ownerId.value,
				name: this.name.value,
				CEP: this.CEP.value,
				num: this.num.value,
				reference: this.reference
					? this.reference.value
					: this.reference,
				city: this.city.value,
				district: this.district.value,
				state: this.state.value,
				complement: this.complement
					? this.complement.value
					: this.complement,
				CNPJ: this.CNPJ.value,
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
			ValueObject.compare(this.district, input.district) &&
			ValueObject.compare(this.city, input.city) &&
			ValueObject.compare(this.state, input.state) &&
			ValueObject.compare(this.complement, input.complement) &&
			ValueObject.compare(this.reference, input.reference) &&
			this.humanReadableId === input.humanReadableId &&
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

	// HumanReadableId
	get humanReadableId(): string {
		return this.props.humanReadableId;
	}

	// Name
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

	// Num
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

	// Reference
	get reference(): Reference | undefined | null {
		return this.props.reference;
	}
	set reference(input: Reference | undefined | null) {
		this.props.reference = input;
	}

	// Complement
	get complement(): Complement | undefined | null {
		return this.props.complement;
	}
	set complement(input: Complement | undefined | null) {
		this.props.complement = input;
	}

	// District
	get district(): District {
		return this.props.district;
	}
	set district(input: District) {
		this.props.district = input;
	}

	// City
	get city(): City {
		return this.props.city;
	}
	set city(input: City) {
		this.props.city = input;
	}

	// State
	get state(): State {
		return this.props.state;
	}
	set state(input: State) {
		this.props.state = input;
	}

	// Createdat
	get createdAt(): Date {
		return this.props.createdAt;
	}

	// Updatedat
	get updatedAt(): Date {
		return this.props.updatedAt;
	}
}
