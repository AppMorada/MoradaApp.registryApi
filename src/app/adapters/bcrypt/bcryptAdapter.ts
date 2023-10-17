import { CryptAdapter, ICryptCompare } from '../crypt';
import * as bcrypt from 'bcrypt';

export class BcryptAdapter extends CryptAdapter {
	async hash(data: string): Promise<string> {
		return await bcrypt.hash(data, 10);
	}

	async compare(input: ICryptCompare): Promise<boolean> {
		return await bcrypt.compare(input.data, input.hashedData);
	}
}
