import { Global, Module } from '@nestjs/common';
import { EmailAdapter } from './email';
import { NodemailerAdapter } from './nodemailer/nodemailerAdapter';
import { CryptAdapter } from './crypt';
import { BcryptAdapter } from './bcrypt/bcryptAdapter';
import { HttpAdapter } from './http';
import { FetchAdapter } from './fetch/fetchAdapter';

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
	],
	exports: [EmailAdapter, CryptAdapter, HttpAdapter],
})
export class AdaptersModule {}
