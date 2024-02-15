import { InMemoryKey } from '.';
import { InMemoryContainer } from '../inMemoryContainer';

describe('InMemoryKeyRepo watchSignatures method test', () => {
	let sut: InMemoryKey;
	let container: InMemoryContainer;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryKey(container);
	});

	it('should be able to watch signatures', async () => {
		await sut.watchSignatures();
		expect(sut.calls.watchSignatures).toEqual(1);
	});
});
