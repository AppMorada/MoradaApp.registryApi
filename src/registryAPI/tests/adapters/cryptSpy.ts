import { CryptAdapter, ICryptCompare } from '@registry:app/adapters/crypt';

export class CryptSpy implements CryptAdapter {
	calls = {
		hashWithHmac: 0,
		hash: 0,
		compare: 0,
	};

	async hashWithHmac(): Promise<string> {
		this.calls.hashWithHmac = this.calls.hashWithHmac + 1;
		return 'e187f1f266a145c2f8649b2324d0bb54a7cf62e3c9abfce5a7f2ff8bbbd59d44b';
	}

	async hash(data: string): Promise<string> {
		this.calls.hash = this.calls.hash + 1;
		return data;
	}

	async compare(input: ICryptCompare): Promise<boolean> {
		this.calls.compare = this.calls.compare + 1;
		return input.data === input.hashedData;
	}
}
