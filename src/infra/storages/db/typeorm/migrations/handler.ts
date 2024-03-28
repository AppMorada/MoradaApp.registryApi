import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { TypeOrmCondominiumEntity } from '../entities/condominium.entity';
import { TypeOrmInviteEntity } from '../entities/invite.entity';
import { TypeOrmUserEntity } from '../entities/user.entity';
import { TypeORMService } from '../typeORM.service';
import { TypeOrmCondominiumMemberEntity } from '../entities/condominiumMember.entity';
import { TypeOrmCommunityInfosEntity } from '../entities/communityInfos.entity';
import { TypeOrmUniqueRegistryEntity } from '../entities/uniqueRegistry.entity';
import { TypeOrmCondominiumRequestEntity } from '../entities/condominiumRequest.entity';
import { FirstMigration1711591103941 } from './1711591103941-firstMigration';

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
		TypeOrmCondominiumRequestEntity,
	],
	synchronize: false,
	migrationsRun: false,
	migrationsTableName: 'migration_typeorm',
	migrations: [FirstMigration1711591103941],
};

const dataSource = new TypeORMService({ ...config });
export { dataSource };
