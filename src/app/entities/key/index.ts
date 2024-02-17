import { TReplace } from '@utils/replace';
import { randomUUID } from 'node:crypto';
import { Entity } from '../entities';

interface INode {
	content: string;
	buildedAt: number;
}

export interface IKeyProps {
	id: string;
	name: string;
	prev?: INode;
	actual: INode;
	ttl: number;
	renewTime: number;
}

type TInput = TReplace<
	TReplace<IKeyProps, { id?: string }>,
	{ renewTime?: number }
>;

export class Key implements Entity {
	private props: IKeyProps;

	constructor(input: TInput) {
		this.props = {
			...input,
			id: input.id ?? randomUUID(),
			renewTime: input.renewTime ?? Date.now() + input.ttl,
		};
	}

	dereference(): Entity {
		return new Key({
			id: this.id,
			name: this.name,
			actual: {
				content: this.actual.content,
				buildedAt: this.actual.buildedAt,
			},
			prev: this.prev
				? {
					content: this.prev.content,
					buildedAt: this.prev.buildedAt,
				}
				: undefined,
			renewTime: this.renewTime,
			ttl: this.ttl,
		});
	}

	equalTo(input: Key): boolean {
		return (
			input instanceof Key &&
			input.actual.content === this.props.actual.content &&
			input.actual.buildedAt === this.props.actual.buildedAt &&
			input.prev?.content === this.props.prev?.content &&
			input.prev?.buildedAt === this.props.prev?.buildedAt &&
			input.renewTime === this.props.renewTime &&
			input.ttl === this.props.ttl &&
			input.name === this.props.name &&
			input.id === this.props.id
		);
	}

	get id() {
		return this.props.id;
	}

	set name(input: string) {
		this.props.name = input;
	}
	get name() {
		return this.props.name;
	}

	set prev(input: INode | undefined) {
		this.props.prev = input ? { ...input } : undefined;
	}
	get prev(): INode | undefined {
		return this.props.prev;
	}

	set actual(input: INode) {
		this.props.actual = { ...input };
	}
	get actual() {
		return this.props.actual;
	}

	set ttl(input: number) {
		this.props.ttl = input;
	}
	get ttl() {
		return this.props.ttl;
	}

	set renewTime(input: number) {
		this.props.renewTime = input;
	}
	get renewTime() {
		return this.props.renewTime;
	}
}
