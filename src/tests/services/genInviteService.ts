import { Invite } from '@app/entities/invite';
import { IService } from '@app/services/_IService';
import { IGenInviteProps } from '@app/services/invites/genInvite.service';

export class GenInviteServiceSpy implements IService {
	calls = {
		exec: 0,
	};
	async exec(input: IGenInviteProps) {
		++this.calls.exec;
		const invite = new Invite({
			recipient: input.recipient,
			condominiumId: input.condominiumId,
			code: '123456789',
			memberId: input.memberId,
		});
		return {
			invite,
			sendInviteOnEmail: () => {},
		};
	}
}
