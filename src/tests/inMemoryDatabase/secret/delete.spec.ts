import { secretFactory } from '@tests/factories/secret';
import { InMemorySecret } from '.';
import { InMemoryContainer } from '../inMemoryContainer';

describe('InMemorySecret delete method', () => {
	let container: InMemoryContainer;
	let sut: InMemorySecret;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemorySecret(container);
	});

	it('should be able to delete some secret', async () => {
		const secret = secretFactory();
		sut.secrets.push(secret);

		expect(sut.delete(secret.key)).resolves;
		expect(sut.secrets[0]).toBeUndefined();
		expect(sut.calls.delete).toEqual(1);
	});
});
