import { TReplace } from '@utils/replace';
import { randomUUID } from 'node:crypto';

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

export class Key {
	private props: IKeyProps;

	constructor(input: TInput) {
		this.props = {
			...input,
			id: input.id ?? randomUUID(),
			renewTime: input.renewTime ?? Date.now() + input.ttl,
		};
	}

	equalTo({
		key,
		ignoreRenewTime = false,
	}: {
		key: Key;
		ignoreRenewTime?: boolean;
	}): boolean {
		return (
			(key instanceof Key &&
				key.actual.content === this.props.actual.content &&
				key.actual.buildedAt === this.props.actual.buildedAt &&
				key.prev?.content === this.props.prev?.content &&
				key.prev?.buildedAt === this.props.prev?.buildedAt &&
				!ignoreRenewTime &&
				key.renewTime === this.props.renewTime) ||
			(ignoreRenewTime &&
				key.name === this.props.name &&
				key.id === this.props.id)
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
