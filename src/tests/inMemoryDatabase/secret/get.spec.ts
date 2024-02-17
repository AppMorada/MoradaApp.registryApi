import { secretFactory } from '@tests/factories/secret';
import { InMemorySecret } from '.';
import { InMemoryContainer } from '../inMemoryContainer';

describe('InMemorySecret get method', () => {
	let container: InMemoryContainer;
	let sut: InMemorySecret;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemorySecret(container);
	});

	it('should be able to get some secret', async () => {
		const secret = secretFactory();
		sut.secrets.push(secret);

		const searchedSecret = await sut.get(secret.key);
		expect(searchedSecret?.equalTo(secret));
		expect(sut.calls.get).toEqual(1);
	});
});
