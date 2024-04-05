import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexAndFixForgottenNullablesFields1712355164981
implements MigrationInterface
{
	name = 'AddIndexAndFixForgottenNullablesFields1712355164981';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			'ALTER TABLE "condominiums" ALTER COLUMN "reference" DROP NOT NULL',
		);
		await queryRunner.query(
			'ALTER TABLE "condominiums" ALTER COLUMN "complement" DROP NOT NULL',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_members" ADD CONSTRAINT "UQ_condominium_members_user_id_condominium_id" UNIQUE ("user_id", "condominium_id")',
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			'DROP INDEX "condominium_members"@"UQ_condominium_members_user_id_condominium_id" CASCADE',
		);
		await queryRunner.query(
			'ALTER TABLE "condominiums" ALTER COLUMN "complement" SET NOT NULL',
		);
		await queryRunner.query(
			'ALTER TABLE "condominiums" ALTER COLUMN "reference" SET NOT NULL',
		);
	}
}
