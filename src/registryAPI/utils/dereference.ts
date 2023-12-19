import { CEP } from '@registry:app/entities/VO/CEP';
import { CNPJ } from '@registry:app/entities/VO/CNPJ';
import { CPF } from '@registry:app/entities/VO/CPF';
import { ApartmentNumber } from '@registry:app/entities/VO/apartmentNumber';
import { Block } from '@registry:app/entities/VO/block';
import { Email } from '@registry:app/entities/VO/email';
import { Level } from '@registry:app/entities/VO/level';
import { Name } from '@registry:app/entities/VO/name';
import { Num } from '@registry:app/entities/VO/num';
import { Password } from '@registry:app/entities/VO/password';
import { PhoneNumber } from '@registry:app/entities/VO/phoneNumber';
import { Condominium } from '@registry:app/entities/condominium';
import { User } from '@registry:app/entities/user';

export class Dereference {
	static user(input: User): User {
		return new User(
			{
				name: new Name(input.name.value),
				email: new Email(input.email.value),
				password: new Password(input.password.value),
				CPF: new CPF(input.CPF.value),
				level: new Level(input.level.value),
				phoneNumber: new PhoneNumber(input.phoneNumber.value),
				apartmentNumber: input.apartmentNumber
					? new ApartmentNumber(input.apartmentNumber.value)
					: null,
				block: input.block ? new Block(input.block.value) : null,
				condominiumId: input.condominiumId,
				createdAt: input.createdAt,
				updatedAt: input.updatedAt,
			},
			input.id,
		);
	}

	static condominium(input: Condominium): Condominium {
		return new Condominium(
			{
				name: new Name(input.name.value),
				CEP: new CEP(input.CEP.value),
				CNPJ: new CNPJ(input.CNPJ.value),
				num: new Num(input.num.value),
				updatedAt: input.updatedAt,
				createdAt: input.createdAt,
			},
			input.id,
		);
	}
}
