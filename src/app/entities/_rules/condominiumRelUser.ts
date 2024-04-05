export const condominiumRelUserRules = {
	userId: {
		type: 'string',
	},
	condominiumId: {
		type: 'string',
	},
	block: {
		maxLength: 12,
		type: 'string',
	},
	apartmentNumber: {
		maxLength: 2147483647,
		minLength: 0,
		type: 'number',
	},
	level: {
		maxLength: 2,
		minLength: -1,
		type: 'number',
	},
};
