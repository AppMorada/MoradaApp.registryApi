import { TInputPropsUser, User } from '@app/entities/user';

type TOverride = Partial<TInputPropsUser>;

export function userFactory(input: TOverride = {}, id?: string) {
	return new User(
		{
			name: 'John Doe',
			email: 'jhondoe@email.com',
			password: '12345678',
			phoneNumber: '1234567891',
			CPF: '11122233396',
			...input,
		},
		id,
	);
}
