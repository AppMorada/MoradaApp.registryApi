import { TypeOrmCondominiumEntity } from '../entities/condominium.entity';
import { TypeOrmUserEntity } from '../entities/user.entity';
import { TypeORMService } from '../typeORM.service';
import { TypeOrmCondominiumMemberEntity } from '../entities/condominiumMember.entity';
import { TypeOrmCommunityInfosEntity } from '../entities/communityInfos.entity';
import { TypeOrmUniqueRegistryEntity } from '../entities/uniqueRegistry.entity';
import { CockroachConnectionOptions } from 'typeorm/driver/cockroachdb/CockroachConnectionOptions';
import { FirstProdMigration1710642771706 } from './1710642771706-firstProdMigration';
import { AddCascadeDeletionOnCondominiumOwnerId1710703928497 } from './1710703928497-addCascadeDeletionOnCondominiumOwnerId';

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
		TypeOrmUniqueRegistryEntity,
	],
	synchronize: false,
	migrationsRun: false,
	migrationsTableName: 'migration_typeorm',
	migrations: [
		FirstProdMigration1710642771706,
		AddCascadeDeletionOnCondominiumOwnerId1710703928497,
	],
};

const dataSource = new TypeORMService({ ...config });
export { dataSource };
