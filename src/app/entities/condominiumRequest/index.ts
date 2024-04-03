import { UUID } from '../VO';
import { Entity } from '../entities';

interface IProps {
	userId: UUID;
	condominiumId: UUID;
	uniqueRegistryId: UUID;
	message?: string | null;
	createdAt: Date;
}

export interface ICondominiumRequestEntityPropsInput {
	userId: string;
	condominiumId: string;
	uniqueRegistryId: string;
	message?: string | null;
	createdAt?: Date;
}

export class CondominiumRequest implements Entity {
	private props: IProps;

	constructor(input: ICondominiumRequestEntityPropsInput) {
		this.props = {
			userId: new UUID(input.userId),
			condominiumId: new UUID(input.condominiumId),
			uniqueRegistryId: new UUID(input.uniqueRegistryId),
			message: input.message,
			createdAt: input.createdAt ?? new Date(),
		};
	}

	equalTo(input: CondominiumRequest): boolean {
		return (
			this instanceof CondominiumRequest &&
			this.condominiumId.equalTo(input.condominiumId) &&
			this.userId.equalTo(input.userId) &&
			this.uniqueRegistryId.equalTo(input.uniqueRegistryId) &&
			this.message === input.message &&
			this.createdAt === input.createdAt
		);
	}

	dereference(): CondominiumRequest {
		return new CondominiumRequest({
			userId: this.userId.value,
			condominiumId: this.condominiumId.value,
			uniqueRegistryId: this.uniqueRegistryId.value,
			message: this.message,
			createdAt: this.createdAt,
		});
	}

	get condominiumId() {
		return this.props.condominiumId;
	}
	get userId() {
		return this.props.userId;
	}
	get uniqueRegistryId() {
		return this.props.uniqueRegistryId;
	}
	get createdAt() {
		return this.props.createdAt;
	}
	get message(): string | undefined | null {
		return this.props.message;
	}
}
