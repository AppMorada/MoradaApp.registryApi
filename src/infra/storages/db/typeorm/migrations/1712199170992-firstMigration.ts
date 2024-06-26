import { MigrationInterface, QueryRunner } from 'typeorm';

export class FirstMigration1712199170992 implements MigrationInterface {
	name = 'FirstMigration1712199170992';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			'CREATE TABLE "condominium_requests" ("user" uuid NOT NULL, "condominium" uuid NOT NULL, "message" character varying(320), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "condominium_id" uuid NOT NULL, "unique_registry_id" uuid NOT NULL, CONSTRAINT "UQ_condominium_requests_user_condominium_id" UNIQUE ("user", "condominium"), CONSTRAINT "PK_condominium_requests_user_id_condominium_id" PRIMARY KEY ("user", "condominium"))',
		);
		await queryRunner.query(
			'CREATE TABLE "unique_registries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cpf" bigint, "email" character varying(320) NOT NULL, CONSTRAINT "UQ_unique_registries_email" UNIQUE ("email"), CONSTRAINT "PK_unique_registry_id" PRIMARY KEY ("id"))',
		);
		await queryRunner.query(
			'CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(120) NOT NULL, "phone_number" bigint, "password" character(60) NOT NULL, "tfa" smallint NOT NULL DEFAULT \'0\', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "unique_registry_id" uuid NOT NULL, CONSTRAINT "REL_9a2c510fa5c6e0069f4bd406a1" UNIQUE ("unique_registry_id"), CONSTRAINT "PK_users_id" PRIMARY KEY ("id"))',
		);
		await queryRunner.query(
			'CREATE TABLE "community_infos" ("member_id" uuid NOT NULL, "apartment_number" integer, "block" character varying(12), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_edcaa78a36b9f80c7265576503b" PRIMARY KEY ("member_id"))',
		);
		await queryRunner.query(
			'CREATE TABLE "condominium_members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" smallint NOT NULL DEFAULT \'0\', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "unique_registry_id" uuid NOT NULL, "condominium_id" uuid NOT NULL, "user_id" uuid, CONSTRAINT "UQ_condominium_members_unique_registry_id_condominium_id" UNIQUE ("unique_registry_id", "condominium_id"), CONSTRAINT "PK_condominium_members_id" PRIMARY KEY ("id"))',
		);
		await queryRunner.query(
			'CREATE TABLE "condominiums" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "human_readable_id" character(6) NOT NULL, "name" character varying(120) NOT NULL, "cep" integer NOT NULL, "num" integer NOT NULL, "cnpj" bigint NOT NULL, "reference" character varying(60) NOT NULL, "district" character varying(140) NOT NULL, "city" character varying(140) NOT NULL, "state" character varying(140) NOT NULL, "complement" character varying(60) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "owner_id" uuid NOT NULL, CONSTRAINT "UQ_human_readable_id" UNIQUE ("human_readable_id"), CONSTRAINT "UQ_condominiums_cep" UNIQUE ("cep"), CONSTRAINT "UQ_condominiums_cnpj" UNIQUE ("cnpj"), CONSTRAINT "UQ_condominiums_name" UNIQUE ("name"), CONSTRAINT "REL_6b78fa2df803ad0355ebe9c476" UNIQUE ("owner_id"), CONSTRAINT "PK_condominiums_id" PRIMARY KEY ("id"))',
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
		await queryRunner.query('DROP TABLE "condominiums"');
		await queryRunner.query('DROP TABLE "condominium_members"');
		await queryRunner.query('DROP TABLE "community_infos"');
		await queryRunner.query('DROP TABLE "users"');
		await queryRunner.query('DROP TABLE "unique_registries"');
		await queryRunner.query('DROP TABLE "condominium_requests"');
	}
}
