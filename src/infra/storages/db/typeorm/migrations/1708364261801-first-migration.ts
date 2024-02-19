import { MigrationInterface, QueryRunner } from 'typeorm';

export class FirstMigration1708364261801 implements MigrationInterface {
	name = 'FirstMigration1708364261801';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			'CREATE TABLE "invites" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(320) NOT NULL, "ttl" integer NOT NULL, "expires_at" TIMESTAMP NOT NULL, "type" smallint NOT NULL DEFAULT \'0\', "condominium_id" uuid NOT NULL, CONSTRAINT "UQ_91a0c4378ab8d63d8011022960f" UNIQUE ("email", "condominium_id"), CONSTRAINT "PK_aa52e96b44a714372f4dd31a0af" PRIMARY KEY ("id"))',
		);
		await queryRunner.query(
			'CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(120) NOT NULL, "email" character varying(320) NOT NULL, "password" character varying(64) NOT NULL, "cpf" character(11) NOT NULL, "phone_number" character varying(30) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_51b8b26ac168fbe7d6f5653e6cf" UNIQUE ("name"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_230b925048540454c8b4c481e1c" UNIQUE ("cpf"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))',
		);
		await queryRunner.query(
			'CREATE TABLE "condominiumreluser" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "block" character varying(6), "apartment_number" integer, "level" smallint NOT NULL DEFAULT \'0\', "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "condominium_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "UQ_db9b0e0359d3ef2acd7bff9a97e" UNIQUE ("user_id", "condominium_id"), CONSTRAINT "PK_40607eedbb820f15dc369121ef8" PRIMARY KEY ("id"))',
		);
		await queryRunner.query(
			'CREATE TABLE "condominiums" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(120) NOT NULL, "cep" character(8) NOT NULL, "num" integer NOT NULL, "cnpj" character(14) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9c660cb468b8f0d455724033e95" UNIQUE ("name"), CONSTRAINT "UQ_b99ec9dd3af9021583ac55b2311" UNIQUE ("cep"), CONSTRAINT "UQ_72b384c406b4575f20c517d20f5" UNIQUE ("cnpj"), CONSTRAINT "PK_bb7509828f6270f35097b88e752" PRIMARY KEY ("id"))',
		);
		await queryRunner.query(
			'ALTER TABLE "invites" ADD CONSTRAINT "FK_42d7aa59cf29836a127e7391d7b" FOREIGN KEY ("condominium_id") REFERENCES "condominiums"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
		);
		await queryRunner.query(
			'ALTER TABLE "condominiumreluser" ADD CONSTRAINT "FK_660e1c8364970ef96b8b3ef527f" FOREIGN KEY ("condominium_id") REFERENCES "condominiums"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
		);
		await queryRunner.query(
			'ALTER TABLE "condominiumreluser" ADD CONSTRAINT "FK_73df2b389daddcf79c09ce57f8e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			'ALTER TABLE "condominiumreluser" DROP CONSTRAINT "FK_73df2b389daddcf79c09ce57f8e"',
		);
		await queryRunner.query(
			'ALTER TABLE "condominiumreluser" DROP CONSTRAINT "FK_660e1c8364970ef96b8b3ef527f"',
		);
		await queryRunner.query(
			'ALTER TABLE "invites" DROP CONSTRAINT "FK_42d7aa59cf29836a127e7391d7b"',
		);
		await queryRunner.query('DROP TABLE "condominiums"');
		await queryRunner.query('DROP TABLE "condominiumreluser"');
		await queryRunner.query('DROP TABLE "users"');
		await queryRunner.query('DROP TABLE "invites"');
	}
}
