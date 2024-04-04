import { Condominium } from '@app/entities/condominium';
import { CondominiumRequest } from '@app/entities/condominiumRequest';
import { ValueObject } from '@app/entities/entities';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';
import { User } from '@app/entities/user';
import { CondominiumRequestMapper } from '@app/mapper/condominiumRequest';
import {
	CondominiumRequestRepoReadOps,
	CondominiumRequestRepoReadOpsInterfaces,
} from '@app/repositories/condominiumRequest/read';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';

export class InMemoryCondominiumRequestReadOps
implements CondominiumRequestRepoReadOps
{
	condominiumRequests: CondominiumRequest[];
	users: User[];
	uniqueRegistries: UniqueRegistry[];
	condominium: Condominium[];

	calls = {
		findByUserId: 0,
		findByCondominiumId: 0,
	};

	constructor(container: InMemoryContainer) {
		this.condominiumRequests = container.props.condominiumRequestArr;
		this.users = container.props.userArr;
		this.uniqueRegistries = container.props.uniqueRegistryArr;
		this.condominium = container.props.condominiumArr;
	}

	async findByUserId(input: CondominiumRequestRepoReadOpsInterfaces.search) {
		++this.calls.findByUserId;

		const condominiumRequest = this.condominiumRequests.filter((item) =>
			item.userId.equalTo(input.id),
		);
		const user = this.users.find((item) => item.id.equalTo(input.id));
		const uniqueRegistry = this.uniqueRegistries.find((item) =>
			ValueObject.compare(item.id, user?.uniqueRegistryId),
		);
		return user && uniqueRegistry && condominiumRequest
			? {
				name: user.name.value,
				email: uniqueRegistry.email.value,
				requests: condominiumRequest.map((item) =>
					CondominiumRequestMapper.toObject(item),
				),
			}
			: undefined;
	}

	async findByCondominiumId(
		input: CondominiumRequestRepoReadOpsInterfaces.search,
	) {
		++this.calls.findByCondominiumId;

		const condominiumRequests = this.condominiumRequests.filter((item) =>
			item.condominiumId.equalTo(input.id),
		);
		const returnableContent: CondominiumRequestRepoReadOpsInterfaces.findByCondominiumIdResult[] =
			[];

		for (const request of condominiumRequests) {
			const user = this.users.find((item) =>
				item.id.equalTo(request.userId),
			);
			const uniqueRegistry = this.uniqueRegistries.find((item) =>
				ValueObject.compare(item.id, user?.uniqueRegistryId),
			);

			if (user && uniqueRegistry) {
				const parsedRequest =
					CondominiumRequestMapper.toObject(request);
				returnableContent.push({
					request: parsedRequest,
					email: uniqueRegistry.email.value,
					name: user.name.value,
				});
			}
		}

		return returnableContent;
	}
}
