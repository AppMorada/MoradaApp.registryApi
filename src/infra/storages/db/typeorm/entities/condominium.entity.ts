import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	Relation,
	Unique,
	UpdateDateColumn,
} from 'typeorm';
import { TypeOrmInviteEntity } from './invite.entity';
import { TypeOrmCondominiumMemberEntity } from './condominiumMember.entity';
import { TypeOrmUserEntity } from './user.entity';

@Unique('UQ_condominiums_name', ['name'])
@Unique('UQ_condominiums_cnpj', ['CNPJ'])
@Unique('UQ_condominiums_cep', ['CEP'])
@Entity({ name: 'condominiums' })
export class TypeOrmCondominiumEntity {
	@PrimaryGeneratedColumn('uuid', {
		primaryKeyConstraintName: 'PK_condominiums_id',
	})
		id: string;

	@Column({ length: 120, type: 'varchar' })
		name: string;

	@Column({ type: 'int', name: 'cep' })
		CEP: number;

	@Column({ type: 'int' })
		num: number;

	@Column({ type: 'bigint', name: 'cnpj' })
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

	@OneToOne(() => TypeOrmUserEntity, (user) => user.condominium, {
		nullable: false,
		onDelete: 'NO ACTION',
	})
	@JoinColumn({
		name: 'owner_id',
		referencedColumnName: 'id',
		foreignKeyConstraintName: 'FK_condominiums_owner_id',
	})
		user: string;
}
