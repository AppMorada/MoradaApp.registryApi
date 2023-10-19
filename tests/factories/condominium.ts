import { CEP } from '@app/entities/VO/CEP';
import { CNPJ } from '@app/entities/VO/CNPJ';
import { Name } from '@app/entities/VO/name';
import { Num } from '@app/entities/VO/num';
import { Condominium, TInputPropsCondominium } from '@app/entities/condominium';

type TOverride = Partial<TInputPropsCondominium>;

export function condominiumFactory(input: TOverride = {}, id?: string) {
	return new Condominium(
		{
			name: new Name('My condominium'),
			CEP: new CEP('12345678'),
			CNPJ: new CNPJ('12345678912345'),
			num: new Num(32768),
			...input,
		},
		id,
	);
}
