import { Injectable } from '@nestjs/common';
import { IService } from '../_IService';
import { UserRepoWriteOps } from '@app/repositories/user/write';
import { Name, PhoneNumber, UUID } from '@app/entities/VO';

interface IProps {
	id: string;
	phoneNumber?: string;
	name?: string;
}

@Injectable()
export class UpdateUserService implements IService {
	constructor(private readonly userRepo: UserRepoWriteOps) {}

	async exec(input: IProps) {
		const name = input.name ? new Name(input.name) : undefined;
		const phoneNumber = input.phoneNumber
			? new PhoneNumber(input.phoneNumber)
			: undefined;

		const returnableContent = {
			requestedModifications: {
				name,
				phoneNumber,
			},
		};

		if (!name && !phoneNumber) return returnableContent;

		await this.userRepo.update({
			id: new UUID(input.id),
			name,
			phoneNumber,
		});

		return returnableContent;
	}
}
