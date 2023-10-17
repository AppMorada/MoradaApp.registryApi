import { CEP } from '@app/entities/VO/CEP';
import { CNPJ } from '@app/entities/VO/CNPJ';
import { CPF } from '@app/entities/VO/CPF';
import { Block } from '@app/entities/VO/block';
import { Email } from '@app/entities/VO/email';
import { Level } from '@app/entities/VO/level';
import { Name } from '@app/entities/VO/name';
import { Num } from '@app/entities/VO/num';
import { Password } from '@app/entities/VO/password';
import { PhoneNumber } from '@app/entities/VO/phoneNumber';
import { Condominium } from '@app/entities/condominium';
import { User } from '@app/entities/user';

export class Dereference {
	static user(input: User): User {
		return new User(
			{
				name: new Name(input.name.value()),
				email: new Email(input.email.value()),
				password: new Password(input.password.value()),
				CPF: new CPF(input.CPF.value()),
				level: new Level(input.level.value()),
				phoneNumber: new PhoneNumber(input.phoneNumber.value()),
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
				name: new Name(input.name.value()),
				CEP: new CEP(input.CEP.value()),
				CNPJ: new CNPJ(input.CNPJ.value()),
				num: new Num(input.num.value()),
				block: new Block(input.block.value()),
				updatedAt: input.updatedAt,
				createdAt: input.createdAt,
			},
			input.id,
		);
	}
}
