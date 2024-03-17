import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { TypeOrmCondominiumEntity } from '../entities/condominium.entity';
import { TypeOrmInviteEntity } from '../entities/invite.entity';
import { TypeOrmUserEntity } from '../entities/user.entity';
import { TypeORMService } from '../typeORM.service';
import { TypeOrmCondominiumMemberEntity } from '../entities/condominiumMember.entity';
import { TypeOrmCommunityInfosEntity } from '../entities/communityInfos.entity';
import { TypeOrmUniqueRegistryEntity } from '../entities/uniqueRegistry.entity';
import { FirstMigration1709706321663 } from './1709706321663-firstMigration';
import { AddUniqueRegistries1710480251681 } from './1710480251681-addUniqueRegistries';

const config: PostgresConnectionOptions = {
	type: 'postgres',
	url: process.env.DATABASE_URL as string,
	entities: [
		TypeOrmUserEntity,
		TypeOrmCondominiumEntity,
		TypeOrmCondominiumMemberEntity,
		TypeOrmCommunityInfosEntity,
		TypeOrmInviteEntity,
		TypeOrmUniqueRegistryEntity,
	],
	synchronize: false,
	migrationsRun: false,
	migrationsTableName: 'migration_typeorm',
	migrations: [FirstMigration1709706321663, AddUniqueRegistries1710480251681],
};

const dataSource = new TypeORMService({ ...config });
export { dataSource };
