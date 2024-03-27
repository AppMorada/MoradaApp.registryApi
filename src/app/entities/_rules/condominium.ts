export const condominiumRules = {
	CEP: {
		minLength: 8,
		maxLength: 9,
		type: 'string',
	},
	num: {
		minLength: 0,
		maxLength: 2147483647,
		type: 'number',
	},
	CNPJ: {
		minLength: 14,
		maxLength: 18,
		type: 'string',
	},
};
