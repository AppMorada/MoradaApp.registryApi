import { Global, Module } from '@nestjs/common';
import { TypeOrmUserReadOpsModule } from './readOps/index.module';
import { TypeOrmUserWriteOpsModule } from './writeOps/index.module';

@Global()
@Module({
	imports: [TypeOrmUserReadOpsModule, TypeOrmUserWriteOpsModule],
	exports: [TypeOrmUserReadOpsModule, TypeOrmUserWriteOpsModule],
})
export class TypeOrmUserModule {}
