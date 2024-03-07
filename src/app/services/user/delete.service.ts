import { UUID } from '@app/entities/VO';
import { UserRepo } from '@app/repositories/user';
import { Injectable } from '@nestjs/common';
import { IService } from '../_IService';

interface IProps {
	id: string;
}

@Injectable()
export class DeleteUserService implements IService {
	constructor(private readonly userRepo: UserRepo) {}

	async exec({ id }: IProps) {
		await this.userRepo.delete({ key: new UUID(id) });
	}
}
