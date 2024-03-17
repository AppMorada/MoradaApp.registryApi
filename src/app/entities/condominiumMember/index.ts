import { Level, UUID } from '../VO';
import { Entity, ValueObject } from '../entities';

interface IProps {
	condominiumId: UUID;
	uniqueRegistryId: UUID;
	userId?: UUID | null;
	role: Level;
	createdAt: Date;
	updatedAt: Date;
}

export interface ICondominiumMemberInput {
	condominiumId: string;
	uniqueRegistryId?: string;
	userId?: string | null;
	role?: number;
	createdAt?: Date;
	updatedAt?: Date;
}

export class CondominiumMember implements Entity {
	private props: IProps;
	private _id: UUID;

	constructor(input: ICondominiumMemberInput, id?: string) {
		this._id = id ? new UUID(id) : UUID.genV4();
		this.props = {
			uniqueRegistryId: ValueObject.build(UUID, input.uniqueRegistryId)
				.or(UUID.genV4())
				.exec(),
			condominiumId: ValueObject.build(UUID, input.condominiumId)
				.or(UUID.genV4())
				.exec(),
			userId: ValueObject.build(UUID, input.userId).allowNullish().exec(),
			role: ValueObject.build(Level, input.role).or(new Level(0)).exec(),
			createdAt: input.createdAt ?? new Date(),
			updatedAt: input.updatedAt ?? new Date(),
		};
	}

	equalTo(input: CondominiumMember): boolean {
		return (
			input instanceof CondominiumMember &&
			input.createdAt === this.createdAt &&
			input.updatedAt === this.updatedAt &&
			ValueObject.compare(this.condominiumId, input.condominiumId) &&
			ValueObject.compare(
				this.uniqueRegistryId,
				input.uniqueRegistryId,
			) &&
			ValueObject.compare(this.userId, input.userId) &&
			ValueObject.compare(this.role, input.role) &&
			ValueObject.compare(this.id, input.id)
		);
	}

	dereference(): CondominiumMember {
		return new CondominiumMember(
			{
				condominiumId: this.condominiumId.value,
				uniqueRegistryId: this.uniqueRegistryId.value,
				userId: this.userId?.value,
				role: this.role.value,
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

	get uniqueRegistryId() {
		return this.props.uniqueRegistryId;
	}
	set uniqueRegistryId(input: UUID) {
		this.props.uniqueRegistryId = input;
	}

	get userId(): UUID | null | undefined {
		return this.props.userId;
	}
	set userId(input: UUID | null | undefined) {
		this.props.userId = input;
	}

	get role(): Level {
		return this.props.role;
	}
	set role(input: Level) {
		this.props.role = input;
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
