import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	Relation,
	UpdateDateColumn,
} from 'typeorm';
import { TypeOrmCondominiumMemberEntity } from './condominiumMember.entity';
import { TypeOrmCondominiumEntity } from './condominium.entity';
import { TypeOrmUniqueRegistryEntity } from './uniqueRegistry.entity';
import { TypeOrmCondominiumRequestEntity } from './condominiumRequest.entity';

@Entity({ name: 'users' })
export class TypeOrmUserEntity {
	@PrimaryGeneratedColumn('uuid', {
		primaryKeyConstraintName: 'PK_users_id',
	})
		id: string;

	@Column({ length: 120, type: 'varchar' })
		name: string;

	@Column({ type: 'bigint', name: 'phone_number', nullable: true })
		phoneNumber: string | null;

	@Column({ length: 60, type: 'char' })
		password: string;

	@Column({ type: 'smallint', default: 0 })
		tfa: number;

	@OneToMany(() => TypeOrmCondominiumMemberEntity, (member) => member.user)
		condominiumMember: Relation<TypeOrmCondominiumMemberEntity>[];

	@OneToOne(() => TypeOrmCondominiumEntity, (condominium) => condominium.user)
		condominium: Relation<TypeOrmCondominiumEntity>;

	@CreateDateColumn({ name: 'created_at' })
		createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
		updatedAt: Date;

	@OneToOne(() => TypeOrmUniqueRegistryEntity, (registry) => registry.user, {
		nullable: false,
		onDelete: 'CASCADE',
	})
	@JoinColumn({
		name: 'unique_registry_id',
		referencedColumnName: 'id',
		foreignKeyConstraintName: 'FK_users_registry_id',
	})
		uniqueRegistry: string | Relation<TypeOrmUniqueRegistryEntity>;

	@OneToMany(() => TypeOrmCondominiumRequestEntity, (request) => request.user)
		condominiumRequest: Relation<TypeOrmCondominiumRequestEntity[]>;
}
