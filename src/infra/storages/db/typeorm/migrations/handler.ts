import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { TypeOrmCondominiumEntity } from '../entities/condominium.entity';
import { TypeOrmUserEntity } from '../entities/user.entity';
import { TypeORMService } from '../typeORM.service';
import { TypeOrmCondominiumMemberEntity } from '../entities/condominiumMember.entity';
import { TypeOrmCommunityInfosEntity } from '../entities/communityInfos.entity';
import { TypeOrmUniqueRegistryEntity } from '../entities/uniqueRegistry.entity';
import { TypeOrmCondominiumRequestEntity } from '../entities/condominiumRequest.entity';
import { FirstMigration1712034171104 } from './1712034171104-firstMigration';

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
	migrations: [FirstMigration1712034171104],
};

const dataSource = new TypeORMService({ ...config });
export { dataSource };
