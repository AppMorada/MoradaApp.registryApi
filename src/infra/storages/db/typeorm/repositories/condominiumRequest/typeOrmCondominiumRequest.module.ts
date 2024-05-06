import { Global, Module } from '@nestjs/common';
import { TypeOrmCondominiumRequestReadOpsModule } from './readOps/index.module';
import { TypeOrmCondominiumRequestWriteOpsModule } from './writeOps/index.module';

@Global()
@Module({
	imports: [
		TypeOrmCondominiumRequestReadOpsModule,
		TypeOrmCondominiumRequestWriteOpsModule,
	],
	exports: [
		TypeOrmCondominiumRequestReadOpsModule,
		TypeOrmCondominiumRequestWriteOpsModule,
	],
})
export class TypeOrmCondominiumRequestModule {}
