export enum FirestoreCustomErrorTag {
	createEntity = '__create_entity_err__',
	malformedEntity = '__malformed_entity_err__',
	entityDoesntExist = '__entity_does_not_exists__',
}

interface IProps {
	message: string;
	tag: FirestoreCustomErrorTag;
	cause: string;
}

export class FirestoreCustomError extends Error {
	readonly cause: string;
	readonly tag: FirestoreCustomErrorTag;

	constructor(input: IProps) {
		super();

		this.name = 'Firestore Custom Error';
		this.message = input.message;
		this.cause = input.cause;
		this.tag = input.tag;
	}
}
