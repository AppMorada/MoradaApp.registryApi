import { MigrationInterface, QueryRunner } from 'typeorm';

export class FirstMigration1712034171104 implements MigrationInterface {
	name = 'FirstMigration1712034171104';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			'ALTER TABLE "condominiums" DROP CONSTRAINT "UQ_human_readable_id"',
		);
		await queryRunner.query(
			'ALTER TABLE "condominiums" DROP COLUMN "human_readable_id"',
		);
		await queryRunner.query(
			'ALTER TABLE "condominiums" ADD "human_readable_id" character(6) NOT NULL',
		);
		await queryRunner.query(
			'ALTER TABLE "condominiums" ADD CONSTRAINT "UQ_510758b3bef71758f1be65db31e" UNIQUE ("human_readable_id")',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_requests" ADD CONSTRAINT "UQ_condominium_requests_user_condominium_id" UNIQUE ("user", "condominium")',
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			'ALTER TABLE "condominium_requests" DROP CONSTRAINT "UQ_condominium_requests_user_condominium_id"',
		);
		await queryRunner.query(
			'ALTER TABLE "condominiums" DROP CONSTRAINT "UQ_510758b3bef71758f1be65db31e"',
		);
		await queryRunner.query(
			'ALTER TABLE "condominiums" DROP COLUMN "human_readable_id"',
		);
		await queryRunner.query(
			'ALTER TABLE "condominiums" ADD "human_readable_id" character(8) NOT NULL',
		);
		await queryRunner.query(
			'ALTER TABLE "condominiums" ADD CONSTRAINT "UQ_human_readable_id" UNIQUE ("human_readable_id")',
		);
	}
}
