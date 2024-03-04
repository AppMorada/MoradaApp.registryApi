import { IService } from '@app/services/_IService';

export class GenericServiceSpy implements IService {
	calls = { exec: 0 };
	exec() {
		++this.calls.exec;
	}
}
