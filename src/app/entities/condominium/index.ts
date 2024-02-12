import { CEP, Name, Num, CNPJ, UUID } from '../VO';
import { Entity } from '../entities';

interface IPropsCondominium {
	name: Name;
	CEP: CEP;
	num: Num;
	CNPJ: CNPJ;
	createdAt: Date;
	updatedAt: Date;
}

export type TInputPropsCondominium = {
	name: string;
	CEP: string;
	num: number;
	CNPJ: string;
	createdAt?: Date;
	updatedAt?: Date;
};

export const condominiumDTORules = {
	name: {
		minLength: 2,
		maxLength: 120,
		type: 'string',
	},
	CEP: {
		minLength: 8,
		maxLength: 9,
		type: 'string',
	},
	num: {
		minLength: 0,
		maxLength: 2147483647,
		type: 'number',
	},
	CNPJ: {
		minLength: 14,
		maxLength: 18,
		type: 'string',
	},
	createdAt: {
		type: Date,
	},
	updatedAy: {
		type: Date,
	},
};

export class Condominium implements Entity {
	private readonly _id: UUID;
	private props: IPropsCondominium;

	constructor(content: TInputPropsCondominium, id?: string) {
		this.props = {
			name: new Name(content.name),
			CEP: new CEP(content.CEP),
			num: new Num(content.num),
			CNPJ: new CNPJ(content.CNPJ),
			createdAt: content.createdAt ?? new Date(),
			updatedAt: content.updatedAt ?? new Date(),
		};
		this._id = id ? new UUID(id) : UUID.genV4();
	}

	public dereference(): Condominium {
		return new Condominium(
			{
				name: this.name.value,
				CEP: this.CEP.value,
				num: this.num.value,
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
			this.id.equalTo(input.id) &&
			this.props.name.equalTo(input.name) &&
			this.props.CEP.equalTo(input.CEP) &&
			this.props.num.equalTo(input.num) &&
			this.props.CNPJ.equalTo(input.CNPJ) &&
			this.props.createdAt === input.createdAt &&
			this.props.updatedAt === input.updatedAt
		);
	}

	// ID
	get id(): UUID {
		return this._id;
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
		this.CEP = input;
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
