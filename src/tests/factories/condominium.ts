import { UUID } from '@app/entities/VO';
import { Condominium, TInputPropsCondominium } from '@app/entities/condominium';

type TOverride = Partial<TInputPropsCondominium>;

export function condominiumFactory(input: TOverride = {}, id?: string) {
	return new Condominium(
		{
			ownerId: UUID.genV4().value,
			name: 'My condominium',
			CEP: '97507040',
			CNPJ: '38.767.810/0001-40',
			num: 32768,
			district: 'Some district',
			city: 'Some city',
			state: 'Some state',
			reference: 'Some reference',
			complement: 'Some complement',
			humanReadableId: 'NNNNNN',
			...input,
		},
		id,
	);
}
