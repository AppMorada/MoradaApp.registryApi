import { typeORMConsts } from './consts';
import { TypeOrmCondominiumEntity } from './entities/condominium.entity';
import { TypeOrmCondominiumRelUserEntity } from './entities/condominiumRelUser.entity';
import { TypeOrmInviteEntity } from './entities/invite.entity';
import { TypeOrmUserEntity } from './entities/user.entity';
import { TypeORMService } from './typeORM.service';

export const entitiesProviders = [
	{
		provide: typeORMConsts.entity.user,
		useFactory: (dataSource: TypeORMService) =>
			dataSource.getRepository(TypeOrmUserEntity),
		inject: [typeORMConsts.databaseProviders],
	},
	{
		provide: typeORMConsts.entity.condominium,
		useFactory: (dataSource: TypeORMService) =>
			dataSource.getRepository(TypeOrmCondominiumEntity),
		inject: [typeORMConsts.databaseProviders],
	},
	{
		provide: typeORMConsts.entity.invite,
		useFactory: (dataSource: TypeORMService) =>
			dataSource.getRepository(TypeOrmInviteEntity),
		inject: [typeORMConsts.databaseProviders],
	},
	{
		provide: typeORMConsts.entity.condominiumRelUser,
		useFactory: (dataSource: TypeORMService) =>
			dataSource.getRepository(TypeOrmCondominiumRelUserEntity),
		inject: [typeORMConsts.databaseProviders],
	},
];
