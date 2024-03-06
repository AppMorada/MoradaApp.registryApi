import { CEP, CNPJ } from '@app/entities/VO';
import { TypeOrmCondominiumEntity } from '../entities/condominium.entity';
import { Condominium } from '@app/entities/condominium';
import { TCondominiumInObject } from '@app/mapper/condominium';

export class TypeOrmCondominiumMapper {
	static toTypeOrm(input: Condominium): TypeOrmCondominiumEntity {
		const condominium = new TypeOrmCondominiumEntity();
		condominium.user = input.ownerId.value;
		condominium.id = input.id.value;
		condominium.name = input.name.value;
		condominium.CEP = CEP.toInt(input.CEP);
		condominium.num = input.num.value;
		condominium.CNPJ = input.CNPJ.value;
		condominium.createdAt = input.createdAt;
		condominium.updatedAt = input.updatedAt;
		condominium.seed_key = input.seedKey;

		return condominium;
	}

	static toClass(input: TypeOrmCondominiumEntity): Condominium {
		return new Condominium(
			{
				ownerId: input.user as string,
				name: input.name,
				CNPJ: CNPJ.toString(parseInt(input.CNPJ)),
				CEP: CEP.toString(input.CEP),
				num: input.num,
				seedKey: input.seed_key,
				createdAt: input.createdAt,
				updatedAt: input.updatedAt,
			},
			input.id,
		);
	}

	static toObject(input: TypeOrmCondominiumEntity): TCondominiumInObject {
		return {
			id: input.id,
			ownerId: input.user as string,
			name: input.name,
			CNPJ: CNPJ.toString(parseInt(input.CNPJ)),
			CEP: CEP.toString(input.CEP),
			num: input.num,
			seedKey: input.seed_key,
			updatedAt: input.updatedAt,
			createdAt: input.createdAt,
		};
	}
}
