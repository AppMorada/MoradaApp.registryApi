import { Module } from '@nestjs/common';
import { EmailAdapter } from './email';
import { NodemailerAdapter } from './nodemailer/nodemailerAdapter';

@Module({
	providers: [
		{
			provide: EmailAdapter,
			useClass: NodemailerAdapter,
		},
	],
	exports: [EmailAdapter],
})
export class AdaptersModule {}
