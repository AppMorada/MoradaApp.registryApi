export function fatalErrorHandler() {
	if (process.env.NODE_ENV !== 'test') process.kill(process.pid, 'SIGTERM');
}
