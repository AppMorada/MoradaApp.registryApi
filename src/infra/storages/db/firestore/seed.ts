class Seed {
	private signatures = {
		ACCESS_TOKEN_KEY: 900 * 1000,
		REFRESH_TOKEN_KEY: 86400 * 1000,
		INVITE_TOKEN_KEY: 604800000 * 1000,
		INVITE_ADMIN_TOKEN_KEY: 604800000 * 1000,
		INVITE_SUPER_ADMIN_TOKEN_KEY: 604800000 * 1000,
		TFA_TOKEN_KEY: 1000 * 60 * 2,
		CONDOMINIUM_VALIDATION_KEY: 1000 * 60 * 60 * 24,
	};

	private async send() {
		const createKeyFuncURL = String(process.env.CREATE_KEY_FUNC_URL);
		console.log('Inserting the following keys:');

		for (const key in this.signatures) {
			const body = JSON.stringify({
				name: key,
				ttl: this.signatures[key as keyof typeof this.signatures],
			});

			console.log(body);

			await fetch(createKeyFuncURL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body,
			});
		}
	}

	async exec() {
		await this.send();
	}
}

const seed = new Seed();

seed.exec();
