import { EntitieError } from '@app/errors/entities';
import { IClass } from '@utils/class';

export enum EntitiesEnum {
	secret = 'secret',
	key = 'key',
	condominium = 'Condominium',
	condominiumRequest = 'Condominium Request',
	member = 'Member',
	condominiumMember = 'Condominium Member',
	communityInfo = 'Community Info',
	user = 'User',
	uniqueRegistry = 'Unique Registry',
	invite = 'Invite',
	vo = 'Value Object',
}

export abstract class Entity {
	abstract equalTo(input: Entity): boolean;
	abstract dereference(): Entity;
}

export enum VOEnum {
	NullOrUndefined,
}

export abstract class ValueObject<T, O> {
	abstract equalTo(input: T): boolean;
	abstract get value(): O;

	static compare(
		c1?: ValueObject<any, any> | null,
		c2?: ValueObject<any, any> | null,
	): boolean {
		if (c1 !== null && c1 !== undefined && c2 !== null && c2 !== undefined)
			return c1.equalTo(c2);

		return c1 === c2;
	}

	static build<T>(
		constructor: IClass<T>,
		internalValue?: ConstructorParameters<IClass<T>> | null,
	) {
		const orStatement = <A>(
			alternativeValue: A,
		): { exec: () => InstanceType<IClass<T>> | A } => {
			if (!internalValue) return { exec: () => alternativeValue };
			return { exec: () => new constructor(internalValue) };
		};

		const allowNullish = (): {
			exec: () => InstanceType<IClass<T>> | null | undefined;
		} => {
			if (internalValue === null || internalValue === undefined)
				return { exec: () => internalValue };
			return { exec: () => new constructor(internalValue) };
		};

		return {
			exec: (): InstanceType<IClass<T>> => {
				if (!internalValue)
					throw new EntitieError({
						entity: EntitiesEnum.vo,
						message:
							'Valor interno de entidade não pode ser null ou undefined, use \'or\' para garantir que seja possível de se usar valores nulos ou valores alternativos ou use \'allowNullish\' para lidar diretamente com nullish values',
					});
				return new constructor(internalValue);
			},
			or: <T>(alternativeValue: T) =>
				orStatement<typeof alternativeValue>(alternativeValue),
			allowNullish,
		};
	}
}
