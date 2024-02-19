export interface IEnvMetadata {
	name: string;
	scope: 'LOCAL' | 'SECRET_MANAGER';
	isOptional: boolean;
}

type TEnv = Record<string, IEnvMetadata>;

export const environmentVariablesMetadata: TEnv = {
	SIGNATURE_TYPE: {
		name: 'SIGNATURE_TYPE',
		scope: 'LOCAL',
		isOptional: true,
	},
	PORT: {
		name: 'PORT',
		scope: 'LOCAL',
		isOptional: true,
	},
	NODE_ENV: {
		name: 'NODE_ENV',
		scope: 'LOCAL',
		isOptional: false,
	},
	PROJECT_NAME: {
		name: 'PROJECT_NAME',
		scope: 'LOCAL',
		isOptional: false,
	},
	DATABASE_URL: {
		name: 'DATABASE_URL',
		scope: 'SECRET_MANAGER',
		isOptional: false,
	},
	REDIS_URL: {
		name: 'REDIS_URL',
		scope: 'SECRET_MANAGER',
		isOptional: false,
	},
	FRONT_END_INVITE_URL: {
		name: 'FRONT_END_INVITE_URL',
		scope: 'LOCAL',
		isOptional: false,
	},
	FRONT_END_AUTH_URL: {
		name: 'FRONT_END_AUTH_URL',
		scope: 'LOCAL',
		isOptional: false,
	},
	COOKIE_KEY: {
		name: 'COOKIE_KEY',
		scope: 'SECRET_MANAGER',
		isOptional: false,
	},
	HOST_SENDER: {
		name: 'HOST_SENDER',
		scope: 'LOCAL',
		isOptional: false,
	},
	HOST_PORT_SENDER: {
		name: 'HOST_PORT_SENDER',
		scope: 'LOCAL',
		isOptional: false,
	},
	NAME_SENDER: {
		name: 'NAME_SENDER',
		scope: 'LOCAL',
		isOptional: false,
	},
	NOT_SEND_EMAILS: {
		name: 'NOT_SEND_EMAILS',
		scope: 'LOCAL',
		isOptional: true,
	},
	EMAIL_SENDER: {
		name: 'EMAIL_SENDER',
		scope: 'SECRET_MANAGER',
		isOptional: false,
	},
	PASS_SENDER: {
		name: 'PASS_SENDER',
		scope: 'SECRET_MANAGER',
		isOptional: false,
	},
	GCP_PROJECT: {
		name: 'GCP_PROJECT',
		scope: 'LOCAL',
		isOptional: false,
	},
	FIRESTORE_EMULATOR_HOST: {
		name: 'FIRESTORE_EMULATOR_HOST',
		scope: 'LOCAL',
		isOptional: true,
	},
	MAX_MEMORY_HEAP: {
		name: 'MAX_MEMORY_HEAP',
		scope: 'LOCAL',
		isOptional: false,
	},
	MAX_MEMORY_RSS: {
		name: 'MAX_MEMORY_RSS',
		scope: 'LOCAL',
		isOptional: false,
	},
	CREATE_KEY_FUNC_URL: {
		name: 'CREATE_KEY_FUNC_URL',
		scope: 'LOCAL',
		isOptional: true,
	},
	UPDATE_KEY_FUNC_URL: {
		name: 'UPDATE_KEY_FUNC_URL',
		scope: 'LOCAL',
		isOptional: true,
	},
	DELETE_KEY_FUNC_URL: {
		name: 'DELETE_KEY_FUNC_URL',
		scope: 'LOCAL',
		isOptional: true,
	},
};
