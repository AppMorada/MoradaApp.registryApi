import { condominiumFactory } from '@tests/factories/condominium';
import { InMemoryCondominiumRemove } from '@tests/inMemoryDatabase/condominium/write/remove';
import { DeleteCondominiumService } from '@app/services/condominium/delete.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('Delete condominium service test', () => {
	let sut: DeleteCondominiumService;
	let removeCondominiumRepo: InMemoryCondominiumRemove;
	let eventEmitter: EventEmitter2;

	beforeEach(() => {
		removeCondominiumRepo = new InMemoryCondominiumRemove();
		eventEmitter = new EventEmitter2();
		sut = new DeleteCondominiumService(removeCondominiumRepo, eventEmitter);
	});

	it('should be able to delete a condominium', async () => {
		const condominium = condominiumFactory();

		EventEmitter2.prototype.emit = jest.fn(() => true);

		await sut.exec({ condominium });

		expect(removeCondominiumRepo.calls.exec).toEqual(1);
	});
});
