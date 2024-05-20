import { IUniqueRegistryInObject } from '@app/mapper/uniqueRegistry';

export interface IDeleteMemberProps {
	uniqueRegistry: IUniqueRegistryInObject;
	deletedAt: Date;
}

export abstract class DeleteMemberPublisher {
	abstract publish(input: IDeleteMemberProps): Promise<void>;
}
