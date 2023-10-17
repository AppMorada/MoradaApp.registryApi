import { createHmac } from 'crypto';
import { CryptAdapter, ICryptCompare, ICryptHmac } from '../crypt';
import * as bcrypt from 'bcrypt';

export class BcryptAdapter extends CryptAdapter {
	private genHmacData = (input: ICryptHmac): Promise<string> =>
		new Promise((resolve, reject) => {
			const hmac = createHmac('sha256', input.key);
			hmac.update(input.data);

			try {
				const hash = hmac.digest('hex');
				resolve(hash);
			} catch (err) {
				reject(err);
			}
		});

	async hashWithHmac(input: ICryptHmac): Promise<string> {
		const hash = await this.genHmacData(input);
		return hash;
	}

	async hash(data: string): Promise<string> {
		return await bcrypt.hash(data, 10);
	}

	async compare(input: ICryptCompare): Promise<boolean> {
		return await bcrypt.compare(input.data, input.hashedData);
	}
}
