import { Code, UUID } from '../VO';
import { Entity, ValueObject } from '../entities';

interface IOTPProps {
	userId: UUID;
	code: Code;
	ttl: number;
	createdAt: Date;
}

export type TInputOTPProps = {
	userId: string;
	code: string;
	ttl: number;
	createdAt?: Date;
};

export class OTP implements Entity {
	private readonly _id: UUID;
	private readonly props: IOTPProps;

	constructor(input: TInputOTPProps, id?: string) {
		this._id = ValueObject.build(UUID, id).or(UUID.genV4()).exec();
		this.props = {
			...input,
			code: new Code(input.code),
			userId: new UUID(input.userId),
			ttl: input.ttl ?? 1000 * 60 * 2,
			createdAt: input.createdAt ?? new Date(),
		};
	}

	dereference(): OTP {
		return new OTP(
			{
				userId: this.userId.value,
				code: this.code.value,
				ttl: this.ttl,
				createdAt: this.createdAt,
			},
			this.id.value,
		);
	}
	public equalTo(input: OTP) {
		return (
			this._id.equalTo(input._id) &&
			this.props.ttl === input.ttl &&
			this.props.userId.equalTo(input.userId) &&
			this.props.code.equalTo(input.code) &&
			this.props.createdAt === input.createdAt
		);
	}

	get userId(): UUID {
		return this.props.userId;
	}

	get ttl(): number {
		return this.props.ttl;
	}

	get id(): UUID {
		return this._id;
	}

	get code(): Code {
		return this.props.code;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}
}
