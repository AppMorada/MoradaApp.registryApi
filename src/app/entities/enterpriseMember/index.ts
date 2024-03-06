import { CPF, UUID } from '../VO';
import { Entity, ValueObject } from '../entities';

interface IProps {
	condominiumId: UUID;
	userId: UUID;
	CPF: CPF;
	createdAt: Date;
	updatedAt: Date;
}

export interface IEnterpriseMemberInput {
	condominiumId: string;
	userId: string;
	CPF: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export class EnterpriseMember implements Entity {
	private props: IProps;
	private _id: UUID;

	constructor(input: IEnterpriseMemberInput, id?: string) {
		this._id = id ? new UUID(id) : UUID.genV4();
		this.props = {
			condominiumId: ValueObject.build(UUID, input.condominiumId)
				.or(UUID.genV4())
				.exec(),
			userId: ValueObject.build(UUID, input.userId).exec(),
			CPF: new CPF(input.CPF),
			createdAt: input.createdAt ?? new Date(),
			updatedAt: input.updatedAt ?? new Date(),
		};
	}

	equalTo(input: EnterpriseMember): boolean {
		return (
			input instanceof EnterpriseMember &&
			input.createdAt === this.createdAt &&
			input.updatedAt === this.updatedAt &&
			ValueObject.compare(this.condominiumId, input.condominiumId) &&
			ValueObject.compare(this.userId, input.userId) &&
			ValueObject.compare(this.CPF, input.CPF) &&
			ValueObject.compare(this.id, input.id)
		);
	}

	dereference(): EnterpriseMember {
		return new EnterpriseMember(
			{
				condominiumId: this.condominiumId.value,
				userId: this.userId.value,
				CPF: this.CPF.value,
				createdAt: this.createdAt,
				updatedAt: this.updatedAt,
			},
			this.id.value,
		);
	}

	get id() {
		return this._id;
	}

	get condominiumId() {
		return this.props.condominiumId;
	}
	set condominiumId(input: UUID) {
		this.props.condominiumId = input;
	}

	get userId(): UUID {
		return this.props.userId;
	}
	set userId(input: UUID) {
		this.props.userId = input;
	}

	get CPF(): CPF {
		return this.props.CPF;
	}
	set CPF(input: CPF) {
		this.props.CPF = input;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}
	set createdAt(input: Date) {
		this.props.createdAt = input;
	}

	get updatedAt(): Date {
		return this.props.updatedAt;
	}
	set updatedAt(input: Date) {
		this.props.updatedAt = input;
	}
}
