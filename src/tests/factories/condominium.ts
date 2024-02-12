import { Condominium, TInputPropsCondominium } from '@app/entities/condominium';

type TOverride = Partial<TInputPropsCondominium>;

export function condominiumFactory(input: TOverride = {}, id?: string) {
	return new Condominium(
		{
			name: 'My condominium',
			CEP: '12345678',
			CNPJ: '12345678912345',
			num: 32768,
			...input,
		},
		id,
	);
}
