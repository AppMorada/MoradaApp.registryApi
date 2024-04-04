import { MigrationInterface, QueryRunner } from 'typeorm';

export class FirstProdMigration1712250638388 implements MigrationInterface {
	name = 'FirstProdMigration1712250638388';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			'CREATE TABLE "condominium_requests" ("user" uuid NOT NULL, "condominium" uuid NOT NULL, "message" varchar(320), "created_at" timestamptz NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "condominium_id" uuid NOT NULL, "unique_registry_id" uuid NOT NULL, CONSTRAINT "UQ_condominium_requests_user_condominium_id" UNIQUE ("user", "condominium"), CONSTRAINT "PK_condominium_requests_user_id_condominium_id" PRIMARY KEY ("user", "condominium"))',
		);
		await queryRunner.query(
			'CREATE INDEX "IDX_c5a425c8bed71421d1a9ac4a78" ON "condominium_requests" ("user_id") ',
		);
		await queryRunner.query(
			'CREATE INDEX "IDX_c230a80c2250b1c067b6b67129" ON "condominium_requests" ("condominium_id") ',
		);
		await queryRunner.query(
			'CREATE INDEX "IDX_ca2b87b0bfa1c838e25151d854" ON "condominium_requests" ("unique_registry_id") ',
		);
		await queryRunner.query(
			'CREATE TABLE "unique_registries" ("id" UUID DEFAULT gen_random_uuid() NOT NULL, "cpf" int8, "email" varchar(320) NOT NULL, CONSTRAINT "UQ_unique_registries_email" UNIQUE ("email"), CONSTRAINT "PK_unique_registry_id" PRIMARY KEY ("id"))',
		);
		await queryRunner.query(
			'CREATE TABLE "users" ("id" UUID DEFAULT gen_random_uuid() NOT NULL, "name" varchar(120) NOT NULL, "phone_number" int8, "password" char(60) NOT NULL, "tfa" int2 NOT NULL DEFAULT (0), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "unique_registry_id" uuid NOT NULL, CONSTRAINT "REL_9a2c510fa5c6e0069f4bd406a1" UNIQUE ("unique_registry_id"), CONSTRAINT "PK_users_id" PRIMARY KEY ("id"))',
		);
		await queryRunner.query(
			'CREATE INDEX "IDX_9a2c510fa5c6e0069f4bd406a1" ON "users" ("unique_registry_id") ',
		);
		await queryRunner.query(
			'CREATE TABLE "community_infos" ("member_id" uuid NOT NULL, "apartment_number" int8, "block" varchar(12), "updated_at" timestamptz NOT NULL DEFAULT now(), CONSTRAINT "PK_edcaa78a36b9f80c7265576503b" PRIMARY KEY ("member_id"))',
		);
		await queryRunner.query(
			'CREATE INDEX "IDX_edcaa78a36b9f80c7265576503" ON "community_infos" ("member_id") ',
		);
		await queryRunner.query(
			'CREATE TABLE "condominium_members" ("id" UUID DEFAULT gen_random_uuid() NOT NULL, "role" int2 NOT NULL DEFAULT (0), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "unique_registry_id" uuid NOT NULL, "condominium_id" uuid NOT NULL, "user_id" uuid, CONSTRAINT "UQ_condominium_members_unique_registry_id_condominium_id" UNIQUE ("unique_registry_id", "condominium_id"), CONSTRAINT "PK_condominium_members_id" PRIMARY KEY ("id"))',
		);
		await queryRunner.query(
			'CREATE INDEX "IDX_19407e343d902e11d0190554b4" ON "condominium_members" ("unique_registry_id") ',
		);
		await queryRunner.query(
			'CREATE INDEX "IDX_8300a33e38e549c0149f9d7342" ON "condominium_members" ("condominium_id") ',
		);
		await queryRunner.query(
			'CREATE INDEX "IDX_14cdb225e077dc57ffd2eef1e6" ON "condominium_members" ("user_id") ',
		);
		await queryRunner.query(
			'CREATE TABLE "condominiums" ("id" UUID DEFAULT gen_random_uuid() NOT NULL, "human_readable_id" char(6) NOT NULL, "name" varchar(120) NOT NULL, "cep" int8 NOT NULL, "num" int8 NOT NULL, "cnpj" int8 NOT NULL, "reference" varchar(60) NOT NULL, "district" varchar(140) NOT NULL, "city" varchar(140) NOT NULL, "state" varchar(140) NOT NULL, "complement" varchar(60) NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "owner_id" uuid NOT NULL, CONSTRAINT "UQ_human_readable_id" UNIQUE ("human_readable_id"), CONSTRAINT "UQ_condominiums_cep" UNIQUE ("cep"), CONSTRAINT "UQ_condominiums_cnpj" UNIQUE ("cnpj"), CONSTRAINT "UQ_condominiums_name" UNIQUE ("name"), CONSTRAINT "REL_6b78fa2df803ad0355ebe9c476" UNIQUE ("owner_id"), CONSTRAINT "PK_condominiums_id" PRIMARY KEY ("id"))',
		);
		await queryRunner.query(
			'CREATE INDEX "IDX_6b78fa2df803ad0355ebe9c476" ON "condominiums" ("owner_id") ',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_requests" ADD CONSTRAINT "FK_condominium_requests_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_requests" ADD CONSTRAINT "FK_condominium_requests_condominium_id" FOREIGN KEY ("condominium_id") REFERENCES "condominiums"("id") ON DELETE CASCADE ON UPDATE CASCADE',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_requests" ADD CONSTRAINT "FK_condominium_requests_unique_registry_id" FOREIGN KEY ("unique_registry_id") REFERENCES "unique_registries"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
		);
		await queryRunner.query(
			'ALTER TABLE "users" ADD CONSTRAINT "FK_users_registry_id" FOREIGN KEY ("unique_registry_id") REFERENCES "unique_registries"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
		);
		await queryRunner.query(
			'ALTER TABLE "community_infos" ADD CONSTRAINT "FK_community_infos_member_id" FOREIGN KEY ("member_id") REFERENCES "condominium_members"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_members" ADD CONSTRAINT "FK_condominium_members_unique_registry_id" FOREIGN KEY ("unique_registry_id") REFERENCES "unique_registries"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_members" ADD CONSTRAINT "FK_condominium_members_condominium_id" FOREIGN KEY ("condominium_id") REFERENCES "condominiums"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_members" ADD CONSTRAINT "FK_condominium_members_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
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
			'ALTER TABLE "condominium_members" DROP CONSTRAINT "FK_condominium_members_user_id"',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_members" DROP CONSTRAINT "FK_condominium_members_condominium_id"',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_members" DROP CONSTRAINT "FK_condominium_members_unique_registry_id"',
		);
		await queryRunner.query(
			'ALTER TABLE "community_infos" DROP CONSTRAINT "FK_community_infos_member_id"',
		);
		await queryRunner.query(
			'ALTER TABLE "users" DROP CONSTRAINT "FK_users_registry_id"',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_requests" DROP CONSTRAINT "FK_condominium_requests_unique_registry_id"',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_requests" DROP CONSTRAINT "FK_condominium_requests_condominium_id"',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_requests" DROP CONSTRAINT "FK_condominium_requests_user_id"',
		);
		await queryRunner.query(
			'DROP INDEX "condominiums"@"IDX_6b78fa2df803ad0355ebe9c476" CASCADE',
		);
		await queryRunner.query('DROP TABLE "condominiums"');
		await queryRunner.query(
			'DROP INDEX "condominium_members"@"IDX_14cdb225e077dc57ffd2eef1e6" CASCADE',
		);
		await queryRunner.query(
			'DROP INDEX "condominium_members"@"IDX_8300a33e38e549c0149f9d7342" CASCADE',
		);
		await queryRunner.query(
			'DROP INDEX "condominium_members"@"IDX_19407e343d902e11d0190554b4" CASCADE',
		);
		await queryRunner.query('DROP TABLE "condominium_members"');
		await queryRunner.query(
			'DROP INDEX "community_infos"@"IDX_edcaa78a36b9f80c7265576503" CASCADE',
		);
		await queryRunner.query('DROP TABLE "community_infos"');
		await queryRunner.query(
			'DROP INDEX "users"@"IDX_9a2c510fa5c6e0069f4bd406a1" CASCADE',
		);
		await queryRunner.query('DROP TABLE "users"');
		await queryRunner.query('DROP TABLE "unique_registries"');
		await queryRunner.query(
			'DROP INDEX "condominium_requests"@"IDX_ca2b87b0bfa1c838e25151d854" CASCADE',
		);
		await queryRunner.query(
			'DROP INDEX "condominium_requests"@"IDX_c230a80c2250b1c067b6b67129" CASCADE',
		);
		await queryRunner.query(
			'DROP INDEX "condominium_requests"@"IDX_c5a425c8bed71421d1a9ac4a78" CASCADE',
		);
		await queryRunner.query('DROP TABLE "condominium_requests"');
	}
}
