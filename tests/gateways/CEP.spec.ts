import { CepGatewaySpy } from './CEP.gateway';

describe('CEP Gateway test', () => {
	let sut: CepGatewaySpy;

	beforeEach(() => (sut = new CepGatewaySpy()));

	it('should be able to check CEP on external service', () => {
		expect(Boolean(sut.check())).toBeTruthy();
		expect(sut.calls.check).toEqual(1);
	});
});
