import { CPF } from '@app/entities/VO/CPF';
import { Email } from '@app/entities/VO/email';
import { Name } from '@app/entities/VO/name';
import { Password } from '@app/entities/VO/password';
import { PhoneNumber } from '@app/entities/VO/phoneNumber';
import { TInputPropsUser, User } from '@app/entities/user';
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
			...input,
		},
		id ?? 'default id',
	);
}
