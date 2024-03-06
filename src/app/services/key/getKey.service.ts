import { Injectable } from '@nestjs/common';
import { IService } from '../_IService';
import { KeyRepo, KeysEnum } from '@app/repositories/key';

interface IProps {
	name: KeysEnum;
}

@Injectable()
export class GetKeyService implements IService {
	constructor(private readonly keyRepo: KeyRepo) {}

	async exec(input: IProps) {
		const key = await this.keyRepo.getSignature(input.name);
		return { key };
	}
}
