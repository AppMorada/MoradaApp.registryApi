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
} from 'typeorm';
import { TypeOrmCondominiumEntity } from './condominium.entity';
import { TypeOrmCondominiumMemberEntity } from './condominiumMember.entity';

@Unique(['member', 'condominium'])
@Unique(['recipient', 'condominium'])
@Entity({ name: 'invites' })
export class TypeOrmInviteEntity {
	@PrimaryGeneratedColumn('uuid')
		id: string;

	@ManyToOne(
		() => TypeOrmCondominiumEntity,
		(condominium) => condominium.invite,
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

	@OneToOne(() => TypeOrmCondominiumMemberEntity, (member) => member.invite, {
		nullable: false,
		onDelete: 'CASCADE',
	})
	@JoinColumn({
		name: 'member_id',
		referencedColumnName: 'id',
	})
		member: Relation<TypeOrmCondominiumMemberEntity> | string;

	@Column({ length: 320, type: 'varchar' })
		recipient: string;

	@Column({ name: 'code', type: 'varchar', length: 60 })
		code: string;

	@CreateDateColumn({ name: 'created_at' })
		createdAt: Date;
}
