import { EmailAdapter } from '@app/adapters/email';

export class EmailMock implements EmailAdapter {
	async send(): Promise<void> {}
}
