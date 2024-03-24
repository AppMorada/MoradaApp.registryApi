import { IService } from '@app/services/_IService';
import { Injectable } from '@nestjs/common';
import { ConfigError } from '../error';
import { environmentVariablesMetadata } from './definitions';
import { LayersEnum, LoggerAdapter } from '@app/adapters/logger';
import { fatalErrorHandler } from '@utils/fatalErrorHandler';

export enum EnvEnum {
	ZIPKIN_TRACE_URL = 'ZIPKIN_TRACE_URL',
	SERVICE_NAME = 'SERVICE_NAME',
	SERVICE_VERSION = 'SERVICE_VERSION',
	OBSERVER_AGENT = 'OBSERVER_AGENT',
	INVITE_COMPLEXITY_CODE = 'INVITE_COMPLEXITY_CODE',
	LOG_TYPE = 'LOG_TYPE',
	SIGNATURE_TYPE = 'SIGNATURE_TYPE',
	PORT = 'PORT',
	NODE_ENV = 'NODE_ENV',
	PROJECT_NAME = 'PROJECT_NAME',
	DATABASE_URL = 'DATABASE_URL',
	FRONT_END_INVITE_URL = 'FRONT_END_INVITE_URL',
	FRONT_END_AUTH_URL = 'FRONT_END_AUTH_URL',
	COOKIE_KEY = 'COOKIE_KEY',
	NOT_SEND_EMAILS = 'NOT_SEND_EMAILS',
	HOST_SENDER = 'HOST_SENDER',
	HOST_PORT_SENDER = 'HOST_PORT_SENDER',
	NAME_SENDER = 'NAME_SENDER',
	EMAIL_SENDER = 'EMAIL_SENDER',
	PASS_SENDER = 'PASS_SENDER',
	GCP_PROJECT = 'GCP_PROJECT',
	FIRESTORE_EMULATOR_HOST = 'FIRESTORE_EMULATOR_HOST',
	MAX_MEMORY_HEAP = 'MAX_MEMORY_HEAP',
	MAX_MEMORY_RSS = 'MAX_MEMORY_RSS',
	CREATE_KEY_FUNC_URL = 'CREATE_KEY_FUNC_URL',
	UPDATE_KEY_FUNC_URL = 'UPDATE_KEY_FUNC_URL',
	DELETE_KEY_FUNC_URL = 'DELETE_KEY_FUNC_URL',
}

@Injectable()
export class GetEnvService implements IService {
	constructor(private readonly logger: LoggerAdapter) {
		for (const key in environmentVariablesMetadata) {
			const metadata = environmentVariablesMetadata[key];
			const localEnv = process.env?.[metadata.name];
			if (localEnv) continue;

			if (!metadata.isOptional && !localEnv) {
				const errMsg = `"${key}" ou seus metadados não foram encontrados`;
				const err = new ConfigError(errMsg);
				this.logger.fatal({
					name: 'Environment variables',
					layer: LayersEnum.config,
					description: errMsg,
					stack: err.stack,
				});
				fatalErrorHandler();

				throw err;
			}
		}
	}

	async exec(input: { env: EnvEnum }): Promise<{ env?: string }> {
		const localEnv = process.env[input.env.toString()] as string;
		return { env: localEnv };
	}
}
