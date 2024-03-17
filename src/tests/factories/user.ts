import { TInputPropsUser, User } from '@app/entities/user';

type TOverride = Partial<TInputPropsUser>;

export function userFactory(input: TOverride = {}, id?: string) {
	return new User(
		{
			name: 'John Doe',
			password: '12345678',
			phoneNumber: '1234567891',
			tfa: false,
			...input,
		},
		id,
	);
}
