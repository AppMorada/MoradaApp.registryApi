import { secretFactory } from '@tests/factories/secret';
import { InMemorySecret } from '.';
import { InMemoryContainer } from '../inMemoryContainer';

describe('InMemorySecret add method', () => {
	let container: InMemoryContainer;
	let sut: InMemorySecret;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemorySecret(container);
	});

	it('should be able to add a new secret', async () => {
		const secret = secretFactory();

		expect(sut.add(secret)).resolves;
		expect(sut.calls.add).toEqual(1);
	});

	it('should be able to update a secret', async () => {
		const secret = secretFactory();

		expect(sut.add(secret)).resolves;

		const newSecret = secretFactory({
			value: 'new value',
		});

		expect(sut.add(newSecret)).resolves;
		expect(sut.secrets[0].equalTo(secret)).toEqual(false);

		expect(sut.calls.add).toEqual(2);
	});
});
