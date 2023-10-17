import { Module } from '@nestjs/common';
import { EmailAdapter } from './email';
import { NodemailerAdapter } from './nodemailer/nodemailerAdapter';
import { CryptAdapter } from './crypt';
import { BcryptAdapter } from './bcrypt/bcryptAdapter';

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
	],
	exports: [EmailAdapter, CryptAdapter],
})
export class AdaptersModule {}
