export interface IEnvMetadata {
	name: string;
	isOptional: boolean;
}

type TEnv = Record<string, IEnvMetadata>;

export const environmentVariablesMetadata: TEnv = {
	LOG_TYPE: {
		name: 'LOG_TYPE',
		isOptional: true,
	},
	SIGNATURE_TYPE: {
		name: 'SIGNATURE_TYPE',
		isOptional: true,
	},
	PORT: {
		name: 'PORT',
		isOptional: true,
	},
	NODE_ENV: {
		name: 'NODE_ENV',
		isOptional: false,
	},
	PROJECT_NAME: {
		name: 'PROJECT_NAME',
		isOptional: false,
	},
	DATABASE_URL: {
		name: 'DATABASE_URL',
		isOptional: false,
	},
	REDIS_URL: {
		name: 'REDIS_URL',
		isOptional: false,
	},
	FRONT_END_INVITE_URL: {
		name: 'FRONT_END_INVITE_URL',
		isOptional: false,
	},
	FRONT_END_AUTH_URL: {
		name: 'FRONT_END_AUTH_URL',
		isOptional: false,
	},
	COOKIE_KEY: {
		name: 'COOKIE_KEY',
		isOptional: false,
	},
	HOST_SENDER: {
		name: 'HOST_SENDER',
		isOptional: false,
	},
	HOST_PORT_SENDER: {
		name: 'HOST_PORT_SENDER',
		isOptional: false,
	},
	NAME_SENDER: {
		name: 'NAME_SENDER',
		isOptional: false,
	},
	NOT_SEND_EMAILS: {
		name: 'NOT_SEND_EMAILS',
		isOptional: true,
	},
	EMAIL_SENDER: {
		name: 'EMAIL_SENDER',
		isOptional: false,
	},
	PASS_SENDER: {
		name: 'PASS_SENDER',
		isOptional: false,
	},
	GCP_PROJECT: {
		name: 'GCP_PROJECT',
		isOptional: false,
	},
	FIRESTORE_EMULATOR_HOST: {
		name: 'FIRESTORE_EMULATOR_HOST',
		isOptional: true,
	},
	MAX_MEMORY_HEAP: {
		name: 'MAX_MEMORY_HEAP',
		isOptional: false,
	},
	MAX_MEMORY_RSS: {
		name: 'MAX_MEMORY_RSS',
		isOptional: false,
	},
	CREATE_KEY_FUNC_URL: {
		name: 'CREATE_KEY_FUNC_URL',
		isOptional: true,
	},
	UPDATE_KEY_FUNC_URL: {
		name: 'UPDATE_KEY_FUNC_URL',
		isOptional: true,
	},
	DELETE_KEY_FUNC_URL: {
		name: 'DELETE_KEY_FUNC_URL',
		isOptional: true,
	},
};
