import { LoggerAdapter, TErrProps } from '@app/adapters/logger';

export class LoggerSpy implements LoggerAdapter {
	calls = {
		info: 0,
		warn: 0,
		log: 0,
		debug: 0,
		error: 0,
		fatal: 0,
	};

	async info() {
		++this.calls.info;
	}
	async warn() {
		++this.calls.warn;
	}
	async log() {
		++this.calls.log;
	}
	async debug() {
		++this.calls.debug;
	}
	async error() {
		++this.calls.error;
	}

	async fatal(input: TErrProps): Promise<void> {
		++this.calls.fatal;
		console.error('FATAL ERROR DETECTED: ', input);
	}
}
