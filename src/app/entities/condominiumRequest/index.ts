import { UUID } from '../VO';
import { Entity } from '../entities';

interface IProps {
	userId: UUID;
	condominiumId: UUID;
	createdAt: Date;
}

export interface ICondominiumRequestEntityPropsInput {
	userId: string;
	condominiumId: string;
	createdAt?: Date;
}

export class CondominiumRequest implements Entity {
	private props: IProps;

	constructor(input: ICondominiumRequestEntityPropsInput) {
		this.props = {
			userId: new UUID(input.userId),
			condominiumId: new UUID(input.condominiumId),
			createdAt: input.createdAt ?? new Date(),
		};
	}

	equalTo(input: CondominiumRequest): boolean {
		return (
			this instanceof CondominiumRequest &&
			this.condominiumId.equalTo(input.condominiumId) &&
			this.userId.equalTo(input.userId) &&
			this.createdAt === input.createdAt
		);
	}

	dereference(): CondominiumRequest {
		return new CondominiumRequest({
			userId: this.userId.value,
			condominiumId: this.condominiumId.value,
			createdAt: this.createdAt,
		});
	}

	get condominiumId() {
		return this.props.condominiumId;
	}
	get userId() {
		return this.props.userId;
	}
	get createdAt() {
		return this.props.createdAt;
	}
}
