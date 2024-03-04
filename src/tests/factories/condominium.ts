import { UUID } from '@app/entities/VO';
import { Condominium, TInputPropsCondominium } from '@app/entities/condominium';
import { randomBytes } from 'crypto';

type TOverride = Partial<TInputPropsCondominium>;

export function condominiumFactory(input: TOverride = {}, id?: string) {
	return new Condominium(
		{
			ownerId: UUID.genV4().value,
			name: 'My condominium',
			CEP: '97507-040',
			CNPJ: '95.185.265/0001-18',
			num: 32768,
			seedKey: randomBytes(30).toString('hex'),
			...input,
		},
		id,
	);
}
