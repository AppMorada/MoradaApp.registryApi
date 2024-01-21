import { CepGateway } from '@registry:app/gateways/CEP.gateway';
import { Global, Module } from '@nestjs/common';
import { ViacepGateway } from './APIs/viacep.gateway';

@Global()
@Module({
	providers: [
		{
			provide: CepGateway,
			useClass: ViacepGateway,
		},
	],
	exports: [CepGateway],
})
export class GatewayModule {}
