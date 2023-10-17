import { CryptAdapter, ICryptCompare } from '@app/adapters/crypt';

export class CryptMock implements CryptAdapter {
	async hash(data: string): Promise<string> {
		return data;
	}

	async compare(input: ICryptCompare): Promise<boolean> {
		return input.data === input.hashedData;
	}
}
