import { TypeOrmCondominiumEntity } from '../entities/condominium.entity';
import { Condominium } from '@app/entities/condominium';
import { TCondominiumInObject } from '@app/mapper/condominium';

export class TypeOrmCondominiumMapper {
	static toTypeOrm(input: Condominium): TypeOrmCondominiumEntity {
		const condominium = new TypeOrmCondominiumEntity();
		condominium.id = input.id.value;
		condominium.name = input.name.value;
		condominium.CEP = input.CEP.value;
		condominium.num = input.num.value;
		condominium.CNPJ = input.CNPJ.value;
		condominium.createdAt = input.createdAt;
		condominium.updatedAt = input.updatedAt;

		return condominium;
	}

	static toClass(input: TypeOrmCondominiumEntity): Condominium {
		return new Condominium(
			{
				name: input.name,
				CNPJ: input.CNPJ,
				CEP: input.CEP,
				num: input.num,
				createdAt: input.createdAt,
				updatedAt: input.updatedAt,
			},
			input.id,
		);
	}

	static toObject(input: TypeOrmCondominiumEntity): TCondominiumInObject {
		return {
			id: input.id,
			name: input.name,
			CNPJ: input.CNPJ,
			CEP: input.CEP,
			num: input.num,
			updatedAt: input.updatedAt,
			createdAt: input.createdAt,
		};
	}
}
