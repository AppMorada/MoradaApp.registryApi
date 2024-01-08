import { randomUUID } from 'crypto';
import { Code, Level } from '../VO';
import { Entity } from '../entities';

interface IOTPProps {
	userId?: string;
	requiredLevel: Level;
	condominiumId: string;
	code: Code;
	ttl: number;
	createdAt: Date;
}

export type TInputOTPProps = {
	userId?: string;
	requiredLevel?: Level;
	condominiumId: string;
	code: Code;
	ttl?: number;
	createdAt?: Date;
};

export class OTP implements Entity {
	private readonly _id: string;
	private readonly props: IOTPProps;

	/** @deprecated **/
	constructor(input: TInputOTPProps, id?: string) {
		this._id = id ?? randomUUID();
		this.props = {
			...input,
			requiredLevel: input.requiredLevel ?? new Level(0),
			ttl: input.ttl ?? 1000 * 60 * 2,
			createdAt: input.createdAt ?? new Date(),
		};
	}

	dereference(): OTP {
		return new OTP(
			{
				userId: this.userId,
				requiredLevel: new Level(this.requiredLevel.value),
				condominiumId: this.condominiumId,
				code: new Code(this.code.value),
				ttl: this.ttl,
				createdAt: this.createdAt,
			},
			this.id,
		);
	}
	public equalTo(input: OTP) {
		return (
			this._id === input._id &&
			this.requiredLevel.equalTo(input.requiredLevel) &&
			this.props.ttl === input.ttl &&
			this.props.condominiumId === input.condominiumId &&
			this.props.userId === input.userId &&
			this.props.code.equalTo(input.code) &&
			this.props.createdAt === input.createdAt
		);
	}

	get requiredLevel(): Level {
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
