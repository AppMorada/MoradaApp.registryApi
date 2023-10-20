import { CepGatewayMock } from './CEP.gateway';

describe('CEP Gateway test', () => {
	let sut: CepGatewayMock;

	beforeEach(() => (sut = new CepGatewayMock()));

	it('should be able to check CEP on external service', () => {
		expect(Boolean(sut.check())).toBeTruthy();
	});
});
