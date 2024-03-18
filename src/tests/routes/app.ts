import { RegistryAPIBootstrap } from '../../bootstrap';

export async function startApplication() {
	const bootstrap = new RegistryAPIBootstrap();
	await bootstrap.start();
	return bootstrap.app;
}
