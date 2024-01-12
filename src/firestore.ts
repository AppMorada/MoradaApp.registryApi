import * as functions from 'firebase-functions';
import { RegistryAPI as RegistryFunction } from './registryAPI';

export const RegistryAPITest = functions
	.region('southamerica-east1')
	.runWith({
		maxInstances: 3,
		timeoutSeconds: 15,
	})
	.https.onRequest(RegistryFunction);
