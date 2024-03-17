import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	Relation,
	Unique,
	UpdateDateColumn,
} from 'typeorm';
import { TypeOrmCondominiumEntity } from './condominium.entity';
import { TypeOrmUserEntity } from './user.entity';
import { TypeOrmCommunityInfosEntity } from './communityInfos.entity';
import { TypeOrmInviteEntity } from './invite.entity';
import { TypeOrmUniqueRegistryEntity } from './uniqueRegistry.entity';

@Unique('UQ_condominium_members_user_id_condominium_id', [
	'user',
	'condominium',
])
@Entity({ name: 'condominium_members' })
export class TypeOrmCondominiumMemberEntity {
	@PrimaryGeneratedColumn('uuid', {
		primaryKeyConstraintName: 'PK_condominium_members_id',
	})
		id: string;

	@Column({ type: 'smallint', default: 0 })
		role: number;

	@CreateDateColumn({ name: 'created_at' })
		createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
		updatedAt: Date;

	@ManyToOne(
		() => TypeOrmUniqueRegistryEntity,
		(registry) => registry.member,
		{
			nullable: false,
			onDelete: 'CASCADE',
		},
	)
	@JoinColumn({
		name: 'unique_registry_id',
		referencedColumnName: 'id',
		foreignKeyConstraintName: 'FK_condominium_members_unique_registry_id',
	})
		uniqueRegistry: string | Relation<TypeOrmUniqueRegistryEntity>;

	@ManyToOne(
		() => TypeOrmCondominiumEntity,
		(condominium) => condominium.condominiumMember,
		{
			nullable: false,
			onDelete: 'CASCADE',
		},
	)
	@JoinColumn({
		name: 'condominium_id',
		referencedColumnName: 'id',
		foreignKeyConstraintName: 'FK_condominium_members_condominium_id',
	})
		condominium: string;

	@ManyToOne(() => TypeOrmUserEntity, (user) => user.condominiumMember, {
		nullable: true,
		onDelete: 'CASCADE',
	})
	@JoinColumn({
		name: 'user_id',
		referencedColumnName: 'id',
		foreignKeyConstraintName: 'FK_condominium_members_user_id',
	})
		user: string | Relation<TypeOrmUserEntity> | null;

	@OneToOne(() => TypeOrmCommunityInfosEntity, (infos) => infos.member)
		communityInfos: Relation<TypeOrmCommunityInfosEntity>;

	@OneToOne(() => TypeOrmInviteEntity, (infos) => infos.member)
		invite: Relation<TypeOrmInviteEntity>;
}
