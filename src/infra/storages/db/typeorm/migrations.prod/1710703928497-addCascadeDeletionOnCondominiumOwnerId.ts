import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCascadeDeletionOnCondominiumOwnerId1710703928497
implements MigrationInterface
{
	name = 'AddCascadeDeletionOnCondominiumOwnerId1710703928497';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			'ALTER TABLE "condominiums" DROP CONSTRAINT "FK_condominiums_owner_id"',
		);
		await queryRunner.query(
			'ALTER TABLE "condominiums" ADD CONSTRAINT "FK_condominiums_owner_id" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			'ALTER TABLE "condominiums" DROP CONSTRAINT "FK_condominiums_owner_id"',
		);
		await queryRunner.query(
			'ALTER TABLE "condominiums" ADD CONSTRAINT "FK_condominiums_owner_id" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
		);
	}
}
