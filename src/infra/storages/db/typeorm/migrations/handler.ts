import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { TypeOrmCondominiumEntity } from '../entities/condominium.entity';
import { TypeOrmUserEntity } from '../entities/user.entity';
import { TypeORMService } from '../typeORM.service';
import { TypeOrmCondominiumMemberEntity } from '../entities/condominiumMember.entity';
import { TypeOrmCommunityInfosEntity } from '../entities/communityInfos.entity';
import { TypeOrmUniqueRegistryEntity } from '../entities/uniqueRegistry.entity';
import { TypeOrmCondominiumRequestEntity } from '../entities/condominiumRequest.entity';
import { FirstMigration1712199170992 } from './1712199170992-firstMigration';
import { AddIndexAndFixForgottenNullablesFields1712355043048 } from './1712355043048-addIndexAndFixForgottenNullablesFields';

const config: PostgresConnectionOptions = {
	type: 'postgres',
	url: process.env.DATABASE_URL as string,
	entities: [
		TypeOrmUserEntity,
		TypeOrmCondominiumEntity,
		TypeOrmCondominiumMemberEntity,
		TypeOrmCommunityInfosEntity,
		TypeOrmUniqueRegistryEntity,
		TypeOrmCondominiumRequestEntity,
	],
	synchronize: false,
	migrationsRun: false,
	migrationsTableName: 'migration_typeorm',
	migrations: [
		FirstMigration1712199170992,
		AddIndexAndFixForgottenNullablesFields1712355043048,
	],
};

const dataSource = new TypeORMService({ ...config });
export { dataSource };
