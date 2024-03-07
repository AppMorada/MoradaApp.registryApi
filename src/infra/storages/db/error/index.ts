export enum DatabaseCustomErrorsTags {
	unauthorized = 'Unauthorized',
	tooManyEntities = 'Too many entities',
	alreadyRegisteredCondominiumRelUser = 'CondominiumRelUser already registered',
	wrongInputLevel = 'Wrong input level detected',
	contentAlreadyExists = 'This content already exists',
	contentDoesntExists = 'This content doesn\'t exists',
	safeSearchEnabled = 'Safe search detected',
	dtoFailure = 'The DTO found an error',
	refLost = 'The reference could not be found',
	malformedRef = 'Malformed reference',
}

interface IProps {
	message: string;
	tag: DatabaseCustomErrorsTags;
}

export class DatabaseCustomError extends Error {
	readonly tag: DatabaseCustomErrorsTags;

	constructor(input: IProps) {
		super();

		this.name = 'Database Custom Error';
		this.tag = input.tag;
		this.message = input.message;
	}
}
