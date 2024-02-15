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
	abstract watchSignatures(): Promise<void>;
	abstract getSignature(name: KeysEnum): Promise<Key>;
}
