import { InMemoryUser } from '.';
import { InMemoryError } from '@tests/errors/inMemoryError';
import { userFactory } from '@tests/factories/user';

describe('InMemoryData test: User', () => {
	let sut: InMemoryUser;

	beforeEach(() => (sut = new InMemoryUser()));

	it('should be able to create one user', async () => {
		const user = userFactory();
		expect(sut.create({ user })).resolves;
	});

	it('should be able to create one user', async () => {
		const user = userFactory();
		expect(sut.create({ user })).resolves;
		expect(() => sut.create({ user })).toThrowError(InMemoryError);
	});
});
