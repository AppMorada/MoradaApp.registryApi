import { CryptAdapter, ICryptCompare } from '@app/adapters/crypt';

export class CryptMock implements CryptAdapter {
	async hashWithHmac(): Promise<string> {
		return 'e187f1f266a145c2f8649b2324d0bb54a7cf62e3c9abfce5a7f2ff8bbbd59d44b';
	}

	async hash(data: string): Promise<string> {
		return data;
	}

	async compare(input: ICryptCompare): Promise<boolean> {
		return input.data === input.hashedData;
	}
}
