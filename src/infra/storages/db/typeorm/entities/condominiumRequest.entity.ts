import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
	Relation,
	Unique,
} from 'typeorm';
import { TypeOrmCondominiumEntity } from './condominium.entity';
import { TypeOrmUserEntity } from './user.entity';
import { TypeOrmUniqueRegistryEntity } from './uniqueRegistry.entity';

@Unique('UQ_condominium_requests_user_condominium_id', ['user', 'condominium'])
@Entity({ name: 'condominium_requests' })
export class TypeOrmCondominiumRequestEntity {
	@PrimaryColumn({
		nullable: false,
		unique: false,
		primaryKeyConstraintName:
			'PK_condominium_requests_user_id_condominium_id',
		type: 'uuid',
	})
	@ManyToOne(() => TypeOrmUserEntity, (user) => user.condominiumRequest, {
		nullable: false,
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn({
		name: 'user_id',
		referencedColumnName: 'id',
		foreignKeyConstraintName: 'FK_condominium_requests_user_id',
	})
		user: TypeOrmUserEntity | string;

	@PrimaryColumn({
		nullable: false,
		unique: false,
		primaryKeyConstraintName:
			'PK_condominium_requests_user_id_condominium_id',
		type: 'uuid',
	})
	@ManyToOne(
		() => TypeOrmCondominiumEntity,
		(condominium) => condominium.condominiumRequest,
		{
			nullable: false,
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE',
		},
	)
	@JoinColumn({
		name: 'condominium_id',
		referencedColumnName: 'id',
		foreignKeyConstraintName: 'FK_condominium_requests_condominium_id',
	})
		condominium: TypeOrmCondominiumEntity | string;

	@Column({ type: 'varchar', length: 320, nullable: true })
		message: string | null;

	@CreateDateColumn({ name: 'created_at' })
		createdAt: Date;

	@ManyToOne(
		() => TypeOrmUniqueRegistryEntity,
		(registry) => registry.condominiumRequest,
		{
			nullable: false,
			onDelete: 'CASCADE',
		},
	)
	@JoinColumn({
		name: 'unique_registry_id',
		referencedColumnName: 'id',
		foreignKeyConstraintName: 'FK_condominium_requests_unique_registry_id',
	})
		uniqueRegistry: string | Relation<TypeOrmUniqueRegistryEntity>;
}
