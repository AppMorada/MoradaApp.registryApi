import { CreateTokenService } from '@app/services/login/createToken.service';
import { GetKeyService } from '@app/services/key/getKey.service';
import { ValidateTFAService } from '@app/services/login/validateTFA.service';
import { ValidateTokenService } from '@app/services/login/validateToken.service';
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
