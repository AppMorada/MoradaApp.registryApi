export const typeORMConsts = {
	databaseProviders: Symbol.for('TYPEORM_PROVIDER'),
	entity: {
		user: Symbol.for('TYPEORM_USER_PROVIDER'),
		condominium: Symbol.for('TYPEORM_CONDOMINIUM_PROVIDER'),
		invite: Symbol.for('TYPEORM_INVITE_PROVIDER'),
		condominiumRelUser: Symbol.for('TYPEORM_CONDOMINIUMRELUSER_PROVIDER'),
	},
};
