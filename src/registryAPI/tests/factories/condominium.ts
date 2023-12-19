import { CEP } from '@registry:app/entities/VO/CEP';
import { CNPJ } from '@registry:app/entities/VO/CNPJ';
import { Name } from '@registry:app/entities/VO/name';
import { Num } from '@registry:app/entities/VO/num';
import {
	Condominium,
	TInputPropsCondominium,
} from '@registry:app/entities/condominium';

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
