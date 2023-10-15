import { randomUUID } from 'crypto';
import { TReplace } from '../../../utils/replace';
import { CEP } from '../VO/CEP';
import { Name } from '../VO/name';
import { Num } from '../VO/num';
import { Block } from '../VO/block';
import { CNPJ } from '../VO/CNPJ';

interface IPropsCondominium {
	name: Name;
	CEP: CEP;
	num: Num;
	block: Block;
	CNPJ: CNPJ;
	createdAt: Date;
	updatedAt: Date;
}

export type TInputPropsCondominium = TReplace<
	TReplace<IPropsCondominium, { createdAt?: Date }>,
	{ updatedAt?: Date }
>;

export class Condominium {
	private readonly _id: string;
	private props: IPropsCondominium;

	constructor(content: TInputPropsCondominium, id?: string) {
		this.props = {
			...content,
			createdAt: content.createdAt ?? new Date(),
			updatedAt: content.updatedAt ?? new Date(),
		};
		this._id = id ?? randomUUID();
	}

	public equalTo(input: Condominium) {
		return (
			input instanceof Condominium &&
			this.id === input.id &&
			this.props.name.equalTo(input.name) &&
			this.props.CEP.equalTo(input.CEP) &&
			this.props.num.equalTo(input.num) &&
			this.props.block.equalTo(input.block) &&
			this.props.CNPJ.equalTo(input.CNPJ) &&
			this.props.createdAt === input.createdAt &&
			this.props.updatedAt === input.updatedAt
		);
	}

	// ID
	get id(): string {
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

	// BLOCK
	get block(): Block {
		return this.props.block;
	}
	set block(input: Block) {
		this.props.block = input;
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
