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
import { TypeOrmInviteEntity } from './invite.entity';

@Unique(['user', 'condominium'])
@Unique(['c_email', 'condominium'])
@Unique(['CPF', 'condominium'])
@Entity({ name: 'condominium_members' })
export class TypeOrmCondominiumMemberEntity {
	@PrimaryGeneratedColumn('uuid')
		id: string;

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
	})
		condominium: Relation<TypeOrmCondominiumEntity> | string;

	@ManyToOne(() => TypeOrmUserEntity, (user) => user.condominiumMember, {
		nullable: true,
		onDelete: 'CASCADE',
	})
	@JoinColumn({
		name: 'user_id',
		referencedColumnName: 'id',
	})
		user: Relation<TypeOrmUserEntity> | string | null;

	@OneToOne(() => TypeOrmInviteEntity, (invite) => invite.member)
		invite: Relation<TypeOrmInviteEntity>;

	@Column({ type: 'bigint', name: 'cpf' })
		CPF: string;

	@Column({ length: 320, type: 'varchar' })
		c_email: string;

	@Column({ type: 'int', name: 'apartment_number', nullable: true })
		apartmentNumber: number | null;

	@Column({ length: 6, type: 'varchar', nullable: true })
		block: string | null;

	@Column({ type: 'smallint', default: 0, name: 'auto_edit' })
		autoEdit: number;

	@CreateDateColumn({ name: 'created_at' })
		createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
		updatedAt: Date;
}
