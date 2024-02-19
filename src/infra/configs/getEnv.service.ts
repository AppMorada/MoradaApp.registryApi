import { IService } from '@app/services/_IService';
import { Injectable } from '@nestjs/common';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { ConfigError } from './error';
import { IEnvMetadata, environmentVariablesMetadata } from './envDefinitions';
import { LayersEnum, LoggerAdapter } from '@app/adapters/logger';
import { SecretRepo } from '@app/repositories/secret';
import { Secret } from '@app/entities/secret';

export enum EnvEnum {
	SIGNATURE_TYPE = 'SIGNATURE_TYPE',
	PORT = 'PORT',
	NODE_ENV = 'NODE_ENV',
	PROJECT_NAME = 'PROJECT_NAME',
	DATABASE_URL = 'DATABASE_URL',
	REDIS_URL = 'REDIS_URL',
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
	constructor(
		private readonly logger: LoggerAdapter,
		private readonly secretRepo: SecretRepo,
	) {
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
				process.kill(process.pid, 'SIGTERM');

				throw err;
			}
		}
	}

	private async handleWithSecretManager(input: EnvEnum, url: string) {
		const remoteEnv = await this.secretRepo.get(input.toString());
		if (remoteEnv) return { env: remoteEnv.value };

		const client = new SecretManagerServiceClient();

		const secrets = await client.accessSecretVersion({ name: url });
		const data = secrets[0]?.payload?.data;

		if (!data) {
			const err = new ConfigError(
				`${input.toString} não esta presente no Secret Manager`,
			);
			this.logger.fatal({
				name: 'Environment variables',
				layer: LayersEnum.config,
				description: `${input.toString} não esta presente no Secret Manager`,
				stack: err.stack,
			});

			process.kill(process.pid, 'SIGTERM');

			throw err;
		}

		const dataAsString = Buffer.from(data).toString();

		const secret = new Secret({
			key: input.toString(),
			value: dataAsString,
		});
		await this.secretRepo.add(secret);

		return { env: dataAsString };
	}

	private getMetadata(env: EnvEnum) {
		let metadata: IEnvMetadata | undefined;
		for (const key in environmentVariablesMetadata) {
			if (environmentVariablesMetadata[key].name === env.toString()) {
				metadata = environmentVariablesMetadata[key];
				break;
			}
		}

		return metadata;
	}

	async exec(input: { env: EnvEnum }): Promise<{ env?: string }> {
		const metadata = this.getMetadata(input.env);
		const localEnv = process.env[input.env.toString()] as string;

		if (
			process.env.NODE_ENV === 'production' &&
			metadata!.scope === 'SECRET_MANAGER'
		)
			return await this.handleWithSecretManager(input.env, localEnv);

		return { env: localEnv };
	}
}
