import { TypeOrmCondominiumEntity } from '../entities/condominium.entity';
import { TypeOrmUserEntity } from '../entities/user.entity';
import { TypeORMService } from '../typeORM.service';
import { TypeOrmCondominiumMemberEntity } from '../entities/condominiumMember.entity';
import { TypeOrmCommunityInfosEntity } from '../entities/communityInfos.entity';
import { TypeOrmUniqueRegistryEntity } from '../entities/uniqueRegistry.entity';
import { CockroachConnectionOptions } from 'typeorm/driver/cockroachdb/CockroachConnectionOptions';
import { TypeOrmCondominiumRequestEntity } from '../entities/condominiumRequest.entity';
import { FirstProdMigration1712250638388 } from './1712250638388-firstProdMigration';
import { AddIndexAndFixForgottenNullablesFields1712355164981 } from './1712355164981-addIndexAndFixForgottenNullablesFields';

const config: CockroachConnectionOptions = {
	type: 'cockroachdb',
	url: process.env.DATABASE_URL as string,
	timeTravelQueries: false,
	ssl: true,
	entities: [
		TypeOrmUserEntity,
		TypeOrmCondominiumEntity,
		TypeOrmCondominiumMemberEntity,
		TypeOrmCommunityInfosEntity,
		TypeOrmCondominiumRequestEntity,
		TypeOrmUniqueRegistryEntity,
	],
	synchronize: false,
	migrationsRun: false,
	migrationsTableName: 'migration_typeorm',
	migrations: [
		FirstProdMigration1712250638388,
		AddIndexAndFixForgottenNullablesFields1712355164981,
	],
};

const dataSource = new TypeORMService({ ...config });
export { dataSource };
