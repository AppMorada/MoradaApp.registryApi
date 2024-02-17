import { keyFactory } from '@tests/factories/key';
import { InMemoryKey } from '.';
import { InMemoryContainer } from '../inMemoryContainer';
import { KeysEnum } from '@app/repositories/key';
import { InMemoryError } from '@tests/errors/inMemoryError';
import { EntitiesEnum } from '@app/entities/entities';

describe('InMemoryKeyRepo getSignature method test', () => {
	let sut: InMemoryKey;
	let container: InMemoryContainer;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryKey(container);
	});

	it('should be able to get signature', async () => {
		const name = KeysEnum.ACCESS_TOKEN_KEY;

		const key = keyFactory({ name });

		sut.keys.push({ name: key.name, value: key });

		const searchedKey = await sut.getSignature(name);
		expect(searchedKey.equalTo(key)).toEqual(true);
		expect(sut.calls.getSignature).toEqual(1);
	});

	it('should throw one error - key doesn\'t exist', async () => {
		const name = KeysEnum.ACCESS_TOKEN_KEY;
		expect(sut.getSignature(name)).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.key,
				message: 'This entity doesn\'t exist',
			}),
		);
		expect(sut.calls.getSignature).toEqual(1);
	});
});
