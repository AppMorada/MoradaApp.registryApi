import { UUID, Block, Level, ApartmentNumber } from '../VO';
import { Entity, ValueObject } from '../entities';

export interface ICondominiumRelUserProps {
	userId: UUID;
	condominiumId: UUID;
	block?: Block | null;
	apartmentNumber?: ApartmentNumber | null;
	level: Level;
	updatedAt: Date;
}

export interface IInputCondominiumRelUser {
	userId: string;
	condominiumId: string;
	block?: string | null;
	apartmentNumber?: number | null;
	level?: number | null;
	updatedAt?: Date;
}

export const condominiumRelUserDTORules = {
	userId: {
		type: 'string',
	},
	condominiumId: {
		type: 'string',
	},
	block: {
		maxLength: 6,
		option: true,
		type: 'string',
	},
	apartmentNumber: {
		maxLength: 2147483647,
		minLength: 0,
		type: 'number',
	},
	level: {
		maxLength: 2,
		minLength: 0,
		type: 'number',
	},
	updatedAt: {
		type: Date,
	},
};

export class CondominiumRelUser implements Entity {
	private readonly _id: UUID;
	private props: ICondominiumRelUserProps;

	constructor(input: IInputCondominiumRelUser, id?: string) {
		this._id = ValueObject.build(UUID, id).or(UUID.genV4()).exec();
		this.props = {
			level: ValueObject.build(Level, input.level)
				.or(new Level(0))
				.exec(),
			apartmentNumber: ValueObject.build(
				ApartmentNumber,
				input.apartmentNumber,
			)
				.allowNullish()
				.exec(),
			block: ValueObject.build(Block, input.block).allowNullish().exec(),
			condominiumId: ValueObject.build(UUID, input.condominiumId).exec(),
			userId: ValueObject.build(UUID, input.userId).exec(),
			updatedAt: input.updatedAt ?? new Date(),
		};
	}

	dereference(): CondominiumRelUser {
		return new CondominiumRelUser({
			level: this.props.level.value,
			block:
				this.props.block instanceof Block
					? this.props.block.value
					: this.props.block,
			apartmentNumber:
				this.props.apartmentNumber instanceof ApartmentNumber
					? this.props.apartmentNumber.value
					: this.props.apartmentNumber,
			condominiumId: this.props.condominiumId.value,
			userId: this.props.userId.value,
			updatedAt: this.props.updatedAt,
		});
	}

	equalTo(input: CondominiumRelUser): boolean {
		return (
			input instanceof CondominiumRelUser &&
			ValueObject.compare(
				this.props.condominiumId,
				input.condominiumId,
			) &&
			ValueObject.compare(
				this.props.apartmentNumber,
				input.apartmentNumber,
			) &&
			ValueObject.compare(this.props.block, input.block) &&
			ValueObject.compare(this.props.level, input.level) &&
			ValueObject.compare(this.props.userId, input.userId) &&
			this.props.updatedAt === this.props.updatedAt
		);
	}

	get id(): UUID {
		return this._id;
	}

	set level(input: Level) {
		this.props.level = input;
	}
	get level(): Level {
		return this.props.level;
	}

	set condominiumId(input: UUID) {
		this.props.condominiumId = input;
	}
	get condominiumId(): UUID {
		return this.props.condominiumId;
	}

	set userId(input: UUID) {
		this.props.userId = input;
	}
	get userId(): UUID {
		return this.props.userId;
	}

	set block(input: Block | undefined | null) {
		this.props.block = input;
	}
	get block(): Block | undefined | null {
		return this.props.block;
	}

	set apartmentNumber(input: ApartmentNumber | undefined | null) {
		this.props.apartmentNumber = input;
	}
	get apartmentNumber(): ApartmentNumber | undefined | null {
		return this.props.apartmentNumber;
	}

	set updatedAt(input: Date) {
		this.props.updatedAt = input;
	}
	get updatedAt(): Date {
		return this.props.updatedAt;
	}
}
