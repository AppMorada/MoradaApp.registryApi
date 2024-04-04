import { IService } from '@app/services/_IService';

export class SendInviteServiceSpy implements IService {
	calls = {
		exec: 0,
	};
	async exec() {
		++this.calls.exec;
	}
}
