import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryColumn,
	Unique,
} from 'typeorm';
import { TypeOrmCondominiumEntity } from './condominium.entity';
import { TypeOrmCondominiumMemberEntity } from './condominiumMember.entity';

@Unique('UQ_invites_recipient_condominium_id', ['recipient', 'condominium'])
@Entity({ name: 'invites' })
export class TypeOrmInviteEntity {
	@PrimaryColumn({
		nullable: false,
		primaryKeyConstraintName: 'PK_invites_member_id',
	})
	@OneToOne(() => TypeOrmCondominiumMemberEntity, (infos) => infos.invite, {
		nullable: false,
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn({
		name: 'member_id',
		referencedColumnName: 'id',
		foreignKeyConstraintName: 'FK_invites_member_id',
	})
		member: string;

	@Column({ type: 'varchar', length: 320 })
		recipient: string;

	@Column({ type: 'varchar', length: 60 })
		code: string;

	@CreateDateColumn({ name: 'created_at' })
		createdAt: Date;

	@ManyToOne(() => TypeOrmCondominiumEntity, (member) => member.invite, {
		nullable: false,
		onDelete: 'CASCADE',
	})
	@JoinColumn({
		name: 'condominium_id',
		referencedColumnName: 'id',
		foreignKeyConstraintName: 'FK_invites_condominium_id',
	})
		condominium: string;
}
