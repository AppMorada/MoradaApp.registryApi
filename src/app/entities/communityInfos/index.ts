import { ApartmentNumber, Block, UUID } from '../VO';
import { Entity, ValueObject } from '../entities';

interface IProps {
	memberId: UUID;
	apartmentNumber: ApartmentNumber;
	block: Block;
	updatedAt: Date;
}

export interface ICondominiumInfosInput {
	memberId: string;
	apartmentNumber: number;
	block: string;
	updatedAt?: Date;
}

export class CommunityInfos implements Entity {
	private props: IProps;

	constructor(input: ICondominiumInfosInput) {
		this.props = {
			memberId: new UUID(input.memberId),
			block: new Block(input.block),
			apartmentNumber: new ApartmentNumber(input.apartmentNumber),
			updatedAt: input.updatedAt ?? new Date(),
		};
	}

	equalTo(input: CommunityInfos): boolean {
		return (
			input instanceof CommunityInfos &&
			input.updatedAt === this.updatedAt &&
			ValueObject.compare(this.block, input.block) &&
			ValueObject.compare(this.apartmentNumber, input.apartmentNumber) &&
			ValueObject.compare(this.memberId, input.memberId)
		);
	}

	dereference(): CommunityInfos {
		return new CommunityInfos({
			memberId: this.memberId.value,
			block: this.block.value,
			apartmentNumber: this.apartmentNumber.value,
			updatedAt: this.updatedAt,
		});
	}

	get memberId() {
		return this.props.memberId;
	}

	get apartmentNumber(): ApartmentNumber {
		return this.props.apartmentNumber;
	}
	set apartmentNumber(input: ApartmentNumber) {
		this.props.apartmentNumber = input;
	}

	get block(): Block {
		return this.props.block;
	}
	set block(input: Block) {
		this.props.block = input;
	}

	get updatedAt(): Date {
		return this.props.updatedAt;
	}
	set updatedAt(input: Date) {
		this.props.updatedAt = input;
	}
}
