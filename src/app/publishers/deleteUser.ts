import { UniqueRegistry } from '@app/entities/uniqueRegistry';
import { User } from '@app/entities/user';

export interface IDeleteUserProps {
	user: User;
	uniqueRegistry: UniqueRegistry;
	deletedAt: Date;
}

export abstract class DeleteUserPublisher {
	abstract publish(input: IDeleteUserProps): Promise<void>;
}
