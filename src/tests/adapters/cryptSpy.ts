import { CryptAdapter, ICryptCompare } from '@app/adapters/crypt';

export class CryptSpy implements CryptAdapter {
	calls = {
		hashWithHmac: 0,
		hash: 0,
		compare: 0,
	};

	async hashWithHmac(): Promise<string> {
		++this.calls.hashWithHmac;
		return 'e187f1f266a145c2f8649b2324d0bb54a7cf62e3c9abfce5a7f2ff8bbbd59d44b';
	}

	async hash(data: string): Promise<string> {
		++this.calls.hash;
		return data;
	}

	async compare(input: ICryptCompare): Promise<boolean> {
		++this.calls.compare;
		return input.data === input.hashedData;
	}
}
