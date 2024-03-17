import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueRegistries1710480251681 implements MigrationInterface {
	name = 'AddUniqueRegistries1710480251681';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			'ALTER TABLE "condominium_members" DROP CONSTRAINT "FK_8300a33e38e549c0149f9d73424"',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_members" DROP CONSTRAINT "FK_14cdb225e077dc57ffd2eef1e61"',
		);
		await queryRunner.query(
			'ALTER TABLE "invites" DROP CONSTRAINT "FK_42d7aa59cf29836a127e7391d7b"',
		);
		await queryRunner.query(
			'ALTER TABLE "invites" DROP CONSTRAINT "FK_dce11b81d78d14cb6ce9f573701"',
		);
		await queryRunner.query(
			'ALTER TABLE "condominiums" DROP CONSTRAINT "FK_6b78fa2df803ad0355ebe9c476f"',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_members" DROP CONSTRAINT "UQ_15559912745339103b3470e147c"',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_members" DROP CONSTRAINT "UQ_284ea20d719d10e9ab23a529b31"',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_members" DROP CONSTRAINT "UQ_7fa95bbaabfb700de542aaaa691"',
		);
		await queryRunner.query(
			'ALTER TABLE "invites" DROP CONSTRAINT "UQ_e2e42f29fb4a509a7e5a5d9db8e"',
		);
		await queryRunner.query(
			'ALTER TABLE "invites" DROP CONSTRAINT "UQ_aaed78f6a737fe6318b8f151600"',
		);
		await queryRunner.query(
			'ALTER TABLE "users" RENAME COLUMN "email" TO "unique_registry_id"',
		);
		await queryRunner.query(
			'ALTER TABLE "users" RENAME CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" TO "UQ_9a2c510fa5c6e0069f4bd406a1f"',
		);
		await queryRunner.query(
			'ALTER TABLE "invites" RENAME COLUMN "id" TO "member"',
		);
		await queryRunner.query(
			'ALTER TABLE "invites" RENAME CONSTRAINT "PK_aa52e96b44a714372f4dd31a0af" TO "PK_f9ea8e222f455402376018d7637"',
		);
		await queryRunner.query(
			'CREATE TABLE "unique_registries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cpf" bigint, "email" character varying(320) NOT NULL, CONSTRAINT "UQ_unique_registries_email" UNIQUE ("email"), CONSTRAINT "PK_unique_registry_id" PRIMARY KEY ("id"))',
		);
		await queryRunner.query(
			'CREATE TABLE "community_infos" ("member_id" uuid NOT NULL, "apartment_number" integer NOT NULL, "block" character varying(6) NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_edcaa78a36b9f80c7265576503b" PRIMARY KEY ("member_id"))',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_members" DROP COLUMN "cpf"',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_members" DROP COLUMN "c_email"',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_members" DROP COLUMN "apartment_number"',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_members" DROP COLUMN "block"',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_members" DROP COLUMN "auto_edit"',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_members" ADD "role" smallint NOT NULL DEFAULT \'0\'',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_members" ADD "unique_registry_id" uuid NOT NULL',
		);
		await queryRunner.query(
			'ALTER TABLE "users" DROP CONSTRAINT "UQ_9a2c510fa5c6e0069f4bd406a1f"',
		);
		await queryRunner.query(
			'ALTER TABLE "users" DROP COLUMN "unique_registry_id"',
		);
		await queryRunner.query(
			'ALTER TABLE "users" ADD "unique_registry_id" uuid NOT NULL',
		);
		await queryRunner.query(
			'ALTER TABLE "users" ADD CONSTRAINT "UQ_9a2c510fa5c6e0069f4bd406a1f" UNIQUE ("unique_registry_id")',
		);
		await queryRunner.query(
			'ALTER TABLE "invites" DROP CONSTRAINT "PK_f9ea8e222f455402376018d7637"',
		);
		await queryRunner.query('ALTER TABLE "invites" DROP COLUMN "member"');
		await queryRunner.query(
			'ALTER TABLE "invites" ADD "member" character varying NOT NULL',
		);
		await queryRunner.query(
			'ALTER TABLE "invites" ADD CONSTRAINT "PK_f9ea8e222f455402376018d7637" PRIMARY KEY ("member")',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_members" ADD CONSTRAINT "UQ_condominium_members_user_id_condominium_id" UNIQUE ("user_id", "condominium_id")',
		);
		await queryRunner.query(
			'ALTER TABLE "invites" ADD CONSTRAINT "UQ_invites_recipient_condominium_id" UNIQUE ("recipient", "condominium_id")',
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
			'ALTER TABLE "invites" ADD CONSTRAINT "FK_invites_member_id" FOREIGN KEY ("member_id") REFERENCES "condominium_members"("id") ON DELETE CASCADE ON UPDATE CASCADE',
		);
		await queryRunner.query(
			'ALTER TABLE "invites" ADD CONSTRAINT "FK_invites_condominium_id" FOREIGN KEY ("condominium_id") REFERENCES "condominiums"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
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
			'ALTER TABLE "invites" DROP CONSTRAINT "FK_invites_condominium_id"',
		);
		await queryRunner.query(
			'ALTER TABLE "invites" DROP CONSTRAINT "FK_invites_member_id"',
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
			'ALTER TABLE "invites" DROP CONSTRAINT "UQ_invites_recipient_condominium_id"',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_members" DROP CONSTRAINT "UQ_condominium_members_user_id_condominium_id"',
		);
		await queryRunner.query(
			'ALTER TABLE "invites" DROP CONSTRAINT "PK_f9ea8e222f455402376018d7637"',
		);
		await queryRunner.query('ALTER TABLE "invites" DROP COLUMN "member"');
		await queryRunner.query(
			'ALTER TABLE "invites" ADD "member" uuid NOT NULL DEFAULT uuid_generate_v4()',
		);
		await queryRunner.query(
			'ALTER TABLE "invites" ADD CONSTRAINT "PK_f9ea8e222f455402376018d7637" PRIMARY KEY ("member")',
		);
		await queryRunner.query(
			'ALTER TABLE "users" DROP CONSTRAINT "UQ_9a2c510fa5c6e0069f4bd406a1f"',
		);
		await queryRunner.query(
			'ALTER TABLE "users" DROP COLUMN "unique_registry_id"',
		);
		await queryRunner.query(
			'ALTER TABLE "users" ADD "unique_registry_id" character varying(320) NOT NULL',
		);
		await queryRunner.query(
			'ALTER TABLE "users" ADD CONSTRAINT "UQ_9a2c510fa5c6e0069f4bd406a1f" UNIQUE ("unique_registry_id")',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_members" DROP COLUMN "unique_registry_id"',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_members" DROP COLUMN "role"',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_members" ADD "auto_edit" smallint NOT NULL DEFAULT \'0\'',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_members" ADD "block" character varying(6)',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_members" ADD "apartment_number" integer',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_members" ADD "c_email" character varying(320) NOT NULL',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_members" ADD "cpf" bigint NOT NULL',
		);
		await queryRunner.query('DROP TABLE "community_infos"');
		await queryRunner.query('DROP TABLE "unique_registries"');
		await queryRunner.query(
			'ALTER TABLE "invites" RENAME CONSTRAINT "PK_f9ea8e222f455402376018d7637" TO "PK_aa52e96b44a714372f4dd31a0af"',
		);
		await queryRunner.query(
			'ALTER TABLE "invites" RENAME COLUMN "member" TO "id"',
		);
		await queryRunner.query(
			'ALTER TABLE "users" RENAME CONSTRAINT "UQ_9a2c510fa5c6e0069f4bd406a1f" TO "UQ_97672ac88f789774dd47f7c8be3"',
		);
		await queryRunner.query(
			'ALTER TABLE "users" RENAME COLUMN "unique_registry_id" TO "email"',
		);
		await queryRunner.query(
			'ALTER TABLE "invites" ADD CONSTRAINT "UQ_aaed78f6a737fe6318b8f151600" UNIQUE ("condominium_id", "member_id")',
		);
		await queryRunner.query(
			'ALTER TABLE "invites" ADD CONSTRAINT "UQ_e2e42f29fb4a509a7e5a5d9db8e" UNIQUE ("recipient", "condominium_id")',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_members" ADD CONSTRAINT "UQ_7fa95bbaabfb700de542aaaa691" UNIQUE ("condominium_id", "user_id")',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_members" ADD CONSTRAINT "UQ_284ea20d719d10e9ab23a529b31" UNIQUE ("c_email", "condominium_id")',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_members" ADD CONSTRAINT "UQ_15559912745339103b3470e147c" UNIQUE ("cpf", "condominium_id")',
		);
		await queryRunner.query(
			'ALTER TABLE "condominiums" ADD CONSTRAINT "FK_6b78fa2df803ad0355ebe9c476f" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
		);
		await queryRunner.query(
			'ALTER TABLE "invites" ADD CONSTRAINT "FK_dce11b81d78d14cb6ce9f573701" FOREIGN KEY ("member_id") REFERENCES "condominium_members"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
		);
		await queryRunner.query(
			'ALTER TABLE "invites" ADD CONSTRAINT "FK_42d7aa59cf29836a127e7391d7b" FOREIGN KEY ("condominium_id") REFERENCES "condominiums"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_members" ADD CONSTRAINT "FK_14cdb225e077dc57ffd2eef1e61" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
		);
		await queryRunner.query(
			'ALTER TABLE "condominium_members" ADD CONSTRAINT "FK_8300a33e38e549c0149f9d73424" FOREIGN KEY ("condominium_id") REFERENCES "condominiums"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
		);
	}
}
