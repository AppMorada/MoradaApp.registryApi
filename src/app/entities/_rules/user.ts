export const userRules = {
	email: {
		maxLength: 320,
		type: 'string',
	},
	password: {
		maxLength: 64,
		minLength: 8,
		type: 'string',
	},
	CPF: {
		maxLength: 14,
		minLength: 11,
		type: 'string',
	},
	phoneNumber: {
		maxLength: 20,
		minLength: 10,
		type: 'string',
	},
};
