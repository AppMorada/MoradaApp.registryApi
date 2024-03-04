import { Module } from '@nestjs/common';
import { CreateTokenService } from '@app/services/login/createToken.service';
import { GenTFAService } from '@app/services/login/genTFA.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenController } from './refresh-tokens.flow/refreshToken.controller';
import { StartLoginController } from './start.flow/start.controller';
import { TfaController } from './tfa.flow/tfa.controller';

@Module({
	controllers: [RefreshTokenController, StartLoginController, TfaController],
	providers: [JwtService, CreateTokenService, GenTFAService],
})
export class LoginModule {}
