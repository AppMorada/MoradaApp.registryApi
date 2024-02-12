import { Global, Module } from '@nestjs/common';
import { EmailAdapter } from './email';
import { NodemailerAdapter } from './nodemailer/nodemailerAdapter';
import { CryptAdapter } from './crypt';
import { BcryptAdapter } from './bcrypt/bcryptAdapter';
import { HttpAdapter } from './http';
import { FetchAdapter } from './fetch/fetchAdapter';
import { LoggerAdapter } from './logger';
import { CookieAdapter } from './cookie';
import { CookieParserAdapter } from './cookie-parser/cookieParserAdapter';
import { FirebaseLoggerAdapter } from './firebase-logger';

@Global()
@Module({
	providers: [
		{
			provide: EmailAdapter,
			useClass: NodemailerAdapter,
		},
		{
			provide: CryptAdapter,
			useClass: BcryptAdapter,
		},
		{
			provide: HttpAdapter,
			useClass: FetchAdapter,
		},
		{
			provide: LoggerAdapter,
			useClass: FirebaseLoggerAdapter,
		},
		{
			provide: CookieAdapter,
			useClass: CookieParserAdapter,
		},
	],
	exports: [
		EmailAdapter,
		CryptAdapter,
		HttpAdapter,
		LoggerAdapter,
		CookieAdapter,
	],
})
export class AdaptersModule {}
