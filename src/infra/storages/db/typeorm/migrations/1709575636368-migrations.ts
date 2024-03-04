import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1709575636368 implements MigrationInterface {
	name = 'Migrations1709575636368';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			'CREATE TABLE "invites" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "recipient" character varying(320) NOT NULL, "cpf" bigint NOT NULL, "hierarchy" smallint NOT NULL DEFAULT \'0\', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "condominium_id" uuid NOT NULL, CONSTRAINT "UQ_fb962e7bcd5f98cdb8b98abb9d6" UNIQUE ("cpf", "condominium_id"), CONSTRAINT "UQ_e2e42f29fb4a509a7e5a5d9db8e" UNIQUE ("recipient", "condominium_id"), CONSTRAINT "PK_aa52e96b44a714372f4dd31a0af" PRIMARY KEY ("id"))',
		);
		await queryRunner.query(
			'CREATE TABLE "enterprise_members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "hierarchy" smallint NOT NULL DEFAULT \'0\', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "condominium_id" uuid NOT NULL, CONSTRAINT "UQ_87e0d48e0b88dd71fb048319df3" UNIQUE ("user_id", "condominium_id"), CONSTRAINT "REL_045ab85f2e1e678d08ad910f02" UNIQUE ("user_id"), CONSTRAINT "PK_c1144a402891d4cd092913b6d51" PRIMARY KEY ("id"))',
		);
		await queryRunner.query(
			'CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(120) NOT NULL, "email" character varying(320) NOT NULL, "phone_number" bigint, "cpf" bigint NOT NULL, "password" character(60) NOT NULL, "tfa" smallint NOT NULL DEFAULT \'0\', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))',
		);
		await queryRunner.query(
			'CREATE TABLE "condominium_members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "c_email" character varying(320) NOT NULL, "hierarchy" smallint NOT NULL DEFAULT \'0\', "apartment_number" integer, "block" character varying(6), "auto_edit" smallint NOT NULL DEFAULT \'0\', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "condominium_id" uuid NOT NULL, "user_id" uuid, CONSTRAINT "UQ_284ea20d719d10e9ab23a529b31" UNIQUE ("c_email", "condominium_id"), CONSTRAINT "UQ_7fa95bbaabfb700de542aaaa691" UNIQUE ("user_id", "condominium_id"), CONSTRAINT "PK_6ff037a5659872d22b490adb2c9" PRIMARY KEY ("id"))',
		);
		await queryRunner.query(
			'CREATE TABLE "condominiums" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(120) NOT NULL, "cep" integer NOT NULL, "num" integer NOT NULL, "cnpj" bigint NOT NULL, "seed_key" character varying(60) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "owner_id" uuid NOT NULL, CONSTRAINT "UQ_9c660cb468b8f0d455724033e95" UNIQUE ("name"), CONSTRAINT "UQ_b99ec9dd3af9021583ac55b2311" UNIQUE ("cep"), CONSTRAINT "UQ_72b384c406b4575f20c517d20f5" UNIQUE ("cnpj"), CONSTRAINT "REL_6b78fa2df803ad0355ebe9c476" UNIQUE ("owner_id"), CONSTRAINT "PK_bb7509828f6270f35097b88e752" PRIMARY KEY ("id"))',
		);
		await queryRunner.query(
			'ALTER TABLE "invites" ADD CONSTRAINT "FK_42d7aa59cf29836a127e7391d7b" FOREIGN KEY ("condominium_id") REFERENCES "condominiums"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
		);
		await queryRunner.query(
			'ALTER TABLE "enterprise_members" ADD CONSTRAINT "FK_045ab85f2e1e678d08ad910f025" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
		);
		await queryRunner.query(
			'ALTER TABLE "enterprise_members" ADD CONSTRAINT "FK_9b881b02509468b500111bd8019" FOREIGN KEY ("condominium_id") REFERENCES "condominiums"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_members" ADD CONSTRAINT "FK_8300a33e38e549c0149f9d73424" FOREIGN KEY ("condominium_id") REFERENCES "condominiums"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_members" ADD CONSTRAINT "FK_14cdb225e077dc57ffd2eef1e61" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
		);
		await queryRunner.query(
			'ALTER TABLE "condominiums" ADD CONSTRAINT "FK_6b78fa2df803ad0355ebe9c476f" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			'ALTER TABLE "condominiums" DROP CONSTRAINT "FK_6b78fa2df803ad0355ebe9c476f"',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_members" DROP CONSTRAINT "FK_14cdb225e077dc57ffd2eef1e61"',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_members" DROP CONSTRAINT "FK_8300a33e38e549c0149f9d73424"',
		);
		await queryRunner.query(
			'ALTER TABLE "enterprise_members" DROP CONSTRAINT "FK_9b881b02509468b500111bd8019"',
		);
		await queryRunner.query(
			'ALTER TABLE "enterprise_members" DROP CONSTRAINT "FK_045ab85f2e1e678d08ad910f025"',
		);
		await queryRunner.query(
			'ALTER TABLE "invites" DROP CONSTRAINT "FK_42d7aa59cf29836a127e7391d7b"',
		);
		await queryRunner.query('DROP TABLE "condominiums"');
		await queryRunner.query('DROP TABLE "condominium_members"');
		await queryRunner.query('DROP TABLE "users"');
		await queryRunner.query('DROP TABLE "enterprise_members"');
		await queryRunner.query('DROP TABLE "invites"');
	}
}
