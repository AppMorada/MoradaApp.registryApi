import { keyFactory } from '@tests/factories/key';
import { InMemoryKey } from '.';
import { InMemoryContainer } from '../inMemoryContainer';
import { InMemoryError } from '@tests/errors/inMemoryError';
import { EntitiesEnum } from '@app/entities/entities';

describe('InMemoryKeyRepo create method test', () => {
	let sut: InMemoryKey;
	let container: InMemoryContainer;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryKey(container);
	});

	it('should be able to create a key', async () => {
		const key = keyFactory();
		expect(sut.create(key)).resolves;
		expect(sut.calls.create).toEqual(1);
	});

	it('should throw one error - key already exist', async () => {
		const key = keyFactory();
		await sut.create(key);

		expect(sut.create(key)).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.key,
				message: 'This entity already exist',
			}),
		);
	});
});
