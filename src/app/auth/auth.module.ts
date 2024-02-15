import { CreateTokenService } from '@app/services/createToken.service';
import { GetKeyService } from '@app/services/getKey.service';
import { ValidateTFAService } from '@app/services/validateTFA.service';
import { ValidateTokenService } from '@app/services/validateToken.service';
import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Global()
@Module({
	providers: [
		ValidateTFAService,
		ValidateTokenService,
		GetKeyService,
		JwtService,
		CreateTokenService,
	],
	exports: [
		ValidateTFAService,
		ValidateTokenService,
		GetKeyService,
		CreateTokenService,
		JwtService,
	],
})
export class AuthModule {}
