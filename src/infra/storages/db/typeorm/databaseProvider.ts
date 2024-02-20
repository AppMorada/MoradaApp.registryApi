import { EnvEnum, GetEnvService } from '@infra/configs/getEnv.service';
import { typeORMConsts } from './consts';
import { TypeORMService } from './typeORM.service';
import { TypeOrmUserEntity } from './entities/user.entity';
import { TypeOrmCondominiumEntity } from './entities/condominium.entity';
import { TypeOrmCondominiumRelUserEntity } from './entities/condominiumRelUser.entity';
import { TypeOrmInviteEntity } from './entities/invite.entity';
import { FirstMigration1708364261801 } from './migrations/1708364261801-first-migration';

export const databaseProviders = [
	{
		inject: [GetEnvService],
		provide: typeORMConsts.databaseProviders,
		useFactory: async (getEnv: GetEnvService) => {
			const { env: DATABASE_URL } = await getEnv.exec({
				env: EnvEnum.DATABASE_URL,
			});
			const { env: NODE_ENV } = await getEnv.exec({
				env: EnvEnum.NODE_ENV,
			});

			return new TypeORMService({
				logger:
					NODE_ENV !== 'production' ? 'simple-console' : undefined,
				logging: [
					'log',
					'warn',
					'info',
					'query',
					'error',
					'schema',
					'migration',
				],
				type: 'postgres',
				url: DATABASE_URL as string,
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
			}).initialize();
		},
	},
];
