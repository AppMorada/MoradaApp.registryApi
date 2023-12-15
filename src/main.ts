import * as express from 'express';
import * as functions from 'firebase-functions';
import { Bootstrap } from './bootstrap';

const nodeEnv = process.env.NODE_ENV;
const envs = [
	'PROJECT_NAME',
	'DATABASE_URL',
	'REDIS_URL',
	'ACCESS_TOKEN_EXP',
	'ACCESS_TOKEN_KEY',
	'REFRESH_TOKEN_EXP',
	'REFRESH_TOKEN_KEY',
	'INVITE_TOKEN_KEY',
	'INVITE_ADMIN_TOKEN_KEY',
	'INVITE_SUPER_ADMIN_TOKEN_KEY',
	'COOKIE_KEY',
	'HOST_SENDER',
	'HOST_PORT_SENDER',
	'NAME_SENDER',
	'EMAIL_SENDER',
	'PASS_SENDER',
];

const expressApp = express();

const bootstrap = new Bootstrap();
bootstrap.run({ requestListener: expressApp });

let RegistryAPI: functions.HttpsFunction;

if (nodeEnv === 'development' || nodeEnv === 'test')
	RegistryAPI = functions.https.onRequest(async (req, res) => {
		bootstrap.runStorageLayer();
		expressApp(req, res);
	});
else
	RegistryAPI = functions
		.region('southamerica-east1')
		.runWith({
			secrets: envs,
			maxInstances: 3,
			timeoutSeconds: 15,
		})
		.https.onRequest(async (req, res) => {
			bootstrap.runStorageLayer();
			expressApp(req, res);
		});

export { RegistryAPI };
