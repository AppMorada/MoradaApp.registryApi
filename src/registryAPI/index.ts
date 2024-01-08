import * as dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import { Request, Response } from '@google-cloud/functions-framework';
import { RegistryAPIBootstrap } from './bootstrap';

const expressApp = express();

const bootstrap = new RegistryAPIBootstrap();
bootstrap.run({ requestListener: expressApp });

export const RegistryAPI = async (req: Request, res: Response) => {
	expressApp(req, res);
};
