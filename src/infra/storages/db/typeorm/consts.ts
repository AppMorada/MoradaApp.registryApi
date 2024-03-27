export const typeORMConsts = {
	databaseProviders: Symbol.for('TYPEORM_PROVIDER'),
	entity: {
		user: Symbol.for('users'),
		condominium: Symbol.for('condominiums'),
		invite: Symbol.for('invites'),
		condominiumMember: Symbol.for('condominium_members'),
		enterpriseMember: Symbol.for('enterprise_members'),
		communityInfos: Symbol.for('community_infos'),
	},
	trace: {
		name: 'TypeORM',
		op: 'Database operation',
		err: 'Database error',
	},
};
