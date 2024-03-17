import { typeORMConsts } from './consts';
import { TypeOrmCommunityInfosEntity } from './entities/communityInfos.entity';
import { TypeOrmCondominiumEntity } from './entities/condominium.entity';
import { TypeOrmCondominiumMemberEntity } from './entities/condominiumMember.entity';
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
		provide: typeORMConsts.entity.condominiumMember,
		useFactory: (dataSource: TypeORMService) =>
			dataSource.getRepository(TypeOrmCondominiumMemberEntity),
		inject: [typeORMConsts.databaseProviders],
	},
	{
		provide: typeORMConsts.entity.communityInfos,
		useFactory: (dataSource: TypeORMService) =>
			dataSource.getRepository(TypeOrmCommunityInfosEntity),
		inject: [typeORMConsts.databaseProviders],
	},
];
