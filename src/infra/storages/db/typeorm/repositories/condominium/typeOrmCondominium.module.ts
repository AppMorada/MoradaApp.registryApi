import { Global, Module } from '@nestjs/common';
import { TypeOrmCondominiumWriteOpsModule } from './writeOps/index.module';
import { TypeOrmCondominiumReadOpsModule } from './readOps/index.module';

@Global()
@Module({
	imports: [
		TypeOrmCondominiumWriteOpsModule,
		TypeOrmCondominiumReadOpsModule,
	],
	exports: [
		TypeOrmCondominiumWriteOpsModule,
		TypeOrmCondominiumReadOpsModule,
	],
})
export class TypeOrmCondominiumModule {}
