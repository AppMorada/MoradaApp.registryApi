import { ApartmentNumber, Block, UUID } from '../VO';
import { Entity, ValueObject } from '../entities';

interface IProps {
	memberId: UUID;
	apartmentNumber?: ApartmentNumber | null;
	block?: Block | null;
	updatedAt: Date;
}

export interface ICondominiumInfosInput {
	memberId: string;
	apartmentNumber?: number | null;
	block?: string | null;
	updatedAt?: Date;
}

export class CommunityInfos implements Entity {
	private props: IProps;

	constructor(input: ICondominiumInfosInput) {
		this.props = {
			memberId: new UUID(input.memberId),
			block: ValueObject.build(Block, input.block).allowNullish().exec(),
			apartmentNumber: ValueObject.build(
				ApartmentNumber,
				input.apartmentNumber,
			)
				.allowNullish()
				.exec(),
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
			block: this.block?.value,
			apartmentNumber: this.apartmentNumber?.value,
			updatedAt: this.updatedAt,
		});
	}

	get memberId() {
		return this.props.memberId;
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

	get updatedAt(): Date {
		return this.props.updatedAt;
	}
	set updatedAt(input: Date) {
		this.props.updatedAt = input;
	}
}
