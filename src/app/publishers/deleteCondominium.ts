import { Condominium } from '@app/entities/condominium';

export interface IDeleteCondominiumProps {
	condominium: Condominium;
	deletedAt: Date;
}

export abstract class DeleteCondominiumPublisher {
	abstract publish(input: IDeleteCondominiumProps): Promise<void>;
}
