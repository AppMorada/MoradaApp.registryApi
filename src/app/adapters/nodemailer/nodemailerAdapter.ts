import { createTransport } from 'nodemailer';
import { EmailAdapter, ISendMailContent } from '../email';
import { EnvEnum, GetEnvService } from '@infra/configs/getEnv.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NodemailerAdapter implements EmailAdapter {
	constructor(private readonly getEnv: GetEnvService) {}

	private async getAllEnvs() {
		const { env: NOT_SEND_EMAILS } = await this.getEnv.exec({
			env: EnvEnum.NOT_SEND_EMAILS,
		});
		const { env: HOST_SENDER } = await this.getEnv.exec({
			env: EnvEnum.HOST_SENDER,
		});
		const { env: HOST_PORT_SENDER } = await this.getEnv.exec({
			env: EnvEnum.HOST_PORT_SENDER,
		});
		const { env: EMAIL_SENDER } = await this.getEnv.exec({
			env: EnvEnum.EMAIL_SENDER,
		});
		const { env: PASS_SENDER } = await this.getEnv.exec({
			env: EnvEnum.PASS_SENDER,
		});

		return {
			NOT_SEND_EMAILS,
			HOST_SENDER,
			HOST_PORT_SENDER,
			EMAIL_SENDER,
			PASS_SENDER,
		};
	}

	async send(data: ISendMailContent): Promise<void> {
		const envs = await this.getAllEnvs();
		if (envs.NOT_SEND_EMAILS) return;

		const transport = createTransport({
			host: envs.HOST_SENDER,
			port: parseInt(envs.HOST_PORT_SENDER as string),
			auth: {
				user: envs.EMAIL_SENDER,
				pass: envs.PASS_SENDER,
			},
		});

		await transport.sendMail({
			from: data.from,
			to: data.to,
			subject: data.subject,
			html: data.body,
		});
	}
}
