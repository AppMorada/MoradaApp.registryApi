import { ISecretProps, Secret } from '@app/entities/secret';

export class SecretMapper {
	static toObject(input: Secret): ISecretProps {
		return {
			key: input.key,
			value: input.value,
		};
	}

	static toClass(input: ISecretProps) {
		return new Secret({
			key: input.key,
			value: input.value,
		});
	}
}
