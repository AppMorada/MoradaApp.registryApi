import { UUID } from '@app/entities/VO';
import { UserWriteOps } from '@app/repositories/user/write';
import { Injectable } from '@nestjs/common';
import { IService } from '../_IService';

interface IProps {
	id: string;
}

@Injectable()
export class DeleteUserService implements IService {
	constructor(private readonly userRepoDelete: UserWriteOps.Delete) {}

	async exec({ id }: IProps) {
		await this.userRepoDelete.exec({ key: new UUID(id) });
	}
}
