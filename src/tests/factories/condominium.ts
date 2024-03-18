import { UUID } from '@app/entities/VO';
import { Condominium, TInputPropsCondominium } from '@app/entities/condominium';
import { randomBytes } from 'crypto';

type TOverride = Partial<TInputPropsCondominium>;

export function condominiumFactory(input: TOverride = {}, id?: string) {
	return new Condominium(
		{
			ownerId: UUID.genV4().value,
			name: 'My condominium',
			CEP: '97507040',
			CNPJ: '95185265000118',
			num: 32768,
			seedKey: randomBytes(30).toString('hex'),
			...input,
		},
		id,
	);
}
