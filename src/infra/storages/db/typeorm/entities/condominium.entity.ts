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
import { TypeOrmInviteEntity } from './invite.entity';
import { TypeOrmCondominiumMemberEntity } from './condominiumMember.entity';
import { TypeOrmEnterpriseMemberEntity } from './enterpriseMember.entity';
import { TypeOrmUserEntity } from './user.entity';

@Entity({ name: 'condominiums' })
export class TypeOrmCondominiumEntity {
	@PrimaryGeneratedColumn('uuid')
		id: string;

	@OneToOne(() => TypeOrmUserEntity, (user) => user.condominium, {
		nullable: false,
		onDelete: 'NO ACTION',
	})
	@JoinColumn({
		name: 'owner_id',
		referencedColumnName: 'id',
	})
		user: Relation<TypeOrmUserEntity> | string;

	@Column({ length: 120, type: 'varchar', unique: true })
		name: string;

	@Column({ type: 'int', unique: true, name: 'cep' })
		CEP: number;

	@Column({ type: 'int' })
		num: number;

	@Column({ type: 'bigint', unique: true, name: 'cnpj' })
		CNPJ: string;

	@Column({ name: 'seed_key', type: 'varchar', length: 60 })
		seed_key: string;

	@CreateDateColumn({ name: 'created_at' })
		createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
		updatedAt: Date;

	@OneToMany(() => TypeOrmInviteEntity, (invite) => invite.condominium)
		invite: Relation<TypeOrmInviteEntity>[];

	@OneToMany(
		() => TypeOrmCondominiumMemberEntity,
		(member) => member.condominium,
	)
		condominiumMember: Relation<TypeOrmCondominiumMemberEntity>[];

	@OneToMany(
		() => TypeOrmEnterpriseMemberEntity,
		(member) => member.condominium,
	)
		enterpriseMember: Relation<TypeOrmEnterpriseMemberEntity>[];
}
