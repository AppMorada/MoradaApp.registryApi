import { randomUUID } from 'crypto';
import { Code } from '../VO/code';
import { TReplace } from '@utils/replace';

interface IOTPProps {
	userId?: string;
	requiredLevel?: number;
	condominiumId: string;
	code: Code;
	ttl: number;
	createdAt: Date;
}

export type TInputOTPProps = TReplace<
	TReplace<IOTPProps, { createdAt?: Date }>,
	{ ttl?: number }
>;

export class OTP {
	private readonly _id: string;
	private readonly props: IOTPProps;

	constructor(input: TInputOTPProps, id?: string) {
		this._id = id ?? randomUUID();
		this.props = {
			...input,
			ttl: input.ttl ?? 1000 * 60 * 2,
			createdAt: input.createdAt ?? new Date(),
		};
	}

	public equalTo(input: OTP) {
		return (
			this._id === input._id &&
			this.requiredLevel === input.requiredLevel &&
			this.props.ttl === input.ttl &&
			this.props.condominiumId === input.condominiumId &&
			this.props.userId === input.userId &&
			this.props.code.equalTo(input.code) &&
			this.props.createdAt === input.createdAt
		);
	}

	get requiredLevel(): number | undefined {
		return this.props.requiredLevel;
	}

	get condominiumId(): string {
		return this.props.condominiumId;
	}

	get userId(): string | undefined {
		return this.props.userId;
	}

	get ttl(): number {
		return this.props.ttl;
	}

	get id(): string {
		return this._id;
	}

	get code(): Code {
		return this.props.code;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}
}
