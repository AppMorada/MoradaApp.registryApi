import { EmailAdapter } from '@app/adapters/email';

export class EmailSpy implements EmailAdapter {
	calls = {
		send: 0,
	};

	async send(): Promise<void> {
		this.calls.send = this.calls.send + 1;
	}
}
