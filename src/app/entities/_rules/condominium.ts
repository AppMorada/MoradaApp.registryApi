export const condominiumRules = {
	CEP: {
		minLength: 8,
		maxLength: 9,
		type: 'string',
	},
	district: {
		minLength: 4,
		maxLength: 140,
		type: 'string',
	},
	state: {
		minLength: 4,
		maxLength: 140,
		type: 'string',
	},
	city: {
		minLength: 4,
		maxLength: 140,
		type: 'string',
	},
	complement: {
		minLength: 3,
		maxLength: 60,
		type: 'string',
	},
	reference: {
		minLength: 6,
		maxLength: 60,
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
