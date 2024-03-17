import { UniqueRegistry } from '@app/entities/uniqueRegistry';
import { TypeOrmUniqueRegistryEntity } from '../entities/uniqueRegistry.entity';
import { IUniqueRegistryInObject } from '@app/mapper/uniqueRegistry';
import { CPF } from '@app/entities/VO';

export class TypeOrmUniqueRegistryMapper {
	static toTypeOrm(input: UniqueRegistry): TypeOrmUniqueRegistryEntity {
		const uniqueRegistry = new TypeOrmUniqueRegistryEntity();
		uniqueRegistry.CPF = input.CPF?.value ?? null;
		uniqueRegistry.email = input.email.value;
		uniqueRegistry.id = input.id.value;

		return uniqueRegistry;
	}

	static toObject(
		input: TypeOrmUniqueRegistryEntity,
	): IUniqueRegistryInObject {
		const parsedCPF = input.CPF
			? CPF.toString(CPF.toInt(new CPF(input.CPF)))
			: null;
		return {
			id: input.id,
			email: input.email,
			CPF: parsedCPF,
		};
	}

	static toClass(input: TypeOrmUniqueRegistryEntity) {
		const parsedCPF = input.CPF
			? CPF.toString(CPF.toInt(new CPF(input.CPF)))
			: null;

		return new UniqueRegistry(
			{
				CPF: parsedCPF,
				email: input.email,
			},
			input.id,
		);
	}
}
