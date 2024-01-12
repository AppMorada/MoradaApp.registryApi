import { EntitieError } from '@registry:app/errors/entities';
import { ValueObject, EntitiesEnum } from '@registry:app/entities/entities';
import { userDTORules } from '@registry:app/entities/user';

export class CPF implements ValueObject<CPF, string> {
	/**
	 * Deve conter valores validos de CPF, formatados ou não
	 * @param _value - CPF em questão
	 **/
	constructor(private readonly _value: string) {
		this._value = _value.replace(/[.-]/g, '');

		/*
		 * Função criada para validar CPFs usando o
		 * algoritmo de módulo 11. Material abaixo caso tenham interesse:
		 * https://www.youtube.com/watch?v=15Bw0duulMQ&themeRefresh=1
		 **/

		// Pegando os últimos dois digitos (digitos verificadores)
		const validator = this._value.slice(
			this._value.length - 2,
			this._value.length,
		);
		// Pegando os números do corpo do CPF
		let body = this._value.slice(0, -2);

		let toValidate: string = '';
		for (let loop = 0; loop <= 1; loop++) {
			// Na primeira conta realizamos a equação normalmente e na segunda
			// vez agregamos o valor, gerado pela equação, no CPF e realizamos
			// o cálculo novamente
			if (loop === 1) body = body + toValidate;

			const numWithWeights: number[] = [];

			for (let i = 1; i <= 9 + loop; i++)
				numWithWeights.push(parseInt(body[i - 1]) * (11 + loop - i));

			const resultOfNumWithWeights = numWithWeights.reduce(
				(prev, current) => prev + current,
			);
			let result = resultOfNumWithWeights % 11;

			result < 2 ? (result = 0) : (result = 11 - result);
			toValidate = (toValidate ?? '') + result;
		}

		if (toValidate !== validator)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Invalid CPF.',
			});

		if (this._value.length !== userDTORules.CPF.minLength)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Valor incorreto de CPF',
			});
	}

	public equalTo(input: CPF) {
		return input.value === this._value;
	}

	get value(): string {
		return this._value;
	}
}
