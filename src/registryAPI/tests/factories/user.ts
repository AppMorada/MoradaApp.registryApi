import { CPF } from '@registry:app/entities/VO/CPF';
import { ApartmentNumber } from '@registry:app/entities/VO/apartmentNumber';
import { Block } from '@registry:app/entities/VO/block';
import { Email } from '@registry:app/entities/VO/email';
import { Name } from '@registry:app/entities/VO/name';
import { Password } from '@registry:app/entities/VO/password';
import { PhoneNumber } from '@registry:app/entities/VO/phoneNumber';
import { TInputPropsUser, User } from '@registry:app/entities/user';
import { randomUUID } from 'crypto';

type TOverride = Partial<TInputPropsUser>;

export function userFactory(input: TOverride = {}, id?: string) {
	return new User(
		{
			name: new Name('John Doe'),
			email: new Email('jhondoe@email.com'),
			password: new Password('12345678'),
			phoneNumber: new PhoneNumber('1234567891'),
			CPF: new CPF('11122233396'),
			condominiumId: randomUUID(),
			apartmentNumber: new ApartmentNumber(32768),
			block: new Block('180'),
			...input,
		},
		id ?? 'default id',
	);
}
