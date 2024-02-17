import { Secret } from '@app/entities/secret';

export abstract class SecretRepo {
	abstract get(key: string): Promise<Secret | undefined>;
	abstract add(input: Secret): Promise<void>;
	abstract delete(key: string): Promise<void>;
}
