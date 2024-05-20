import { DeleteUserPublisher } from '@app/publishers/deleteUser';
import { PubSubModule } from '@infra/events/pubsub/pubsub.module';
import { TestingModule, Test } from '@nestjs/testing';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { userFactory } from '@tests/factories/user';
import { ConfigModule } from '@infra/configs/config.module';
import { AdaptersModule } from '@app/adapters/adapter.module';

describe('Delete user google publisher test', () => {
	let app: TestingModule;
	let sut: DeleteUserPublisher;

	beforeAll(async () => {
		app = await Test.createTestingModule({
			imports: [PubSubModule, ConfigModule, AdaptersModule],
		}).compile();

		sut = app.get(DeleteUserPublisher);
	});

	afterAll(async () => {
		await app.close();
	});

	it('should be able to publish a delete user event', async () => {
		const user = userFactory();
		const uniqueRegistry = uniqueRegistryFactory();

		expect(
			sut.publish({
				uniqueRegistry,
				user,
				deletedAt: new Date(),
			}),
		).resolves;
	});
});
