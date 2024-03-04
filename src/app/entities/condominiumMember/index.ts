import { ApartmentNumber, Block, Email, Level, UUID } from '../VO';
import { Entity, ValueObject } from '../entities';

interface IProps {
	condominiumId: UUID;
	userId?: UUID | null;
	c_email: Email;
	hierarchy: Level;
	apartmentNumber?: ApartmentNumber | null;
	block?: Block | null;
	autoEdit: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface ICondominiumMemberInput {
	condominiumId: string;
	userId?: string | null;
	c_email: string;
	hierarchy: number;
	apartmentNumber?: number | null;
	block?: string | null;
	autoEdit: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

export class CondominiumMember implements Entity {
	private props: IProps;
	private _id: UUID;

	constructor(input: ICondominiumMemberInput, id?: string) {
		this._id = id ? new UUID(id) : UUID.genV4();
		this.props = {
			condominiumId: ValueObject.build(UUID, input.condominiumId)
				.or(UUID.genV4())
				.exec(),
			userId: ValueObject.build(UUID, input.userId).allowNullish().exec(),
			block: ValueObject.build(Block, input.block).allowNullish().exec(),
			autoEdit: input.autoEdit,
			c_email: new Email(input.c_email),
			hierarchy: ValueObject.build(Level, input.hierarchy)
				.or(new Level(0))
				.exec(),
			apartmentNumber: ValueObject.build(
				ApartmentNumber,
				input.apartmentNumber,
			)
				.allowNullish()
				.exec(),
			createdAt: input.createdAt ?? new Date(),
			updatedAt: input.updatedAt ?? new Date(),
		};
	}

	equalTo(input: CondominiumMember): boolean {
		return (
			input instanceof CondominiumMember &&
			input.createdAt === this.createdAt &&
			input.updatedAt === this.updatedAt &&
			input.autoEdit === this.autoEdit &&
			ValueObject.compare(this.condominiumId, input.condominiumId) &&
			ValueObject.compare(this.userId, input.userId) &&
			ValueObject.compare(this.block, input.block) &&
			ValueObject.compare(this.c_email, input.c_email) &&
			ValueObject.compare(this.hierarchy, input.hierarchy) &&
			ValueObject.compare(this.apartmentNumber, input.apartmentNumber) &&
			ValueObject.compare(this.id, input.id)
		);
	}

	dereference(): CondominiumMember {
		return new CondominiumMember(
			{
				condominiumId: this.condominiumId.value,
				userId: this.userId?.value,
				block: this.block?.value,
				autoEdit: this.autoEdit,
				c_email: this.c_email.value,
				hierarchy: this.hierarchy.value,
				apartmentNumber: this.apartmentNumber?.value,
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

	get userId(): UUID | null | undefined {
		return this.props.userId;
	}
	set userId(input: UUID | null | undefined) {
		this.props.userId = input;
	}

	get apartmentNumber(): ApartmentNumber | undefined | null {
		return this.props.apartmentNumber;
	}
	set apartmentNumber(input: ApartmentNumber | undefined | null) {
		this.props.apartmentNumber = input;
	}

	get block(): Block | undefined | null {
		return this.props.block;
	}
	set block(input: Block | undefined | null) {
		this.props.block = input;
	}

	get autoEdit(): boolean {
		return this.props.autoEdit;
	}
	set autoEdit(input: boolean) {
		this.props.autoEdit = input;
	}

	get hierarchy(): Level {
		return this.props.hierarchy;
	}
	set hierarchy(input: Level) {
		this.props.hierarchy = input;
	}

	get c_email(): Email {
		return this.props.c_email;
	}
	set c_email(input: Email) {
		this.props.c_email = input;
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
