import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { TypeOrmCondominiumEntity } from '../entities/condominium.entity';
import { TypeOrmCondominiumRelUserEntity } from '../entities/condominiumRelUser.entity';
import { TypeOrmInviteEntity } from '../entities/invite.entity';
import { TypeOrmUserEntity } from '../entities/user.entity';
import { TypeORMService } from '../typeORM.service';
import { FirstMigration1708364261801 } from './1708364261801-first-migration';

const config: PostgresConnectionOptions = {
	type: 'postgres',
	url: process.env.DATABASE_URL as string,
	entities: [
		TypeOrmUserEntity,
		TypeOrmCondominiumEntity,
		TypeOrmCondominiumRelUserEntity,
		TypeOrmInviteEntity,
	],
	synchronize: false,
	migrationsRun: false,
	migrationsTableName: 'migration_typeorm',
	migrations: [FirstMigration1708364261801],
};

const dataSource = new TypeORMService({ ...config });
export { dataSource };
