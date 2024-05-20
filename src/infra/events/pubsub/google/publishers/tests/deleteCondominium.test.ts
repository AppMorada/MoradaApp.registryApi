import { AdaptersModule } from '@app/adapters/adapter.module';
import { DeleteCondominiumPublisher } from '@app/publishers/deleteCondominium';
import { ConfigModule } from '@infra/configs/config.module';
import { PubSubModule } from '@infra/events/pubsub/pubsub.module';
import { TestingModule, Test } from '@nestjs/testing';
import { condominiumFactory } from '@tests/factories/condominium';

describe('Delete condominium google publisher test', () => {
	let app: TestingModule;
	let sut: DeleteCondominiumPublisher;

	beforeAll(async () => {
		app = await Test.createTestingModule({
			imports: [PubSubModule, ConfigModule, AdaptersModule],
		}).compile();

		sut = app.get(DeleteCondominiumPublisher);
	});

	afterAll(async () => {
		await app.close();
	});

	it('should be able to publish a delete condominium event', async () => {
		const condominium = condominiumFactory();

		expect(
			sut.publish({
				condominium,
				deletedAt: new Date(),
			}),
		).resolves;
	});
});
