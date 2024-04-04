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
		condominium.user = input.ownerId.value;
		condominium.humanReadableId = input.humanReadableId;
		condominium.num = input.num.value;
		condominium.CNPJ = input.CNPJ.value;
		condominium.district = input.district.value;
		condominium.city = input.city.value;
		condominium.state = input.state.value;
		condominium.complement = input.complement?.value ?? null;
		condominium.reference = input.reference?.value ?? null;
		condominium.createdAt = input.createdAt;
		condominium.updatedAt = input.updatedAt;

		return condominium;
	}

	static toClass(input: TypeOrmCondominiumEntity): Condominium {
		return new Condominium(
			{
				ownerId: input.user as string,
				humanReadableId: input.humanReadableId,
				name: input.name,
				CNPJ: CNPJ.toString(parseInt(input.CNPJ)),
				CEP: CEP.toString(input.CEP),
				num: input.num,
				reference: input.reference ?? null,
				complement: input.complement ?? null,
				district: input.district,
				city: input.city,
				state: input.state,
				createdAt: input.createdAt,
				updatedAt: input.updatedAt,
			},
			input.id,
		);
	}

	static toObject(input: TypeOrmCondominiumEntity): TCondominiumInObject {
		return {
			id: input.id,
			humanReadableId: input.humanReadableId,
			ownerId: input.user as string,
			name: input.name,
			CNPJ: CNPJ.toString(parseInt(input.CNPJ)),
			CEP: CEP.toString(input.CEP),
			num: input.num,
			reference: input.reference ?? null,
			complement: input.complement ?? null,
			district: input.district,
			city: input.city,
			state: input.state,
			updatedAt: input.updatedAt,
			createdAt: input.createdAt,
		};
	}
}
