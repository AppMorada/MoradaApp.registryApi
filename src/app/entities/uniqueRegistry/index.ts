import { CPF, Email, UUID } from '../VO';
import { Entity, ValueObject } from '../entities';

interface IProps {
	CPF?: CPF | null;
	email: Email;
}

interface IUniqueRegistryInput {
	CPF?: string | null;
	email: string;
}

export class UniqueRegistry implements Entity {
	private readonly _id: UUID;
	private props: IProps;

	constructor(input: IUniqueRegistryInput, id?: string) {
		this._id = ValueObject.build(UUID, id).or(UUID.genV4()).exec();
		this.props = {
			CPF: ValueObject.build(CPF, input.CPF).allowNullish().exec(),
			email: new Email(input.email),
		};
	}

	equalTo(input: UniqueRegistry): boolean {
		return (
			input instanceof UniqueRegistry &&
			input.email.equalTo(this.email) &&
			ValueObject.compare(input.CPF, this.CPF) &&
			input.id.equalTo(this.id)
		);
	}

	dereference(): UniqueRegistry {
		return new UniqueRegistry(
			{
				CPF: this.CPF?.value,
				email: this.email.value,
			},
			this.id.value,
		);
	}

	get id() {
		return this._id;
	}

	get CPF(): CPF | null | undefined {
		return this.props.CPF;
	}
	set CPF(input: CPF | null | undefined) {
		this.props.CPF = input;
	}

	get email() {
		return this.props.email;
	}
	set email(input: Email) {
		this.props.email = input;
	}
}
