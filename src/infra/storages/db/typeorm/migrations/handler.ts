import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { TypeOrmCondominiumEntity } from '../entities/condominium.entity';
import { TypeOrmInviteEntity } from '../entities/invite.entity';
import { TypeOrmUserEntity } from '../entities/user.entity';
import { TypeORMService } from '../typeORM.service';
import { TypeOrmCondominiumMemberEntity } from '../entities/condominiumMember.entity';
import { TypeOrmEnterpriseMemberEntity } from '../entities/enterpriseMember.entity';
import { Migrations1709706321663 } from './1709706321663-migrations';

const config: PostgresConnectionOptions = {
	type: 'postgres',
	url: process.env.DATABASE_URL as string,
	entities: [
		TypeOrmUserEntity,
		TypeOrmCondominiumEntity,
		TypeOrmCondominiumMemberEntity,
		TypeOrmEnterpriseMemberEntity,
		TypeOrmInviteEntity,
	],
	synchronize: false,
	migrationsRun: false,
	migrationsTableName: 'migration_typeorm',
	migrations: [Migrations1709706321663],
};

const dataSource = new TypeORMService({ ...config });
export { dataSource };
