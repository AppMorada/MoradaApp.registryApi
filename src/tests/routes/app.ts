import { trace } from '@infra/configs/tracing';
import { RegistryAPIBootstrap } from '../../bootstrap';

export async function startApplication() {
	const bootstrap = new RegistryAPIBootstrap(trace);
	await bootstrap.start();
	return bootstrap.app;
}
