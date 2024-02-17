import { Key } from '@app/entities/key';

export enum KeysEnum {
	ACCESS_TOKEN_KEY = 'ACCESS_TOKEN_KEY',
	REFRESH_TOKEN_KEY = 'REFRESH_TOKEN_KEY',
	INVITE_TOKEN_KEY = 'INVITE_TOKEN_KEY',
	INVITE_ADMIN_TOKEN_KEY = 'INVITE_ADMIN_TOKEN_KEY',
	INVITE_SUPER_ADMIN_TOKEN_KEY = 'INVITE_SUPER_ADMIN_TOKEN_KEY',
	TFA_TOKEN_KEY = 'TFA_TOKEN_KEY',
}

export abstract class KeyRepo {
	abstract getSignature(name: KeysEnum): Promise<Key>;
}

export abstract class KeyCache {
	abstract set(key: Key): Promise<void>;
	abstract get(name: KeysEnum): Promise<Key | undefined>;
	abstract delete(name: KeysEnum): Promise<void>;
}
