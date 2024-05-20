import { UniqueRegistryMapper } from '@app/mapper/uniqueRegistry';
import { DeleteMemberPublisher } from '@app/publishers/deleteMember';
import { PubSubModule } from '@infra/events/pubsub/pubsub.module';
import { TestingModule, Test } from '@nestjs/testing';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('Delete member google publisher test', () => {
	let app: TestingModule;
	let sut: DeleteMemberPublisher;

	beforeAll(async () => {
		app = await Test.createTestingModule({
			imports: [PubSubModule],
		}).compile();

		sut = app.get(DeleteMemberPublisher);
	});

	afterAll(async () => {
		await app.close();
	});

	it('should be able to publish a delete member event', async () => {
		const uniqueRegistry = uniqueRegistryFactory();

		expect(
			sut.publish({
				uniqueRegistry: UniqueRegistryMapper.toObject(uniqueRegistry),
				deletedAt: new Date(),
			}),
		).resolves;
	});
});
