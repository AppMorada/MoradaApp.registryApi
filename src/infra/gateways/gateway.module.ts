import { CepGateway } from '@app/gateways/CEP.gateway';
import { Module } from '@nestjs/common';
import { ViacepGateway } from './APIs/viacep.gateway';

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
